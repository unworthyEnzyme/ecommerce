using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Product;
using ECommerceApp.Business.DTOs.Supplier;
using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Business.Concrete
{
    public class ProductService(IProductRepository productRepository) : IProductService
    {
        private readonly IProductRepository _productRepository = productRepository;

        private ProductDto MapToDto(Product product)
        {
            return new ProductDto
            {
                ProductId = product.ProductId,
                ProductCode = product.ProductCode,
                Name = product.Name,
                Description = product.Description,
                SubCategory = new SubCategoryDto
                {
                    Id = product.SubCategoryId,
                    Name = product.SubCategory.Name,
                    TopCategoryId = product.TopCategoryId
                },
                TopCategory = new TopCategoryDto
                {
                    Id = product.TopCategoryId,
                    Name = product.TopCategory.Name
                },
                Supplier = new SupplierDto
                {
                    Id = product.SupplierId,
                    Name = product.Supplier.Name,
                    Address = product.Supplier.Address,
                    PhoneNumber = product.Supplier.PhoneNumber,
                    ContactEmail = product.Supplier.ContactEmail,
                    ContactName = product.Supplier.ContactName
                }
            };
        }

        public IEnumerable<ProductDto> GetAll()
        {
            return _productRepository.GetAll().Select(MapToDto);
        }

        public ProductDto GetById(int id)
        {
            var product = _productRepository.GetById(id);
            if (product == null)
                return null!;
            return MapToDto(product);
        }

        public IEnumerable<ProductDto> GetByTopCategory(int topCategoryId)
        {
            return _productRepository.GetByTopCategory(topCategoryId).Select(MapToDto);
        }

        public IEnumerable<ProductDto> GetBySubCategory(int subCategoryId)
        {
            return _productRepository.GetBySubCategory(subCategoryId).Select(MapToDto);
        }

        private string GenerateProductCode()
        {
            var timestamp = DateTime.UtcNow.Ticks;
            return $"P{timestamp.ToString().Substring(Math.Max(0, timestamp.ToString().Length - 8))}";
        }

        public int Add(CreateProductDto productDto)
        {
            var productCode = GenerateProductCode();
            var product = new Product
            {
                ProductCode = productCode,
                Name = productDto.Name,
                Description = productDto.Description,
                SubCategoryId = productDto.SubCategoryId,
                TopCategoryId = productDto.TopCategoryId,
                SupplierId = productDto.SupplierId,
            };

            var addedProduct = _productRepository.Add(product);
            return addedProduct.ProductId;
        }

        public void Update(int id, UpdateProductDto productDto)
        {
            var existingProduct = _productRepository.GetById(id);
            if (existingProduct == null)
                throw new Exception("Product not found");

            existingProduct.Name = productDto.Name;
            existingProduct.Description = productDto.Description;
            existingProduct.SubCategoryId = productDto.SubCategoryId;
            existingProduct.TopCategoryId = productDto.TopCategoryId;

            _productRepository.Update(existingProduct);
        }

        public void Delete(int id)
        {
            _productRepository.Delete(id);
        }

        public IEnumerable<TopCategoryDto> GetTopCategories()
        {
            return _productRepository.GetTopCategories().Select(tc => new TopCategoryDto
            {
                Id = tc.TopCategoryId,
                Name = tc.Name
            });
        }
    }
}
