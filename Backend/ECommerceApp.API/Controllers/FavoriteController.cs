using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Favorite;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoriteController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;
        public FavoriteController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }


        [HttpGet]
        [Authorize]
        public ActionResult<IEnumerable<FavoriteDto>> GetAll()
        {
            string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            try
            {
                var favorites = _favoriteService.GetAll(token);
                return Ok(favorites);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize]
        public ActionResult<int> Add([FromBody] CreateFavoriteDto createFavoriteDto)
        {
            string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            try
            {
                var id = _favoriteService.Add(token, createFavoriteDto);
                return Ok(new { id, message = "Favorite added successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public ActionResult Delete(int id)
        {
            string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            try
            {
                _favoriteService.Delete(token, id);
                return Ok(new { message = "Favorite deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
