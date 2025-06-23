using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Worker.Repositories
{
  public enum Status
  {
    Pending = 1,
    Processing = 2,
    Shipped = 3,
    Delivered = 4,
    Cancelled = 5
  }
  public interface IOrderRepository
  {
    Task ChangeStatus(int orderId, Status status);
  }
}
