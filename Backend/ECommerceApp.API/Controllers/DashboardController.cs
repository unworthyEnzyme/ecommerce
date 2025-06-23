using ECommerceApp.Business.DTOs.Dashboard;
using ECommerceApp.DataAccess.Concrete.EntityFramework;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace ECommerceApp.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class DashboardController(AppDbContext context) : ControllerBase
  {
    private readonly AppDbContext _context = context;

    [HttpGet("stats")]
    [Authorize(Roles = "Admin")]
    public ActionResult<DashboardStatsDto> GetDashboardStats()
    {
      try
      {
        // Calculate total products (active variants)
        var totalProducts = _context.Variants
            .Where(v => v.IsActive)
            .Count();

        // Calculate total orders
        var totalOrders = _context.Orders
            .Where(o => o.IsActive)
            .Count();

        // Calculate total customers (users with Customer role)
        var customerRole = _context.Roles.FirstOrDefault(r => r.Name == "Customer");
        var totalCustomers = customerRole != null
            ? _context.Users
                .Where(u => u.IsActive && u.RoleId == customerRole.RoleId)
                .Count()
            : _context.Users.Where(u => u.IsActive).Count();

        // Calculate total revenue
        var totalRevenue = _context.OrderItems
            .Where(oi => oi.IsActive && oi.Order.IsActive)
            .Sum(oi => oi.Quantity * oi.UnitPrice);

        // Get recent orders (last 10)
        var recentOrders = GetRecentOrders();

        // Get top products by revenue (last 30 days)
        var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
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

        var stats = new DashboardStatsDto
        {
          TotalProducts = totalProducts,
          TotalOrders = totalOrders,
          TotalCustomers = totalCustomers,
          TotalRevenue = totalRevenue,
          RecentOrders = recentOrders,
          TopProducts = topProducts
        };

        return Ok(stats);
      }
      catch (Exception ex)
      {
        return BadRequest(new { message = ex.Message });
      }
    }

    private List<RecentOrderDto> GetRecentOrders()
    {
      return _context.Orders
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
    }
  }
}