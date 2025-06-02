using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Supplier;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerceApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SupplierController : ControllerBase
    {
        private readonly ISupplierService _supplierService;

        public SupplierController(ISupplierService supplierService)
        {
            _supplierService = supplierService;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                throw new UnauthorizedAccessException("Invalid user ID in token");
            return userId;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public ActionResult<IEnumerable<SupplierDto>> GetAll()
        {
            return Ok(_supplierService.GetAll());
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public ActionResult<SupplierDto> GetById(int id)
        {
            var supplier = _supplierService.GetById(id);
            if (supplier == null)
                return NotFound();
            return Ok(supplier);
        }

        [HttpGet("user/{userId}")]
        public ActionResult<IEnumerable<SupplierDto>> GetByUserId(int userId)
        {
            return Ok(_supplierService.GetSuppliersByUserId(userId));
        }

        [HttpPost]
        [Authorize]
        public IActionResult Create(CreateSupplierDto supplierDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                int id = _supplierService.Create(userId, supplierDto);
                return Ok(new { Id = id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut]
        public IActionResult Update(UpdateSupplierDto supplierDto)
        {
            _supplierService.Update(supplierDto);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _supplierService.Delete(id);
            return Ok();
        }

        [HttpGet("{id}/statistics")]
        public ActionResult<SupplierStatistics> GetSupplierStatistics(int id)
        {
            return _supplierService.GetSupplierStatistics(id);
        }

        [HttpPost("{id}/employee")]
        public IActionResult AddEmployee(int id, [FromBody] CreateEmployeeDto employeeDto)
        {
            _supplierService.AddEmployee(id, employeeDto);
            return Ok(new { message = "Success" });
        }
    }
}
