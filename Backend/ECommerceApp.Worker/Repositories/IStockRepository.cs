using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Worker.Repositories
{
    public interface IStockRepository
    {
        Task<Stock?> GetStockByVariantIdAsync(int variantId);
        Task<Stock> CreateStockAsync(Stock stock);
        Task UpdateStockAsync(Stock stock);
    }
}
