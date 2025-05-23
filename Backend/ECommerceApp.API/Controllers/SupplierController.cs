using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Supplier;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.API.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class SupplierController : ControllerBase {
        private readonly ISupplierService _supplierService;

        public SupplierController(ISupplierService supplierService) {
            _supplierService = supplierService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<SupplierDto>> GetAll() {
            return Ok(_supplierService.GetAll());
        }

        [HttpGet("{id}")]
        public ActionResult<SupplierDto> GetById(int id) {
            var supplier = _supplierService.GetById(id);
            if (supplier == null)
                return NotFound();
            return Ok(supplier);
        }

        [HttpGet("user/{userId}")]
        public ActionResult<IEnumerable<SupplierDto>> GetByUserId(int userId) {
            return Ok(_supplierService.GetSuppliersByUserId(userId));
        }

        [HttpPost]
        public IActionResult Create(CreateSupplierDto supplierDto) {
            string token = Request.Headers[key: "Authorization"].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(token))
                return Unauthorized();
            int id = _supplierService.Create(token, supplierDto);
            return Ok(new { Id = id });
        }

        [HttpPut]
        public IActionResult Update(UpdateSupplierDto supplierDto) {
            _supplierService.Update(supplierDto);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) {
            _supplierService.Delete(id);
            return Ok();
        }

        [HttpGet("{id}/statistics")]
        public ActionResult<SupplierStatistics> GetSupplierStatistics(int id) {
            return _supplierService.GetSupplierStatistics(id);
        }

        [HttpPost("{id}/employee")]
        public IActionResult AddEmployee(int id, [FromBody] CreateEmployeeDto employeeDto) {
            _supplierService.AddEmployee(id, employeeDto);
            return Ok(new { message = "Success" });
        }
    }
}
