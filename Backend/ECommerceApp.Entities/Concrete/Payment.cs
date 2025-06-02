namespace ECommerceApp.Entities.Concrete
{
  public class Payment
  {
    public int PaymentId { get; set; }
    public int OrderId { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public int PaymentStatusId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public bool IsActive { get; set; }

    public virtual Order Order { get; set; }
    public virtual PaymentStatus Status { get; set; }
  }
}
