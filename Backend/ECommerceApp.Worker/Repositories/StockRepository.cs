using ECommerceApp.DataAccess.Concrete.EntityFramework;
using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApp.Worker.Repositories
{
    public class StockRepository(IServiceScopeFactory scopeFactory) : IStockRepository
    {
        private readonly IServiceScopeFactory _scopeFactory = scopeFactory;

        public async Task<Stock?> GetStockByVariantIdAsync(int variantId)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            return await context.Stocks.FirstOrDefaultAsync(s => s.VariantId == variantId);
        }

        public async Task<Stock> CreateStockAsync(Stock stock)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            context.Stocks.Add(stock);
            await context.SaveChangesAsync();
            return stock;
        }

        public async Task UpdateStockAsync(Stock stock)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            context.Stocks.Update(stock);
            await context.SaveChangesAsync();
        }
    }
}
