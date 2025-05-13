namespace ECommerceApp.Entities.Concrete
{
    public class Supplier
    {
        public int SupplierId { get; set; }
        public required string Name { get; set; }
        public required string ContactName { get; set; }
        public required string ContactEmail { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Address { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
        public virtual ICollection<Product> Products { get; set; }
        public virtual ICollection<User> Users { get; set; }
    }
}
