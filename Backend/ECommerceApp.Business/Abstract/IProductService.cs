using ECommerceApp.Business.DTOs.Product;

namespace ECommerceApp.Business.Abstract
{
    public interface IProductService
    {
        IEnumerable<ProductDto> GetAll();
        ProductDto GetById(int id);
        IEnumerable<ProductDto> GetByTopCategory(int topCategoryId);
        IEnumerable<ProductDto> GetBySubCategory(int subCategoryId);
        int Add(CreateProductDto productDto);
        void Update(int id, UpdateProductDto productDto);
        void Delete(int id);
        IEnumerable<TopCategoryDto> GetTopCategories();
    }
}
