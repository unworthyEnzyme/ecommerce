namespace ECommerceApp.Business.DTOs.Product
{
    public class ProductAttributeDto
    {
        public string AttributeName { get; set; }
        public string AttributeValue { get; set; }
    }

    public class VariantAttributeDto
    {
        public string AttributeName { get; set; }
        public string AttributeValue { get; set; }
    }

    public class VariantDto
    {
        public int VariantId { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public List<VariantAttributeDto> Attributes { get; set; } = new();
    }

    public class ProductDto
    {
        public int ProductId { get; set; }
        public string ProductCode { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public TopCategoryDto TopCategory { get; set; }
        public SubCategoryDto SubCategory { get; set; }
        public List<ProductAttributeDto> Attributes { get; set; } = new();
        public List<VariantDto> Variants { get; set; } = new();
    }

    public class CreateProductDto
    {
        public string ProductCode { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int SubCategoryId { get; set; }
        public int TopCategoryId { get; set; }
    }

    public class UpdateProductDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int SubCategoryId { get; set; }
        public int TopCategoryId { get; set; }
    }

    public class TopCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class SubCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int TopCategoryId { get; set; }
    }
}
