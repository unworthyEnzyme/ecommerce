using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Cart;

namespace ECommerceApp.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  public class ShoppingCartController : ControllerBase
  {
    private readonly IShoppingCartService _shoppingCartService;

    public ShoppingCartController(IShoppingCartService shoppingCartService)
    {
      _shoppingCartService = shoppingCartService;
    }

    [HttpGet]
    public ActionResult<CartDto> GetCart()
    {
      try
      {
        string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        return Ok(_shoppingCartService.GetCart(token));
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
    public ActionResult<CartDto> AddToCart([FromBody] AddToCartDto addToCartDto)
    {
      try
      {
        string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        return Ok(_shoppingCartService.AddToCart(addToCartDto, token));
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
    public ActionResult UpdateQuantity(int cartItemId, [FromBody] int quantity)
    {
      try
      {
        string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        _shoppingCartService.UpdateQuantity(cartItemId, quantity, token);
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
    public ActionResult RemoveItem(int cartItemId)
    {
      try
      {
        string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        _shoppingCartService.RemoveItem(cartItemId, token);
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
    public ActionResult ClearCart()
    {
      try
      {
        string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        _shoppingCartService.ClearCart(token);
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
