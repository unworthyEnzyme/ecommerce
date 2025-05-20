using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Supplier;
using Microsoft.AspNetCore.Mvc;

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

        [HttpGet]
        public ActionResult<IEnumerable<SupplierDto>> GetAll()
        {
            return Ok(_supplierService.GetAll());
        }

        [HttpGet("{id}")]
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
        public IActionResult Create(CreateSupplierDto supplierDto)
        {
            _supplierService.Create(supplierDto);
            return Ok();
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
    }
}
