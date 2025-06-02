using ECommerceApp.Business.DTOs.Product;

namespace ECommerceApp.Business.DTOs.Variant
{
  public class VariantDto
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public ProductDto Product { get; set; }
    public IEnumerable<VariantAttributeDto> Attributes { get; set; }
    public IEnumerable<VariantImageDto> Images { get; set; }
  }
}
