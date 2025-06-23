namespace ECommerceApp.Business.DTOs.Dashboard
{
  public class TopProductDto
  {
    public required string Id { get; set; }
    public required string Name { get; set; }
    public int Sales { get; set; }
    public decimal Revenue { get; set; }
  }
}
