namespace ECommerceApp.Entities.Concrete
{
    public class SubCategory
    {
        public int SubCategoryId { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public bool IsActive { get; set; }

        public virtual ICollection<TopCategory> TopCategories { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}
