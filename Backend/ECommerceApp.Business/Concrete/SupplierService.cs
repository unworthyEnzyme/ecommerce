using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Supplier;
using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.DataAccess.Concrete.EntityFramework;
using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using ECommerceApp.Business.DTOs.Variant;
using ECommerceApp.Business.DTOs.Product;

namespace ECommerceApp.Business.Concrete
{
    public class SupplierService(
        ISupplierRepository supplierRepository,
        AppDbContext context,
        IEmployeeInvitationRepository employeeInvitationRepository) : ISupplierService
    {
        private readonly ISupplierRepository _supplierRepository = supplierRepository;
        private readonly IEmployeeInvitationRepository _employeeInvitationRepository = employeeInvitationRepository;
        private readonly AppDbContext _context = context;

        public void AddEmployee(int id, CreateEmployeeDto employeeDto)
        {
            var supplier = _supplierRepository.GetById(id) ?? throw new Exception("Supplier not found");
            var employee = new EmployeeInvitation
            {
                Email = employeeDto.Email,
                SupplierId = id,
                UUID = Guid.NewGuid().ToString(),
            };
            _employeeInvitationRepository.Add(employee);
        }
        public int Create(int userId, CreateSupplierDto supplierDto)
        {
            var supplier = new Supplier
            {
                Name = supplierDto.Name,
                ContactName = supplierDto.ContactName,
                ContactEmail = supplierDto.ContactEmail,
                PhoneNumber = supplierDto.PhoneNumber,
                Address = supplierDto.Address
            };

            var owner = _context.Users.FirstOrDefault(u => u.UserId == userId);
            if (owner != null)
            {
                supplier.Users = [owner];
            }

            return _supplierRepository.Add(supplier);
        }

        public void Delete(int id)
        {
            _supplierRepository.Delete(id);
        }

        public List<SupplierDto> GetAll()
        {
            return _supplierRepository.GetAll().Select(s => new SupplierDto
            {
                Id = s.SupplierId,
                Name = s.Name,
                ContactName = s.ContactName,
                ContactEmail = s.ContactEmail,
                PhoneNumber = s.PhoneNumber,
                Address = s.Address,
                CreatedAt = s.CreatedAt
            }).ToList();
        }

        public SupplierDto GetById(int id)
        {
            var supplier = _supplierRepository.GetById(id);
            if (supplier == null)
                return null;

            return new SupplierDto
            {
                Id = supplier.SupplierId,
                Name = supplier.Name,
                ContactName = supplier.ContactName,
                ContactEmail = supplier.ContactEmail,
                PhoneNumber = supplier.PhoneNumber,
                Address = supplier.Address,
                CreatedAt = supplier.CreatedAt
            };
        }

        public List<SupplierDto> GetSuppliersByUserId(int userId)
        {
            return _supplierRepository.GetSuppliersByUserId(userId).Select(s => new SupplierDto
            {
                Id = s.SupplierId,
                Name = s.Name,
                ContactName = s.ContactName,
                ContactEmail = s.ContactEmail,
                PhoneNumber = s.PhoneNumber,
                Address = s.Address
            }).ToList();
        }

        public SupplierStatistics GetSupplierStatistics(int supplierId)
        {
            // Get all products for this supplier
            var products = _context.Products
                .Where(p => p.SupplierId == supplierId && p.IsActive)
                .ToList();

            if (!products.Any())
            {
                return new SupplierStatistics
                {
                    TotalOrders = 0,
                    Revenue = 0,
                    AverageOrderValue = 0,
                    MonthlySales = Enumerable.Repeat(0, 6).ToList(),
                    MonthlyRevenue = Enumerable.Repeat(0f, 6).ToList(),
                    CategoryDistribution = new List<CategoryDistributionItem> { new CategoryDistributionItem("None", 0) },
                    TopProducts = new List<TopProduct>()
                };
            }

            // Get all product IDs
            var productIds = products.Select(p => p.ProductId).ToList();

            // Get all variants for these products
            var variants = _context.Variants
                .Where(v => productIds.Contains(v.ProductId) && v.IsActive)
                .Include(v => v.Product)
                .Include(v => v.Stock)
                .ToList();

            if (!variants.Any())
            {
                return new SupplierStatistics
                {
                    TotalOrders = 0,
                    Revenue = 0,
                    AverageOrderValue = 0,
                    MonthlySales = Enumerable.Repeat(0, 6).ToList(),
                    MonthlyRevenue = Enumerable.Repeat(0f, 6).ToList(),
                    CategoryDistribution = [new CategoryDistributionItem("None", 0)],
                    TopProducts = []
                };
            }

            // Get all variant IDs
            var variantIds = variants.Select(v => v.VariantId).ToList();

            // Get all order items for these variants
            var orderItems = _context.OrderItems
                .Where(oi => variantIds.Contains(oi.VariantId) && oi.IsActive)
                .Include(oi => oi.Order)
                .Include(oi => oi.Variant)
                .ThenInclude(v => v.Product)
                .Where(oi => oi.Order.IsActive)
                .ToList();

            // Get unique order IDs
            var orderIds = orderItems.Select(oi => oi.OrderId).Distinct().ToList();

            // Calculate total revenue
            var totalRevenue = orderItems.Sum(oi => oi.Quantity * oi.UnitPrice);

            // Calculate average order value
            var avgOrderValue = orderIds.Count > 0 ? (int)(totalRevenue / orderIds.Count) : 0;

            // Get monthly sales for the last 6 months
            var now = DateTime.UtcNow;
            var monthlySales = new List<int>();
            var monthlyRevenue = new List<float>();

            for (int i = 5; i >= 0; i--)
            {
                var targetMonth = now.AddMonths(-i);
                var monthStart = new DateTime(targetMonth.Year, targetMonth.Month, 1);
                var monthEnd = monthStart.AddMonths(1).AddDays(-1);

                var monthlyOrders = orderItems
                    .Where(oi => oi.Order.OrderDate >= monthStart && oi.Order.OrderDate <= monthEnd)
                    .ToList();

                var monthOrderIds = monthlyOrders.Select(mo => mo.OrderId).Distinct().Count();
                var monthRev = monthlyOrders.Sum(mo => mo.Quantity * mo.UnitPrice);

                monthlySales.Add(monthOrderIds);
                monthlyRevenue.Add((float)monthRev);
            }

            // Calculate category distribution
            var categoryDistribution = products
                .GroupBy(p => p.TopCategoryId)
                .Select(g => new { CategoryId = g.Key, Count = g.Count() })
                .ToList();

            var categoryDistributionItems = new List<CategoryDistributionItem>();

            foreach (var category in categoryDistribution)
            {
                var topCategory = _context.TopCategories
                    .FirstOrDefault(tc => tc.TopCategoryId == category.CategoryId);

                string categoryName = topCategory?.Name ?? "Unknown";
                categoryDistributionItems.Add(new CategoryDistributionItem(categoryName, category.Count));
            }

            // If no categories found, add a "None" item
            if (!categoryDistributionItems.Any())
            {
                categoryDistributionItems.Add(new CategoryDistributionItem("None", 0));
            }

            // Calculate top products
            var topProducts = orderItems
                .GroupBy(oi => oi.VariantId)
                .Select(g => new
                {
                    Variant = variants.First(v => v.VariantId == g.Key),
                    TotalSold = g.Sum(oi => oi.Quantity),
                    Revenue = g.Sum(oi => oi.Quantity * oi.UnitPrice),
                    LastOrderDate = g.Max(oi => oi.Order.OrderDate)
                })
                .OrderByDescending(p => p.Revenue)
                .Take(5).Select(tp => new TopProduct(
                    new VariantDto
                    {
                        Id = tp.Variant.VariantId,
                        Name = tp.Variant.Product.Name,
                        Price = tp.Variant.Price,
                        Stock = tp.Variant.Stock?.Quantity ?? 0,
                        Product = new ProductDto
                        {
                            ProductId = tp.Variant.Product.ProductId,
                            Name = tp.Variant.Product.Name,
                            TopCategory = new TopCategoryDto
                            {
                                Id = tp.Variant.Product.TopCategoryId,
                                Name = tp.Variant.Product.TopCategory.Name,
                            }
                        },
                        Attributes = [],
                        Images = _context.VariantImages
                            .Where(vi => vi.VariantId == tp.Variant.VariantId && vi.IsActive)
                            .Select(vi => new VariantImageDto
                            {
                                ImageId = vi.ImageId,
                                ImageUrl = vi.ImageUrl,
                                IsPrimary = vi.IsPrimary,
                                SortOrder = vi.SortOrder
                            }).ToList()
                    },
                    tp.TotalSold,
                    (float)tp.Revenue,
                    tp.LastOrderDate
                ))
                .ToList();

            return new SupplierStatistics
            {
                TotalOrders = orderIds.Count,
                Revenue = (int)totalRevenue,
                AverageOrderValue = avgOrderValue,
                MonthlySales = monthlySales,
                MonthlyRevenue = monthlyRevenue,
                CategoryDistribution = categoryDistributionItems,
                TopProducts = topProducts
            };
        }

        public void Update(UpdateSupplierDto supplierDto)
        {
            var supplier = _supplierRepository.GetById(supplierDto.SupplierId);
            if (supplier != null)
            {
                supplier.Name = supplierDto.Name;
                supplier.ContactName = supplierDto.ContactName;
                supplier.ContactEmail = supplierDto.ContactEmail;
                supplier.PhoneNumber = supplierDto.PhoneNumber;
                supplier.Address = supplierDto.Address;
                _supplierRepository.Update(supplier);
            }
        }
    }
}
