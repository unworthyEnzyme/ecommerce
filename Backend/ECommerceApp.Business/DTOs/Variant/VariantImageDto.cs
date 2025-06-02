namespace ECommerceApp.Business.DTOs.Variant
{
  public class VariantImageDto
  {
    public int ImageId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
    public int SortOrder { get; set; }
  }

  public class CreateVariantImageDto
  {
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
    public int SortOrder { get; set; }
  }
}
