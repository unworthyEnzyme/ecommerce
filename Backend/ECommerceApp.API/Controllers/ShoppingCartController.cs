using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Cart;
using System.Security.Claims;

namespace ECommerceApp.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  public class ShoppingCartController(IShoppingCartService shoppingCartService) : ControllerBase
  {
    private readonly IShoppingCartService _shoppingCartService = shoppingCartService;

    private int GetCurrentUserId()
    {
      var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
      if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        throw new UnauthorizedAccessException("Invalid user ID in token");
      return userId;
    }

    [HttpGet]
    [Authorize]
    public ActionResult<CartDto> GetCart()
    {
      try
      {
        var userId = GetCurrentUserId();
        return Ok(_shoppingCartService.GetCart(userId));
      }
      catch (UnauthorizedAccessException ex)
      {
        return Unauthorized(new { message = ex.Message });
      }
      catch (Exception ex)
      {
        return BadRequest(new { message = ex.Message });
      }
    }

    [HttpPost]
    [Authorize]
    public ActionResult<CartDto> AddToCart([FromBody] AddToCartDto addToCartDto)
    {
      try
      {
        var userId = GetCurrentUserId();
        return Ok(_shoppingCartService.AddToCart(addToCartDto, userId));
      }
      catch (UnauthorizedAccessException ex)
      {
        return Unauthorized(new { message = ex.Message });
      }
      catch (Exception ex)
      {
        return BadRequest(new { message = ex.Message });
      }
    }

    [HttpPost("merge")]
    [Authorize]
    public ActionResult MergeCart([FromBody] List<AddToCartDto> items)
    {
      try
      {
        var userId = GetCurrentUserId();
        foreach (var item in items)
        {
          _shoppingCartService.AddToCart(item, userId);
        }
        return Ok(new { message = "Cart merged successfully" });
      }
      catch (UnauthorizedAccessException ex)
      {
        return Unauthorized(new { message = ex.Message });
      }
      catch (Exception ex)
      {
        return BadRequest(new { message = ex.Message });
      }
    }

    [HttpPut("items/{cartItemId}")]
    [Authorize]
    public ActionResult UpdateQuantity(int cartItemId, [FromBody] int quantity)
    {
      try
      {
        var userId = GetCurrentUserId();
        _shoppingCartService.UpdateQuantity(cartItemId, quantity, userId);
        return Ok(new { message = "Quantity updated successfully" });
      }
      catch (UnauthorizedAccessException ex)
      {
        return Unauthorized(new { message = ex.Message });
      }
      catch (Exception ex)
      {
        return BadRequest(new { message = ex.Message });
      }
    }

    [HttpDelete("items/{cartItemId}")]
    [Authorize]
    public ActionResult RemoveItem(int cartItemId)
    {
      try
      {
        var userId = GetCurrentUserId();
        _shoppingCartService.RemoveItem(cartItemId, userId);
        return Ok(new { message = "Item removed successfully" });
      }
      catch (UnauthorizedAccessException ex)
      {
        return Unauthorized(new { message = ex.Message });
      }
      catch (Exception ex)
      {
        return BadRequest(new { message = ex.Message });
      }
    }

    [HttpDelete]
    [Authorize]
    public ActionResult ClearCart()
    {
      try
      {
        var userId = GetCurrentUserId();
        _shoppingCartService.ClearCart(userId);
        return Ok(new { message = "Cart cleared successfully" });
      }
      catch (UnauthorizedAccessException ex)
      {
        return Unauthorized(new { message = ex.Message });
      }
      catch (Exception ex)
      {
        return BadRequest(new { message = ex.Message });
      }
    }
  }
}
