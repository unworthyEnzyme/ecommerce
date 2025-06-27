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
  public class OrderController(IOrderService orderService, Core.Logging.Abstract.ILoggerFactory loggerFactory) : ControllerBase
  {
    private readonly IOrderService _orderService = orderService;
    private readonly Core.Logging.Abstract.ILogger _logger = loggerFactory.CreateLogger<OrderController>();

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

    [HttpGet]
    [Authorize]
    public ActionResult<IEnumerable<OrderDetailsDto>> GetOrders()
    {
      try
      {
        var userId = GetCurrentUserId();
        _logger.LogInfo("Getting orders for user: {UserId}", userId);
        var orders = _orderService.GetOrders(userId);
        _logger.LogInfo("Successfully retrieved {Count} orders for user: {UserId}", orders.Count(), userId);
        return Ok(orders);
      }
      catch (UnauthorizedAccessException ex)
      {
        _logger.LogWarning("Unauthorized access while getting orders: {Message}", ex.Message);
        return Unauthorized(new ErrorResponseDto { Message = ex.Message });
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error occurred while getting orders");
        return BadRequest(new ErrorResponseDto { Message = ex.Message });
      }
    }
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CreateOrderResponseDto>> CreateOrder(CreateOrderDto orderDto)
    {
      try
      {
        var userId = GetCurrentUserId();
        var orderId = await _orderService.CreateOrder(orderDto, userId);
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
