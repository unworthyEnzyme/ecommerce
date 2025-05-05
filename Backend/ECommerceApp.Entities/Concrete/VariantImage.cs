namespace ECommerceApp.Entities.Concrete
{
  public class VariantImage
  {
    public int ImageId { get; set; }
    public int VariantId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public bool IsActive { get; set; }

    public virtual Variant? Variant { get; set; }
  }
}
