using ECommerceApp.Business.DTOs.Variant;

namespace ECommerceApp.Business.DTOs.Cart
{
  public class CartItemDto
  {
    public int CartItemId { get; set; }
    public VariantDto Variant { get; set; }
    public int Quantity { get; set; }
    public decimal SubTotal { get; set; }
  }
}
