using System;
using System.Collections.Generic;

namespace ECommerceApp.Entities.Concrete
{
  public class Order
  {
    public int OrderId { get; set; }
    public DateTime OrderDate { get; set; }
    public int UserId { get; set; }
    public int StatusId { get; set; }
    public int ShippingAddressId { get; set; }
    public int? PromotionCodeId { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public bool IsActive { get; set; }

    public virtual User User { get; set; }
    public virtual OrderStatus Status { get; set; }
    public virtual ShippingAddress ShippingAddress { get; set; }
    public virtual PromotionCode PromotionCode { get; set; }
    public virtual ICollection<OrderItem> OrderItems { get; set; }
    public virtual ICollection<Payment> Payments { get; set; }
  }
}
