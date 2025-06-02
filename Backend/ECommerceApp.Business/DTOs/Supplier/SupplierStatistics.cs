using ECommerceApp.Business.DTOs.Variant;

namespace ECommerceApp.Business.DTOs.Supplier
{
    public class SupplierStatistics
    {
        public required int TotalOrders { get; set; }
        public required int Revenue { get; set; }
        public required int AverageOrderValue { get; set; }
        public IEnumerable<int> MonthlySales { get; set; }
        public IEnumerable<float> MonthlyRevenue { get; set; }
        public IEnumerable<CategoryDistributionItem> CategoryDistribution { get; set; }
        public required IEnumerable<TopProduct> TopProducts { get; set; }
    }

    public record CategoryDistributionItem(string Name, int Value);
    public record TopProduct(VariantDto Variant, int TotalSold, float Revenue, DateTime LastOrderDate);
}
