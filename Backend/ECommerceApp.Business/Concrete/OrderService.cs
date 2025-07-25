using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Order;
using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.DataAccess.Concrete.EntityFramework;
using ECommerceApp.Entities.Concrete;
using System.Text.Json;

namespace ECommerceApp.Business.Concrete
{
  public class OrderService(AppDbContext context, IVariantRepository variantRepository, IMessageQueueService messageQueueService) : IOrderService
  {
    private readonly AppDbContext _context = context;
    private readonly IVariantRepository _variantRepository = variantRepository;
    private readonly IMessageQueueService _messageQueueService = messageQueueService;


    public async Task<int> CreateOrder(CreateOrderDto orderDto, int userId)
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

          // Send order to message queue for further processing
          var orderForQueue = new
          {
            OrderId = order.OrderId,
            UserId = userId,
            Items = itemsWithVariants.Select(x => new
            {
              VariantId = x.Item.VariantId,
              Quantity = x.Item.Quantity,
              UnitPrice = x.Variant.Price
            }).ToArray(),
            TotalAmount = totalAmount,
            OrderDate = order.OrderDate
          };

          try
          {
            await _messageQueueService.PublishOrderProcessedAsync(order.OrderId, JsonSerializer.Serialize(orderForQueue));
          }
          catch (Exception ex)
          {
            // Log error but don't affect the order creation
            Console.WriteLine($"Failed to publish order to queue: {ex.Message}");
          }

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
