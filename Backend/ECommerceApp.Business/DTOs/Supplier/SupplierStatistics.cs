namespace ECommerceApp.Business.DTOs.Supplier
{
    public class SupplierStatistics
    {
        public required int TotalOrders { get; set; }
        public required int Revenue { get; set; }
        public required int AverageOrderValue { get; set; }
        public IEnumerable<int> MonthlySales { get; set; }
        public IEnumerable<float> MonthlyRevenue { get; set; }
        public KeyValuePair<string, int> CategoryDistribution { get; set; }
    }
}
