using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Category;
using ECommerceApp.Business.DTOs.Product;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {

        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

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
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("top-category")]
        public ActionResult AddTopCategory([FromBody] TopCategoryDto topCategoryDto)
        {
            try
            {
                _categoryService.AddTopCategory(topCategoryDto);
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("sub-category")]
        public ActionResult AddSubCategory([FromBody] CreateSubCategoryDto createSubCategoryDto)
        {
            try
            {
                _categoryService.AddSubCategory(createSubCategoryDto);
                return Ok(new { success = true });

            } catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
