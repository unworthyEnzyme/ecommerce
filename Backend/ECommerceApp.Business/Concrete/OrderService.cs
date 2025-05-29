using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Order;
using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.DataAccess.Concrete.EntityFramework;
using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Business.Concrete
{
  public class OrderService : IOrderService
  {
    private readonly AppDbContext _context;
    private readonly IVariantRepository _variantRepository;
    public OrderService(AppDbContext context, IVariantRepository variantRepository)
    {
      _context = context;
      _variantRepository = variantRepository;
    }
    public int CreateOrder(CreateOrderDto orderDto, int userId)
    {
      using (var transaction = _context.Database.BeginTransaction())
      {
        try
        {
          // Create shipping address
          var shippingAddress = new ShippingAddress
          {
            AddressLine1 = orderDto.Address,
            AddressLine2 = orderDto.Address,
            City = orderDto.City,
            Country = orderDto.Country,
            PostalCode = orderDto.PostalCode,
            PhoneNumber = orderDto.PhoneNumber,
            CreatedAt = DateTime.Now,
            State = orderDto.City,
            IsActive = true
          };
          _context.ShippingAddresses.Add(shippingAddress);
          _context.SaveChanges();

          // Calculate total amount and validate stock
          decimal totalAmount = 0;
          var itemsWithVariants = orderDto.Items.Select(item =>
          {
            var variant = _context.Variants.Find(item.VariantId);
            if (variant == null || !variant.IsActive)
              throw new InvalidOperationException($"Variant {item.VariantId} not found or inactive");

            if (!_variantRepository.HasSufficientStock(item.VariantId, item.Quantity))
              throw new InvalidOperationException($"Insufficient stock for variant {item.VariantId}");

            totalAmount += variant.Price * item.Quantity;

            // Create stock movement for the order
            var stockMovement = new StockMovement
            {
              VariantId = item.VariantId,
              Quantity = item.Quantity,
              MovementType = "OUT",
              Reference = "Order",
              Notes = "Stock reduction from order",
              CreatedAt = DateTime.Now,
              IsActive = true
            };
            AddStockMovement(stockMovement);

            return (Item: item, Variant: variant);
          }).ToList();

          // Add tax
          totalAmount += totalAmount * 0.07m;

          // Create order
          var order = new Order
          {
            OrderDate = DateTime.Now,
            UserId = userId,
            StatusId = 1, // Pending
            ShippingAddressId = shippingAddress.ShippingAddressId,
            TotalAmount = totalAmount,
            CreatedAt = DateTime.Now,
            IsActive = true
          };
          _context.Orders.Add(order);
          _context.SaveChanges();

          // Create order items
          foreach (var (item, variant) in itemsWithVariants)
          {
            var orderItem = new OrderItem
            {
              OrderId = order.OrderId,
              VariantId = item.VariantId,
              Quantity = item.Quantity,
              UnitPrice = variant.Price,
              CreatedAt = DateTime.Now,
              IsActive = true
            };
            _context.OrderItems.Add(orderItem);
          }

          // Create initial payment record
          var payment = new Payment
          {
            OrderId = order.OrderId,
            Amount = totalAmount,
            PaymentDate = DateTime.Now,
            PaymentStatusId = 1, // Pending
            CreatedAt = DateTime.Now,
            IsActive = true
          };
          _context.Payments.Add(payment);

          _context.SaveChanges();

          transaction.Commit();
          return order.OrderId;
        }
        catch
        {
          transaction.Rollback();
          throw;
        }
      }
    }

    public OrderDetailsDto GetOrderDetails(int orderId)
    {
      var order = _context.Orders
          .Where(o => o.OrderId == orderId && o.IsActive)
          .Select(o => new OrderDetailsDto
          {
            OrderId = o.OrderId,
            OrderDate = o.OrderDate,
            TotalAmount = o.TotalAmount,
            Status = o.Status.Name,
            Items = o.OrderItems.Select(oi => new OrderItemDetailsDto
            {
              VariantId = oi.VariantId,
              ProductId = oi.Variant.ProductId,
              ProductName = oi.Variant.Product.Name,
              ProductDescription = oi.Variant.Product.Description,
              Quantity = oi.Quantity,
              UnitPrice = oi.UnitPrice,
              Attributes = oi.Variant.VariantAttributeValues.Select(vav => new OrderVariantAttributeDto
              {
                AttributeName = vav.AttributeType.AttributeName,
                AttributeValue = vav.AttributeValue
              }).ToList()
            }).ToList()
          })
          .FirstOrDefault();

      if (order == null)
        throw new KeyNotFoundException($"Order with ID {orderId} not found.");

      return order;
    }

    public void AddStockMovement(StockMovement movement)
    {
      _context.StockMovements.Add(movement);

      var stock = GetOrCreateStock(movement.VariantId);
      stock.Quantity += movement.MovementType == "IN" ? movement.Quantity : -movement.Quantity;
      stock.LastUpdated = DateTime.UtcNow;

      _context.SaveChanges();
    }


    private Stock GetOrCreateStock(int variantId)
    {
      var stock = _context.Stocks.FirstOrDefault(s => s.VariantId == variantId);
      if (stock == null)
      {
        stock = new Stock
        {
          VariantId = variantId,
          Quantity = 0,
          CreatedAt = DateTime.UtcNow,
          LastUpdated = DateTime.UtcNow,
          IsActive = true
        };
        _context.Stocks.Add(stock);
      }
      return stock;
    }
    public IEnumerable<OrderDetailsDto> GetOrders(int userId)
    {
      var orders = _context.Orders
          .Where(o => o.UserId == userId && o.IsActive)
          .Select(o => new OrderDetailsDto
          {
            OrderId = o.OrderId,
            OrderDate = o.OrderDate,
            TotalAmount = o.TotalAmount,
            Status = o.Status.Name,
            Items = o.OrderItems.Select(oi => new OrderItemDetailsDto
            {
              VariantId = oi.VariantId,
              ProductId = oi.Variant.ProductId,
              ProductName = oi.Variant.Product.Name,
              ProductDescription = oi.Variant.Product.Description,
              Quantity = oi.Quantity,
              UnitPrice = oi.UnitPrice,
              Attributes = oi.Variant.VariantAttributeValues.Select(vav => new OrderVariantAttributeDto
              {
                AttributeName = vav.AttributeType.AttributeName,
                AttributeValue = vav.AttributeValue
              }).ToList()
            }).ToList()
          })
          .ToList();
      if (orders == null || orders.Count == 0)
      {
        throw new KeyNotFoundException($"No orders found for user with ID {userId}.");
      }
      return orders;
    }
  }
}
