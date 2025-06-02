using System;

namespace ECommerceApp.Entities.Concrete
{
  public class StockMovement
  {
    public int StockMovementId { get; set; }
    public int VariantId { get; set; }
    public int Quantity { get; set; }
    public string MovementType { get; set; } // IN, OUT
    public string Reference { get; set; } // Order ID, Purchase ID, etc.
    public string Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }

    public virtual Variant Variant { get; set; }
  }
}
