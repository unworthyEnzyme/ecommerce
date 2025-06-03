using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Worker.Repositories
{
    public interface IStockMovementRepository
    {
        Task AddStockMovementAsync(StockMovement movement);
    }
}
