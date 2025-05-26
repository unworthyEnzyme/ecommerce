using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.AttributeType;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class AttributeTypeController : ControllerBase
    {
        private readonly IAttributeTypeService _attributeTypeService;
        public AttributeTypeController(IAttributeTypeService attributeTypeService)
        {
            _attributeTypeService = attributeTypeService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<AttributeTypeDto>> GetAll()
        {
            try
            {
                var attributeTypes = _attributeTypeService.GetAll();
                return Ok(attributeTypes);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public ActionResult Add([FromBody] CreateAttributeTypeDto createAttributeTypeDto)
        {
            try
            {
                _attributeTypeService.Add(createAttributeTypeDto);
                return Ok(new { message = "Attribute type added successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
