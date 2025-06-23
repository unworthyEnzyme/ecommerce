namespace ECommerceApp.Business.DTOs.Dashboard
{
  public class RecentOrderDto
  {
    public required string Id { get; set; }
    public required string CustomerName { get; set; }
    public required decimal Total { get; set; }
    public required string Status { get; set; }
    public required string Date { get; set; }
  }
}
