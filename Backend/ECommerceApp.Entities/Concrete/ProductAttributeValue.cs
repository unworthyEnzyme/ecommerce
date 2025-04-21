using System;

namespace ECommerceApp.Entities.Concrete
{
    public class ProductAttributeValue
    {
        public int ProductAttributeValueId { get; set; }
        public int ProductId { get; set; }
        public int AttributeTypeId { get; set; }
        public string AttributeValue { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public bool IsActive { get; set; }

        public virtual Product Product { get; set; }
        public virtual AttributeType AttributeType { get; set; }
    }
}
