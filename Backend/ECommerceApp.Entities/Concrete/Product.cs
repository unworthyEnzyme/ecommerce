using System;

namespace ECommerceApp.Entities.Concrete
{
    public class Product
    {
        public int ProductId { get; set; }
        public string ProductCode { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int SubCategoryId { get; set; }
        public int TopCategoryId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public bool IsActive { get; set; }

        public virtual SubCategory SubCategory { get; set; }
        public virtual TopCategory TopCategory { get; set; }
    }
}