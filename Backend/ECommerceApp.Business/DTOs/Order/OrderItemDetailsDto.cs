namespace ECommerceApp.Business.DTOs.Order
{
    public class OrderItemDetailsDto
    {
        public int VariantId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public IEnumerable<OrderVariantAttributeDto> Attributes { get; set; }
    }
}
