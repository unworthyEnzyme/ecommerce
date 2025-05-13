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
        public ActionResult GetAll()
        {
            var variants = _variantService.GetAll();
            var attributeOptions = _variantService.GetAttributeOptionsForList(variants.Select(v => v.Id).ToList());

            return Ok(new
            {
                variants,
                attributeOptions
            });
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
                var variants = _variantService.GetByCategories(topCategoryId, subCategoryId);
                var attributeOptions = _variantService.GetAttributeOptionsForList(variants.Select(v => v.Id).ToList());

                return Ok(new
                {
                    variants,
                    attributeOptions
                });
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
                // If no filters are provided, return all variants instead
                var variants = !topCategoryId.HasValue && !subCategoryId.HasValue &&
                                !minPrice.HasValue && !maxPrice.HasValue
                    ? _variantService.GetAll()
                    : _variantService.GetByCategoriesAndPriceRange(topCategoryId, subCategoryId, minPrice, maxPrice);

                var attributeOptions = _variantService.GetAttributeOptionsForList(variants.Select(v => v.Id).ToList());

                return Ok(new
                {
                    variants,
                    attributeOptions
                });
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
