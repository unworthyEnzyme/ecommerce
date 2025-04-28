using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Order;

namespace ECommerceApp.API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class OrderController : ControllerBase
  {
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
      _orderService = orderService;
    }

    [HttpPost]
    public IActionResult CreateOrder(CreateOrderDto orderDto)
    {
      try
      {
        string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        var orderId = _orderService.CreateOrder(orderDto, token);
        return Ok(new { OrderId = orderId });
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
