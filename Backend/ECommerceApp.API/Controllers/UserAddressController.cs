using Microsoft.AspNetCore.Mvc;
using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.UserAddress;
using Microsoft.AspNetCore.Authorization;

namespace ECommerceApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserAddressController : ControllerBase
    {
        private readonly IUserAddressService _userAddressService;

        public UserAddressController(IUserAddressService userAddressService)
        {
            _userAddressService = userAddressService;
        }

        [HttpGet]
        public IActionResult GetAllUserAddresses()
        {
            try
            {
                string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var addresses = _userAddressService.GetAllUserAddresses(token);
                return Ok(addresses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetUserAddressById(int id)
        {
            try
            {
                string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var address = _userAddressService.GetUserAddressById(token, id);
                return Ok(address);
            }
            catch (Exception ex)
            {
                return NotFound($"Address not found: {ex.Message}");
            }
        }

        [HttpGet("user")]
        public IActionResult GetUserAddresses()
        {
            try
            {
                string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var addresses = _userAddressService.GetUserAddressesByToken(token);
                return Ok(addresses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public IActionResult CreateUserAddress([FromBody] CreateUserAddressDto createUserAddressDto)
        {
            try
            {
                string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var addressId = _userAddressService.CreateUserAddress(token, createUserAddressDto);
                return Ok(new { Id = addressId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUserAddress(int id, [FromBody] CreateUserAddressDto updateUserAddressDto)
        {
            try
            {
                string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                _userAddressService.UpdateUserAddress(token, id, updateUserAddressDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound($"Address not found: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUserAddress(int id)
        {
            try
            {
                string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                _userAddressService.DeleteUserAddress(token, id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
