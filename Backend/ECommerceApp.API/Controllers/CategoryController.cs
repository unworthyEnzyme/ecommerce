using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Category;
using ECommerceApp.Business.DTOs.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController(ICategoryService categoryService, Core.Logging.Abstract.ILoggerFactory loggerFactory) : ControllerBase
    {
        private readonly ICategoryService _categoryService = categoryService;
        private readonly Core.Logging.Abstract.ILogger _logger = loggerFactory.CreateLogger<CategoryController>();

        [HttpGet("top-categories")]
        public ActionResult<IEnumerable<TopCategoryDto>> GetTopCategories()
        {
            try
            {
                var topCategories = _categoryService.GetTopCategories();
                return Ok(topCategories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting top categories");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("sub-categories/{topCategoryId}")]
        public ActionResult<IEnumerable<SubCategoryDto>> GetSubCategories(int topCategoryId)
        {
            try
            {
                var subCategories = _categoryService.GetSubCategories(topCategoryId);
                return Ok(subCategories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting sub categories for top category ID: {TopCategoryId}", topCategoryId);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("top-category")]
        [Authorize(Roles = "Admin")]
        public ActionResult AddTopCategory([FromBody] TopCategoryDto topCategoryDto)
        {
            try
            {
                _categoryService.AddTopCategory(topCategoryDto);
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding top category");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("sub-category")]
        [Authorize(Roles = "Admin")]
        public ActionResult AddSubCategory([FromBody] CreateSubCategoryDto createSubCategoryDto)
        {
            try
            {
                _categoryService.AddSubCategory(createSubCategoryDto);
                return Ok(new { success = true });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding sub category");
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
