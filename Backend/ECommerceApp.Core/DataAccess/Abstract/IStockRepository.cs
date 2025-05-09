using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Core.DataAccess.Abstract
{
    public interface IStockRepository
    {
        void Add(Stock stock);
        void Update(Stock stock);
        void Delete(Stock stock);
        Stock GetById(int id);
        IEnumerable<Stock> GetAll();
        IEnumerable<Stock> GetByVariantId(int variantId);
    }
}
