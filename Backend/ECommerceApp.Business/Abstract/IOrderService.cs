using ECommerceApp.Business.DTOs.Order;

namespace ECommerceApp.Business.Abstract
{
  public interface IOrderService
  {
    Task<int> CreateOrder(CreateOrderDto orderDto, int userId);
    OrderDetailsDto GetOrderDetails(int orderId);
    IEnumerable<OrderDetailsDto> GetOrders(int userId);
  }
}
