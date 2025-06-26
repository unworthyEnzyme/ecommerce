using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Auth;
using ECommerceApp.Business.DTOs.Profile;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerceApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService authService, Core.Logging.Abstract.ILoggerFactory loggerFactory) : ControllerBase
    {
        private readonly IAuthService _authService = authService;
        private readonly Core.Logging.Abstract.ILogger _logger = loggerFactory.CreateLogger<AuthController>();

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                _logger.LogWarning("Invalid or missing user ID in token. UserIdClaim: {UserIdClaim}", userIdClaim ?? "null");
                throw new UnauthorizedAccessException("Invalid user ID in token");
            }
            _logger.LogDebug("Successfully extracted user ID: {UserId}", userId);
            return userId;
        }

        [HttpPost("login")]
        public ActionResult<string> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                _logger.LogInfo("Login attempt for user: {Email}", loginDto.Email);
                var token = _authService.Login(loginDto);
                _logger.LogInfo("Successful login for user: {Email}", loginDto.Email);
                return Ok(new { token });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login failed for user: {Email}", loginDto.Email);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("register")]
        public ActionResult Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                _logger.LogInfo("Registration attempt for user: {Email}", registerDto.Email);
                _authService.Register(registerDto);
                _logger.LogInfo("Successful registration for user: {Email}", registerDto.Email);
                return Ok(new { message = "User registered successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration failed for user: {Email}", registerDto.Email);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("profile")]
        [Authorize]
        public ActionResult<ProfileDto> GetProfile()
        {
            try
            {
                var userId = GetCurrentUserId();
                _logger.LogDebug("Fetching profile for user ID: {UserId}", userId);
                var profile = _authService.GetProfile(userId);
                if (profile == null)
                {
                    _logger.LogWarning("Profile not found for user ID: {UserId}", userId);
                    return NotFound(new { message = "Profile not found" });
                }
                _logger.LogDebug("Successfully retrieved profile for user ID: {UserId}", userId);
                return Ok(profile);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving profile");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("profile")]
        [Authorize]
        public ActionResult UpdateProfile([FromBody] UpdateProfileDto profileDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                _logger.LogInfo("Updating profile for user ID: {UserId}", userId);
                _authService.UpdateProfile(userId, profileDto);
                _logger.LogInfo("Successfully updated profile for user ID: {UserId}", userId);
                return Ok(new { message = "Profile updated successfully" });
            }
            catch (Exception ex)
            {
                var userId = GetCurrentUserId();
                _logger.LogError(ex, "Failed to update profile for user ID: {UserId}", userId);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("complete-auth/{id}")]
        public ActionResult CompleteOnboarding(string id, [FromBody] CompleteOnboardingDto completeOnboarding)
        {
            try
            {
                _logger.LogInfo("Completing onboarding for ID: {Id}", id);
                _authService.CompleteOnboarding(id, completeOnboarding);
                _logger.LogInfo("Successfully completed onboarding for ID: {Id}", id);
                return Ok(new { message = "Success" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to complete onboarding for ID: {Id}", id);
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
