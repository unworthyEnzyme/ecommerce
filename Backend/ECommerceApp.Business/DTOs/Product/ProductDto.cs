namespace ECommerceApp.Business.DTOs.Product
{
    public class ProductDto
    {
        public int ProductId { get; set; }
        public string ProductCode { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int SubCategoryId { get; set; }
        public int TopCategoryId { get; set; }
        public string TopCategoryName { get; set; }
        public string SubCategoryName { get; set; }
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
}