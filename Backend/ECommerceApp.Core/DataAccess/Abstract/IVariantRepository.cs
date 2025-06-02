using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Core.DataAccess.Abstract
{
    public interface IVariantRepository
    {
        int Add(Variant variant);
        void AddStockMovement(StockMovement movement);
        IEnumerable<Variant> GetAll();
        Variant GetById(int id);
        void Delete(int id);
        bool HasSufficientStock(int variantId, int requestedQuantity);
        IEnumerable<Variant> GetByCategories(int topCategoryId, int subCategoryId);
        IEnumerable<Variant> GetByCategoriesAndPriceRange(int? topCategoryId, int? subCategoryId, decimal? minPrice, decimal? maxPrice);
        IEnumerable<Variant> GetByCategoriesPriceRangeAndAttributes(
            int? topCategoryId,
            int? subCategoryId,
            decimal? minPrice,
            decimal? maxPrice,
            Dictionary<int, string> attributeFilters);
    }
}
