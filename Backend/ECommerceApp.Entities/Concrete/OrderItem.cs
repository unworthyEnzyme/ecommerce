namespace ECommerceApp.Entities.Concrete
{
  public class OrderItem
  {
    public int OrderItemId { get; set; }
    public int OrderId { get; set; }
    public int VariantId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public bool IsActive { get; set; }

    public virtual Order Order { get; set; }
    public virtual Variant Variant { get; set; }
  }
}
