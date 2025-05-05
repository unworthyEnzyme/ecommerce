using System.ComponentModel.DataAnnotations;

namespace ECommerceApp.Entities.Concrete
{
  public class PromotionCode
  {
    [Key]
    public int PromotionCodeId { get; set; }
    public required string Code { get; set; }
    public decimal Discount { get; set; }
    public DateTime ExpiryDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public bool IsActive { get; set; }
  }
}
