using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.AttributeType;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class AttributeTypeController(IAttributeTypeService attributeTypeService, Core.Logging.Abstract.ILoggerFactory loggerFactory) : ControllerBase
    {
        private readonly IAttributeTypeService _attributeTypeService = attributeTypeService;
        private readonly Core.Logging.Abstract.ILogger _logger = loggerFactory.CreateLogger<AttributeTypeController>();

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
                _logger.LogError(ex, "Error occurred while getting all attribute types");
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
                _logger.LogError(ex, "Error occurred while adding attribute type");
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
