using ECommerceApp.Business.DTOs.Product;

namespace ECommerceApp.Business.Abstract
{
    public interface IProductService
    {
        IEnumerable<ProductDto> GetAll(string token);
        ProductDto GetById(int id, string token);
        IEnumerable<ProductDto> GetByTopCategory(int topCategoryId, string token);
        IEnumerable<ProductDto> GetBySubCategory(int subCategoryId, string token);
        void Add(CreateProductDto productDto, string token);
        void Update(int id, UpdateProductDto productDto, string token);
        void Delete(int id, string token);
    }
}