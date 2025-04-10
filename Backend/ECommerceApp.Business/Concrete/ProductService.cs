using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Product;
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
                SubCategoryId = product.SubCategoryId,
                TopCategoryId = product.TopCategoryId,
                TopCategoryName = product.TopCategory?.Name,
                SubCategoryName = product.SubCategory?.Name
            };
        }

        public IEnumerable<ProductDto> GetAll(string token)
        {
            return _productRepository.GetAll().Select(MapToDto);
        }

        public ProductDto GetById(int id, string token)
        {
            var product = _productRepository.GetById(id);
            return product != null ? MapToDto(product) : null;
        }

        public IEnumerable<ProductDto> GetByTopCategory(int topCategoryId, string token)
        {
            return _productRepository.GetByTopCategory(topCategoryId).Select(MapToDto);
        }

        public IEnumerable<ProductDto> GetBySubCategory(int subCategoryId, string token)
        {
            return _productRepository.GetBySubCategory(subCategoryId).Select(MapToDto);
        }

        public void Add(CreateProductDto productDto, string token)
        {
            ValidateAdminAccess(token);

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

            _productRepository.Add(product);
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
    }
}