using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<ProductDto>> GetAll()
        {
            try
            {
                string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var products = _productService.GetAll(token);
                return Ok(products);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public ActionResult<ProductDto> GetById(int id)
        {
            try
            {
                string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var product = _productService.GetById(id, token);
                if (product == null)
                    return NotFound(new { message = "Product not found" });
                return Ok(product);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("topCategory/{topCategoryId}")]
        public ActionResult<IEnumerable<ProductDto>> GetByTopCategory(int topCategoryId)
        {
            try
            {
                string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var products = _productService.GetByTopCategory(topCategoryId, token);
                return Ok(products);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("subCategory/{subCategoryId}")]
        public ActionResult<IEnumerable<ProductDto>> GetBySubCategory(int subCategoryId)
        {
            try
            {
                string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var products = _productService.GetBySubCategory(subCategoryId, token);
                return Ok(products);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize]
        public ActionResult Add([FromBody] CreateProductDto productDto)
        {
            try
            {
                string token = Request.Headers[key: "Authorization"].ToString().Replace("Bearer ", "");
                _productService.Add(productDto, token);
                return Ok(new { message = "Product added successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public ActionResult Update(int id, [FromBody] UpdateProductDto productDto)
        {
            try
            {
                string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                _productService.Update(id, productDto, token);
                return Ok(new { message = "Product updated successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public ActionResult Delete(int id)
        {
            try
            {
                string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                _productService.Delete(id, token);
                return Ok(new { message = "Product deleted successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("top-categories")]
        public ActionResult<IEnumerable<TopCategoryDto>> GetTopCategories()
        {
            try
            {
                var topCategories = _productService.GetTopCategories();
                return Ok(topCategories);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
