using ECommerceApp.Business.DTOs.Variant;

namespace ECommerceApp.Business.Abstract
{
    public interface IVariantService
    {
        IEnumerable<VariantDto> GetAll();
        int Add(CreateVariantDto createVariantDto);
        VariantDto GetById(int id);
        IEnumerable<AttributeOptionDto> GetAttributeOptionsForVariant(int variantId);
        IEnumerable<AttributeOptionDto> GetAttributeOptionsForList(IEnumerable<int> variantIds);
        void Delete(int id);
        IEnumerable<VariantDto> GetByCategories(int topCategoryId, int subCategoryId);
        IEnumerable<VariantDto> GetByCategoriesAndPriceRange(int? topCategoryId, int? subCategoryId, decimal? minPrice, decimal? maxPrice);
        IEnumerable<VariantDto> GetByCategoriesPriceRangeAndAttributes(
            int? topCategoryId,
            int? subCategoryId,
            decimal? minPrice,
            decimal? maxPrice,
            Dictionary<int, string> attributeFilters);
        VariantDto? GetVariantByAttributeOptions(Dictionary<int, string> attributeOptions, int productId);
    }
}
