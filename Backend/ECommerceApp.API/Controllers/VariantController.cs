using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Variant;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class VariantController : ControllerBase
    {
        private readonly IVariantService _variantService;

        public VariantController(IVariantService variantService)
        {
            _variantService = variantService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<VariantDto>> GetAll()
        {
            return Ok(_variantService.GetAll());
        }

        [HttpGet("{id}")]
        public ActionResult<VariantDto> GetById(int id)
        {
            var variant = _variantService.GetById(id);
            var attributeOptions = _variantService.GetAttributeOptionsForVariant(id);

            return Ok(new
            {
                variant,
                attributeOptions
            });
        }

        [HttpPost]
        public ActionResult<int> Add(CreateVariantDto createVariantDto)
        {
            try
            {
                var id = _variantService.Add(createVariantDto);
                return Ok(new { id, message = "Variant added successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            try
            {
                _variantService.Delete(id);
                return Ok(new { message = "Variant deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("category/{topCategoryId}/subcategory/{subCategoryId}")]
        public ActionResult<IEnumerable<VariantDto>> GetByCategories(int topCategoryId, int subCategoryId)
        {
            try
            {
                return Ok(_variantService.GetByCategories(topCategoryId, subCategoryId));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("filter")]
        public ActionResult<IEnumerable<VariantDto>> GetByCategoriesAndPriceRange(
            [FromQuery] int? topCategoryId,
            [FromQuery] int? subCategoryId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice)
        {
            try
            {
                return Ok(_variantService.GetByCategoriesAndPriceRange(topCategoryId, subCategoryId, minPrice, maxPrice));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}/attribute-options")]
        public ActionResult<IEnumerable<AttributeOptionDto>> GetAttributeOptionsForVariant(int id)
        {
            try
            {
                return Ok(_variantService.GetAttributeOptionsForVariant(id));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
