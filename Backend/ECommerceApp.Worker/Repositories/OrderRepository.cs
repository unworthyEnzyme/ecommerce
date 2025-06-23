using ECommerceApp.DataAccess.Concrete.EntityFramework;
using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Worker.Repositories
{
  public class OrderRepository(IServiceScopeFactory scopeFactory) : IOrderRepository
  {
    private readonly IServiceScopeFactory _scopeFactory = scopeFactory;

    public async Task ChangeStatus(int orderId, Status status)
    {
      using var scope = _scopeFactory.CreateScope();
      var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
      var order = context.Orders.FirstOrDefault(o => o.OrderId == orderId)
                  ?? throw new Exception("Order not found");
      OrderStatus newStatus = context.OrderStatuses.FirstOrDefault(s => s.StatusId == (int)status)
        ?? throw new Exception("Order status not found");
      order.Status = newStatus;
      await context.SaveChangesAsync();
    }
  }
}