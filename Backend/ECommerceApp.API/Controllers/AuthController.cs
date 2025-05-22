using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Auth;
using ECommerceApp.Business.DTOs.Profile;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public ActionResult<string> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var token = _authService.Login(loginDto);
                return Ok(new { token });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("register")]
        public ActionResult Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                _authService.Register(registerDto);
                return Ok(new { message = "User registered successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("profile")]
        [Authorize]
        public ActionResult<ProfileDto> GetProfile()
        {
            var token = Request.Headers.Authorization.ToString().Replace("Bearer ", "");
            var profile = _authService.GetProfile(token);
            if (profile == null)
            {
                return NotFound(new { message = "Profile not found" });
            }
            return Ok(profile);
        }
    }
}
