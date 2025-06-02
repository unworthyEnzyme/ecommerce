using Microsoft.AspNetCore.Mvc;
using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.UserAddress;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                throw new UnauthorizedAccessException("Invalid user ID in token");
            return userId;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllUserAddresses()
        {
            try
            {
                var addresses = _userAddressService.GetAllUserAddresses();
                return Ok(addresses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetUserAddressById(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var address = _userAddressService.GetUserAddressById(userId, id);
                return Ok(address);
            }
            catch (Exception ex)
            {
                return NotFound($"Address not found: {ex.Message}");
            }
        }

        [HttpGet("user")]
        [Authorize]
        public IActionResult GetUserAddresses()
        {
            try
            {
                var userId = GetCurrentUserId();
                var addresses = _userAddressService.GetUserAddressesByUserId(userId);
                return Ok(addresses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        [Authorize]
        public IActionResult CreateUserAddress([FromBody] CreateUserAddressDto createUserAddressDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var addressId = _userAddressService.CreateUserAddress(userId, createUserAddressDto);
                return Ok(new { Id = addressId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public IActionResult UpdateUserAddress(int id, [FromBody] CreateUserAddressDto updateUserAddressDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                _userAddressService.UpdateUserAddress(userId, id, updateUserAddressDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound($"Address not found: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeleteUserAddress(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                _userAddressService.DeleteUserAddress(userId, id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
