using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Core.DataAccess.Abstract
{
    public interface IVariantRepository
    {
        int Add(Variant variant);
        IEnumerable<Variant> GetAll();
        Variant GetById(int id);
        void Delete(int id);
        IEnumerable<Variant> GetByCategories(int topCategoryId, int subCategoryId);
        IEnumerable<Variant> GetByCategoriesAndPriceRange(int? topCategoryId, int? subCategoryId, decimal? minPrice, decimal? maxPrice);
    }
}
