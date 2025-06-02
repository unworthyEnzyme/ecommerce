namespace ECommerceApp.Business.DTOs.Order
{
  public class CreateOrderDto
  {
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public required string Address { get; set; }
    public required string City { get; set; }
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
    public required string PhoneNumber { get; set; } = string.Empty;
    public required List<OrderItemDto> Items { get; set; }
  }

  public class OrderItemDto
  {
    public int VariantId { get; set; }
    public int Quantity { get; set; }
  }
}
