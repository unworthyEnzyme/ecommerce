namespace ECommerceApp.Business.DTOs.Order
{
    public class OrderDetailsDto
    {
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public List<OrderItemDetailsDto> Items { get; set; }
    }
}
