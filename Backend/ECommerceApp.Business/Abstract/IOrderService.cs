using ECommerceApp.Business.DTOs.Order;

namespace ECommerceApp.Business.Abstract
{
  public interface IOrderService
  {
    int CreateOrder(CreateOrderDto orderDto, string token);
  }
}
