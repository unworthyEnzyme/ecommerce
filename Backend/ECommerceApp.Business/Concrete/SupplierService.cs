using System.IdentityModel.Tokens.Jwt;
using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Supplier;
using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.DataAccess.Concrete.EntityFramework;
using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace ECommerceApp.Business.Concrete
{
    public class SupplierService : ISupplierService
    {
        private readonly ISupplierRepository _supplierRepository;
        private readonly AppDbContext _context;

        public SupplierService(ISupplierRepository supplierRepository, AppDbContext context)
        {
            _supplierRepository = supplierRepository;
            _context = context;
        }

        public int Create(string token, CreateSupplierDto supplierDto)
        {
            var supplier = new Supplier
            {
                Name = supplierDto.Name,
                ContactName = supplierDto.ContactName,
                ContactEmail = supplierDto.ContactEmail,
                PhoneNumber = supplierDto.PhoneNumber,
                Address = supplierDto.Address
            };

            var ownerId = GetUserIdFromToken(token);
            var owner = _context.Users.FirstOrDefault(u => u.UserId == ownerId);
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
                    MonthlySales = Enumerable.Repeat(0, 6),
                    MonthlyRevenue = Enumerable.Repeat(0f, 6),
                    CategoryDistribution = new KeyValuePair<string, int>("None", 0)
                };
            }

            // Get all product IDs
            var productIds = products.Select(p => p.ProductId).ToList();

            // Get all variants for these products
            var variants = _context.Variants
                .Where(v => productIds.Contains(v.ProductId) && v.IsActive)
                .ToList();

            if (!variants.Any())
            {
                return new SupplierStatistics
                {
                    TotalOrders = 0,
                    Revenue = 0,
                    AverageOrderValue = 0,
                    MonthlySales = Enumerable.Repeat(0, 6),
                    MonthlyRevenue = Enumerable.Repeat(0f, 6),
                    CategoryDistribution = new KeyValuePair<string, int>("None", 0)
                };
            }

            // Get all variant IDs
            var variantIds = variants.Select(v => v.VariantId).ToList();

            // Get all order items for these variants
            var orderItems = _context.OrderItems
                .Where(oi => variantIds.Contains(oi.VariantId) && oi.IsActive)
                .Include(oi => oi.Order)
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

            // Calculate top category
            var topCategoryData = products
                .GroupBy(p => p.TopCategoryId)
                .Select(g => new { CategoryId = g.Key, Count = g.Count() })
                .OrderByDescending(g => g.Count)
                .FirstOrDefault();

            string topCategoryName = "None";
            int topCategoryCount = 0;

            if (topCategoryData != null)
            {
                var topCategory = _context.TopCategories
                    .FirstOrDefault(tc => tc.TopCategoryId == topCategoryData.CategoryId);

                topCategoryName = topCategory?.Name ?? "Unknown";
                topCategoryCount = topCategoryData.Count;
            }

            return new SupplierStatistics
            {
                TotalOrders = orderIds.Count,
                Revenue = (int)totalRevenue,
                AverageOrderValue = avgOrderValue,
                MonthlySales = monthlySales,
                MonthlyRevenue = monthlyRevenue,
                CategoryDistribution = new KeyValuePair<string, int>(topCategoryName, topCategoryCount)
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

        private int GetUserIdFromToken(string token)
        {
            if (string.IsNullOrEmpty(token))
                throw new UnauthorizedAccessException("No token provided");

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

            if (jsonToken == null)
                throw new UnauthorizedAccessException("Invalid token");

            var userIdClaim = jsonToken.Claims.FirstOrDefault(c => c.Type == "nameid");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                throw new UnauthorizedAccessException("Invalid user ID in token");

            return userId;
        }
    }
}
