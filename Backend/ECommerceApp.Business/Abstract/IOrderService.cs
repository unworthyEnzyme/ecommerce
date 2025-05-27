using ECommerceApp.Business.DTOs.Order;

namespace ECommerceApp.Business.Abstract
{
  public interface IOrderService
  {
    int CreateOrder(CreateOrderDto orderDto, int userId);
    OrderDetailsDto GetOrderDetails(int orderId);
    IEnumerable<OrderDetailsDto> GetOrders(int userId);
  }
}
