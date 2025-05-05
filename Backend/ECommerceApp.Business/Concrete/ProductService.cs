using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Product;
using ECommerceApp.Business.DTOs.Variant;
using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Business.Concrete
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        private bool IsAdmin(string token)
        {
            if (string.IsNullOrEmpty(token))
                return false;

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

            if (jsonToken == null)
                return false;

            var roleClaim = jsonToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
            return roleClaim?.Value == "Admin";
        }

        private void ValidateAdminAccess(string token)
        {
            if (!IsAdmin(token))
                throw new UnauthorizedAccessException("Only administrators can perform this operation");
        }
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
                Attributes = product.ProductAttributeValues
                    .Where(pav => pav.IsActive)
                    .Select(pav => new ProductAttributeDto
                    {
                        AttributeName = pav.AttributeType.AttributeName,
                        AttributeValue = pav.AttributeValue
                    }).ToList(),
                Variants = product.Variants
                    .Where(v => v.IsActive)
                    .Select(v => new VariantDto
                    {
                        Id = v.VariantId,
                        Price = v.Price,
                        Stock = v.StockQuantity,
                        Attributes = v.VariantAttributeValues
                            .Where(vav => vav.IsActive)
                            .Select(vav => new VariantAttributeDto
                            {
                                AttributeName = vav.AttributeType.AttributeName,
                                AttributeValue = vav.AttributeValue
                            }).ToList()
                    }).ToList()
            };
        }

        public IEnumerable<ProductDto> GetAll()
        {
            return _productRepository.GetAll().Select(MapToDto);
        }

        public ProductDto GetById(int id)
        {
            var product = _productRepository.GetById(id);
            return product != null ? MapToDto(product) : null;
        }

        public IEnumerable<ProductDto> GetByTopCategory(int topCategoryId)
        {
            return _productRepository.GetByTopCategory(topCategoryId).Select(MapToDto);
        }

        public IEnumerable<ProductDto> GetBySubCategory(int subCategoryId)
        {
            return _productRepository.GetBySubCategory(subCategoryId).Select(MapToDto);
        }

        public int Add(CreateProductDto productDto, string token)
        {
            //TODO: Uncomment this line after you add an admin user to the database.
            //ValidateAdminAccess(token);

            if (_productRepository.Exists(productDto.ProductCode))
                throw new Exception("Product with this code already exists");

            var product = new Product
            {
                ProductCode = productDto.ProductCode,
                Name = productDto.Name,
                Description = productDto.Description,
                SubCategoryId = productDto.SubCategoryId,
                TopCategoryId = productDto.TopCategoryId
            };

            var addedProduct = _productRepository.Add(product);
            return addedProduct.ProductId;
        }

        public void Update(int id, UpdateProductDto productDto, string token)
        {
            ValidateAdminAccess(token);

            var existingProduct = _productRepository.GetById(id);
            if (existingProduct == null)
                throw new Exception("Product not found");

            existingProduct.Name = productDto.Name;
            existingProduct.Description = productDto.Description;
            existingProduct.SubCategoryId = productDto.SubCategoryId;
            existingProduct.TopCategoryId = productDto.TopCategoryId;

            _productRepository.Update(existingProduct);
        }

        public void Delete(int id, string token)
        {
            ValidateAdminAccess(token);
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
