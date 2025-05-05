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
            return Ok(_variantService.GetById(id));
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

        //TODO: Get possible attribute types and values for a variant.
    }
}
