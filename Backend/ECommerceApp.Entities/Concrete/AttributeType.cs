namespace ECommerceApp.Entities.Concrete
{
    public class AttributeType
    {
        public int AttributeTypeId { get; set; }
        public string AttributeName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public bool IsActive { get; set; }

        public virtual ICollection<ProductAttributeValue> ProductAttributeValues { get; set; }
        public virtual ICollection<ProductVariantAttributeType> ProductVariantAttributeTypes { get; set; }
        public virtual ICollection<VariantAttributeValue> VariantAttributeValues { get; set; }
    }
}
