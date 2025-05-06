namespace ECommerceApp.Entities.Concrete
{
    public class Variant
    {
        public int VariantId { get; set; }
        public int ProductId { get; set; }
        public decimal Price { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public bool IsActive { get; set; }

        public virtual Product Product { get; set; }
        public virtual ICollection<VariantAttributeValue> VariantAttributeValues { get; set; }
        public virtual ICollection<VariantImage> VariantImages { get; set; }
        public virtual ICollection<StockMovement> StockMovements { get; set; }
    }
}
