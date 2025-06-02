namespace ECommerceApp.Business.DTOs.Cart
{
  public class CartDto
  {
    public int CartId { get; set; }
    public List<CartItemDto> Items { get; set; }
    public decimal TotalAmount { get; set; }
  }
}
