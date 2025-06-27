using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController(IProductService productService, Core.Logging.Abstract.ILoggerFactory loggerFactory) : ControllerBase
    {
        private readonly IProductService _productService = productService;
        private readonly Core.Logging.Abstract.ILogger _logger = loggerFactory.CreateLogger<ProductController>();

        [HttpGet]
        public ActionResult<IEnumerable<ProductDto>> GetAll()
        {
            try
            {
                _logger.LogInfo("Getting all products");
                var products = _productService.GetAll();
                _logger.LogInfo("Successfully retrieved {Count} products", products.Count());
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting all products");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public ActionResult<ProductDto> GetById(int id)
        {
            try
            {
                _logger.LogInfo("Getting product by ID: {ProductId}", id);
                var product = _productService.GetById(id);
                if (product == null)
                {
                    _logger.LogWarning("Product not found with ID: {ProductId}", id);
                    return NotFound(new { message = "Product not found" });
                }
                _logger.LogInfo("Successfully retrieved product with ID: {ProductId}", id);
                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting product by ID: {ProductId}", id);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("topCategory/{topCategoryId}")]
        public ActionResult<IEnumerable<ProductDto>> GetByTopCategory(int topCategoryId)
        {
            try
            {
                _logger.LogInfo("Getting products by top category ID: {TopCategoryId}", topCategoryId);
                var products = _productService.GetByTopCategory(topCategoryId);
                _logger.LogInfo("Successfully retrieved {Count} products for top category ID: {TopCategoryId}", products.Count(), topCategoryId);
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting products by top category ID: {TopCategoryId}", topCategoryId);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("subCategory/{subCategoryId}")]
        public ActionResult<IEnumerable<ProductDto>> GetBySubCategory(int subCategoryId)
        {
            try
            {
                _logger.LogInfo("Getting products by sub category ID: {SubCategoryId}", subCategoryId);
                var products = _productService.GetBySubCategory(subCategoryId);
                _logger.LogInfo("Successfully retrieved {Count} products for sub category ID: {SubCategoryId}", products.Count(), subCategoryId);
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting products by sub category ID: {SubCategoryId}", subCategoryId);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public ActionResult Add([FromBody] CreateProductDto productDto)
        {
            try
            {
                _logger.LogInfo("Adding new product: {ProductName}", productDto.Name);
                int productId = _productService.Add(productDto);
                _logger.LogInfo("Successfully added product with ID: {ProductId}", productId);
                return Ok(new { id = productId, message = "Product added successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding product: {ProductName}", productDto.Name);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public ActionResult Update(int id, [FromBody] UpdateProductDto productDto)
        {
            try
            {
                _logger.LogInfo("Updating product with ID: {ProductId}", id);
                _productService.Update(id, productDto);
                _logger.LogInfo("Successfully updated product with ID: {ProductId}", id);
                return Ok(new { message = "Product updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating product with ID: {ProductId}", id);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public ActionResult Delete(int id)
        {
            try
            {
                _logger.LogInfo("Deleting product with ID: {ProductId}", id);
                _productService.Delete(id);
                _logger.LogInfo("Successfully deleted product with ID: {ProductId}", id);
                return Ok(new { message = "Product deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting product with ID: {ProductId}", id);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("top-categories")]
        public ActionResult<IEnumerable<TopCategoryDto>> GetTopCategories()
        {
            try
            {
                _logger.LogInfo("Getting top categories");
                var topCategories = _productService.GetTopCategories();
                _logger.LogInfo("Successfully retrieved {Count} top categories", topCategories.Count());
                return Ok(topCategories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting top categories");
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
