using ECommerceApp.Business.DTOs.Dashboard;
using ECommerceApp.DataAccess.Concrete.EntityFramework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace ECommerceApp.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class DashboardController(AppDbContext context, Core.Logging.Abstract.ILoggerFactory loggerFactory) : ControllerBase
  {
    private readonly AppDbContext _context = context;
    private readonly Core.Logging.Abstract.ILogger _logger = loggerFactory.CreateLogger<DashboardController>();

    [HttpGet("stats")]
    [Authorize(Roles = "Admin")]
    public ActionResult<DashboardStatsDto> GetDashboardStats()
    {
      try
      {
        _logger.LogInfo("Starting dashboard stats retrieval");

        // Calculate total products (active variants)
        var totalProducts = _context.Variants
            .Where(v => v.IsActive)
            .Count();
        _logger.LogDebug("Retrieved total products count: {0}", totalProducts);

        // Calculate total orders
        var totalOrders = _context.Orders
            .Where(o => o.IsActive)
            .Count();
        _logger.LogDebug("Retrieved total orders count: {0}", totalOrders);

        // Calculate total customers (users with Customer role)
        var customerRole = _context.Roles.FirstOrDefault(r => r.Name == "Customer");
        if (customerRole == null)
        {
          _logger.LogWarning("Customer role not found in database");
        }

        var totalCustomers = customerRole != null
            ? _context.Users
                .Where(u => u.IsActive && u.RoleId == customerRole.RoleId)
                .Count()
            : _context.Users.Where(u => u.IsActive).Count();
        _logger.LogDebug("Retrieved total customers count: {0}", totalCustomers);

        // Calculate total revenue
        var totalRevenue = _context.OrderItems
            .Where(oi => oi.IsActive && oi.Order.IsActive)
            .Sum(oi => oi.Quantity * oi.UnitPrice);
        _logger.LogDebug("Calculated total revenue: {0:C}", totalRevenue);

        // Get recent orders (last 10)
        _logger.LogDebug("Retrieving recent orders");
        var recentOrders = GetRecentOrders();
        _logger.LogDebug("Retrieved {0} recent orders", recentOrders.Count);

        // Get top products by revenue (last 30 days)
        var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
        _logger.LogDebug("Retrieving top products from date: {0}", thirtyDaysAgo.ToString("yyyy-MM-dd"));

        var topProducts = _context.OrderItems
            .Where(oi => oi.IsActive && oi.Order.IsActive && oi.Order.OrderDate >= thirtyDaysAgo)
            .Include(oi => oi.Variant)
            .ThenInclude(v => v.Product)
            .GroupBy(oi => new { oi.VariantId, oi.Variant.Product.Name })
            .Select(g => new TopProductDto
            {
              Id = $"PROD-{g.Key.VariantId:D3}",
              Name = g.Key.Name,
              Sales = g.Sum(oi => oi.Quantity),
              Revenue = g.Sum(oi => oi.Quantity * oi.UnitPrice)
            })
            .OrderByDescending(tp => tp.Revenue)
            .Take(5)
            .ToList();
        _logger.LogDebug("Retrieved {0} top products", topProducts.Count);

        var stats = new DashboardStatsDto
        {
          TotalProducts = totalProducts,
          TotalOrders = totalOrders,
          TotalCustomers = totalCustomers,
          TotalRevenue = totalRevenue,
          RecentOrders = recentOrders,
          TopProducts = topProducts
        };

        _logger.LogInfo("Successfully retrieved dashboard stats - Products: {0}, Orders: {1}, Customers: {2}, Revenue: {3:C}",
          totalProducts, totalOrders, totalCustomers, totalRevenue);

        return Ok(stats);
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error occurred while retrieving dashboard stats");
        return BadRequest(new { message = ex.Message });
      }
    }

    private List<RecentOrderDto> GetRecentOrders()
    {
      _logger.LogDebug("Fetching recent orders from database");

      var orders = _context.Orders
          .Where(o => o.IsActive)
          .Include(o => o.User)
          .Include(o => o.Status)
          .OrderByDescending(o => o.OrderDate)
          .Take(10)
          .Select(o => new RecentOrderDto
          {
            Id = $"ORD-{o.OrderId:D3}",
            CustomerName = $"{o.User.FirstName} {o.User.LastName}".Trim(),
            Total = o.TotalAmount,
            Status = o.Status.Name.ToLower(),
            Date = o.OrderDate.ToString("yyyy-MM-dd")
          })
          .ToList();

      _logger.LogDebug("Successfully fetched {0} recent orders", orders.Count);
      return orders;
    }
  }
}