using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Core.DataAccess.Abstract
{
    public interface IProductRepository
    {
        IEnumerable<Product> GetAll();
        Product GetById(int id);
        IEnumerable<Product> GetByTopCategory(int topCategoryId);
        IEnumerable<Product> GetBySubCategory(int subCategoryId);
        Product Add(Product product);
        void Update(Product product);
        void Delete(int id);
        bool Exists(string productCode);
        IEnumerable<TopCategory> GetTopCategories();
    }
}
