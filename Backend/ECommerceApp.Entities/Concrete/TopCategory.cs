using System;
using System.Collections.Generic;

namespace ECommerceApp.Entities.Concrete
{
    public class TopCategory
    {
        public int TopCategoryId { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public bool IsActive { get; set; }

        public virtual ICollection<SubCategory> SubCategories { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}