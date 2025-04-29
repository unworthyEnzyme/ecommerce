using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Product;
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
        public ActionResult Add(CreateVariantDto createVariantDto)
        {
            try
            {
                _variantService.Add(createVariantDto);
                return Ok(new { message = "Variant added successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        //TODO: Get possible attribute types and values for a variant.
    }
}
