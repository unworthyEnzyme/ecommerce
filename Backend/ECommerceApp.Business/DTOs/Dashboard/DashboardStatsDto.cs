namespace ECommerceApp.Business.DTOs.Dashboard
{
  public class DashboardStatsDto
  {
    public int TotalProducts { get; set; }
    public int TotalOrders { get; set; }
    public int TotalCustomers { get; set; }
    public decimal TotalRevenue { get; set; }
    public List<RecentOrderDto> RecentOrders { get; set; } = new List<RecentOrderDto>();
    public List<TopProductDto> TopProducts { get; set; } = new List<TopProductDto>();
  }
}
