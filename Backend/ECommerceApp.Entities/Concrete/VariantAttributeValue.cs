using System;

namespace ECommerceApp.Entities.Concrete
{
    public class VariantAttributeValue
    {
        public int VariantAttributeValueId { get; set; }
        public int VariantId { get; set; }
        public int AttributeTypeId { get; set; }
        public string AttributeValue { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public bool IsActive { get; set; }

        public virtual Variant Variant { get; set; }
        public virtual AttributeType AttributeType { get; set; }
    }
}
