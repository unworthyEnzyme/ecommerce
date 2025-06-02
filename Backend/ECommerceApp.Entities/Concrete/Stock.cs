namespace ECommerceApp.Entities.Concrete
{
    public class Stock
    {
        public int StockId { get; set; }
        public int VariantId { get; set; }
        public int Quantity { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdated { get; set; }
        public bool IsActive { get; set; }
        public virtual Variant Variant { get; set; }
    }
}
