using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Order;
using System.Security.Claims;

namespace ECommerceApp.API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class OrderController : ControllerBase
  {
    private readonly IOrderService _orderService; public OrderController(IOrderService orderService)
    {
      _orderService = orderService;
    }

    private int GetCurrentUserId()
    {
      var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
      if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        throw new UnauthorizedAccessException("Invalid user ID in token");
      return userId;
    }

    [HttpGet]
    [Authorize]
    public ActionResult<IEnumerable<OrderDetailsDto>> GetOrders()
    {
      try
      {
        var userId = GetCurrentUserId();
        var orders = _orderService.GetOrders(userId);
        return Ok(orders);
      }
      catch (UnauthorizedAccessException ex)
      {
        return Unauthorized(new ErrorResponseDto { Message = ex.Message });
      }
      catch (Exception ex)
      {
        return BadRequest(new ErrorResponseDto { Message = ex.Message });
      }
    }
    [HttpPost]
    [Authorize]
    public ActionResult<CreateOrderResponseDto> CreateOrder(CreateOrderDto orderDto)
    {
      try
      {
        var userId = GetCurrentUserId();
        var orderId = _orderService.CreateOrder(orderDto, userId);
        return Ok(new CreateOrderResponseDto { OrderId = orderId, Message = "Success" });
      }
      catch (UnauthorizedAccessException ex)
      {
        return Unauthorized(new ErrorResponseDto { Message = ex.Message });
      }
      catch (Exception ex)
      {
        return BadRequest(new ErrorResponseDto { Message = ex.Message });
      }
    }

    [HttpGet("{orderId}")]
    public ActionResult<OrderDetailsDto> GetOrderDetails(int orderId)
    {
      try
      {
        var orderDetails = _orderService.GetOrderDetails(orderId);
        if (orderDetails == null)
        {
          return NotFound(new ErrorResponseDto { Message = "Order not found" });
        }
        return Ok(orderDetails);
      }
      catch (UnauthorizedAccessException ex)
      {
        return Unauthorized(new ErrorResponseDto { Message = ex.Message });
      }
      catch (Exception ex)
      {
        return BadRequest(new ErrorResponseDto { Message = ex.Message });
      }
    }
  }

  public class CreateOrderResponseDto
  {
    public int OrderId { get; set; }
    public string Message { get; set; }
  }

  public class ErrorResponseDto
  {
    public string Message { get; set; }
  }
}
