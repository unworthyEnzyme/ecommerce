﻿using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Favorite;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerceApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoriteController(IFavoriteService favoriteService, Core.Logging.Abstract.ILoggerFactory loggerFactory) : ControllerBase
    {
        private readonly IFavoriteService _favoriteService = favoriteService;
        private readonly Core.Logging.Abstract.ILogger _logger = loggerFactory.CreateLogger<FavoriteController>();

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                throw new UnauthorizedAccessException("Invalid user ID in token"); return userId;
        }

        [HttpGet]
        [Authorize]
        public ActionResult<IEnumerable<FavoriteDto>> GetAll()
        {
            try
            {
                var userId = GetCurrentUserId();
                var favorites = _favoriteService.GetAll(userId);
                return Ok(favorites);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving favorites");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize]
        public ActionResult<int> Add([FromBody] CreateFavoriteDto createFavoriteDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var id = _favoriteService.Add(userId, createFavoriteDto);
                return Ok(new { id, message = "Favorite added successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to add favorite");
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        [Authorize]
        public ActionResult Delete(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                _favoriteService.Delete(userId, id);
                return Ok(new { message = "Favorite deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete favorite with ID: {FavoriteId}", id);
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
