using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApp.DataAccess.Concrete.EntityFramework
{
    public class ProductRepository(AppDbContext context) : IProductRepository
    {
        private readonly AppDbContext _context = context;

        public IEnumerable<Product> GetAll()
        {
            return _context.Products
                .Include(p => p.TopCategory)
                .Include(p => p.SubCategory)
                .Include(p => p.ProductAttributeValues)
                    .ThenInclude(pav => pav.AttributeType)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.VariantAttributeValues)
                        .ThenInclude(vav => vav.AttributeType)
                .Include(p => p.Supplier)
                .Where(p => p.IsActive)
                .ToList();
        }
        public Product GetById(int id)
        {
            return _context.Products
                .Include(p => p.TopCategory)
                .Include(p => p.SubCategory)
                .Include(p => p.ProductAttributeValues)
                    .ThenInclude(pav => pav.AttributeType)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.VariantAttributeValues)
                        .ThenInclude(vav => vav.AttributeType)
                .Include(p => p.Supplier)
                .FirstOrDefault(p => p.ProductId == id && p.IsActive);
        }
        public IEnumerable<Product> GetByTopCategory(int topCategoryId)
        {
            return _context.Products
                .Include(p => p.TopCategory)
                .Include(p => p.SubCategory)
                .Include(p => p.ProductAttributeValues)
                    .ThenInclude(pav => pav.AttributeType)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.VariantAttributeValues)
                        .ThenInclude(vav => vav.AttributeType)
                .Where(p => p.TopCategoryId == topCategoryId && p.IsActive)
                .ToList();
        }
        public IEnumerable<Product> GetBySubCategory(int subCategoryId)
        {
            return _context.Products
                .Include(p => p.TopCategory)
                .Include(p => p.SubCategory)
                .Include(p => p.ProductAttributeValues)
                    .ThenInclude(pav => pav.AttributeType)
                .Include(p => p.Variants)
                    .ThenInclude(v => v.VariantAttributeValues)
                        .ThenInclude(vav => vav.AttributeType)
                .Where(p => p.SubCategoryId == subCategoryId && p.IsActive)
                .ToList();
        }

        public Product Add(Product product)
        {
            product.CreatedAt = DateTime.UtcNow;
            product.IsActive = true;
            _context.Products.Add(product);
            _context.SaveChanges();
            return product;
        }

        public void Update(Product product)
        {
            product.UpdatedAt = DateTime.UtcNow;
            _context.Products.Update(product);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product != null)
            {
                product.IsActive = false;
                product.DeletedAt = DateTime.UtcNow;
                _context.SaveChanges();
            }
        }

        public bool Exists(string productCode)
        {
            return _context.Products.Any(p => p.ProductCode == productCode && p.IsActive);
        }

        public IEnumerable<TopCategory> GetTopCategories()
        {
            return _context.TopCategories
                .Include(tc => tc.SubCategories)
                .Where(tc => tc.IsActive)
                .ToList();
        }
    }
}
