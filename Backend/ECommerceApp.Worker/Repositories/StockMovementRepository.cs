using ECommerceApp.DataAccess.Concrete.EntityFramework;
using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Worker.Repositories
{
    public class StockMovementRepository(IServiceScopeFactory scopeFactory) : IStockMovementRepository
    {
        private readonly IServiceScopeFactory _scopeFactory = scopeFactory;

        public async Task AddStockMovementAsync(StockMovement movement)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            context.StockMovements.Add(movement);
            await context.SaveChangesAsync();
        }
    }
}
