using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApp.DataAccess.Concrete.EntityFramework
{
    public class VariantRepository : IVariantRepository
    {
        private readonly AppDbContext _context;

        public VariantRepository(AppDbContext context)
        {
            _context = context;
        }

        private int CalculateStock(int variantId)
        {
            return _context.StockMovements
                .Where(sm => sm.VariantId == variantId && sm.IsActive)
                .Sum(sm => sm.MovementType == "IN" ? sm.Quantity : -sm.Quantity);
        }

        public int Add(Variant variant)
        {
            _context.Variants.Add(variant);
            _context.SaveChanges();
            return variant.VariantId;
        }

        public void AddStockMovement(StockMovement movement)
        {
            _context.StockMovements.Add(movement);
            _context.SaveChanges();
        }

        public IEnumerable<Variant> GetAll()
        {
            var variants = _context.Variants
                .Include(v => v.VariantAttributeValues)
                .ThenInclude(vav => vav.AttributeType)
                .Include(v => v.Product)
                .ThenInclude(p => p.TopCategory)
                .Include(v => v.Product)
                .ThenInclude(p => p.SubCategory)
                .Include(v => v.StockMovements.Where(sm => sm.IsActive))
                .ToList();

            return variants;
        }

        public Variant GetById(int id)
        {
            return _context.Variants
                .Include(v => v.VariantAttributeValues)
                .ThenInclude(vav => vav.AttributeType)
                .Include(v => v.Product)
                .ThenInclude(p => p.TopCategory)
                .Include(v => v.Product)
                .ThenInclude(p => p.SubCategory)
                .Include(v => v.StockMovements.Where(sm => sm.IsActive))
                .FirstOrDefault(v => v.VariantId == id);
        }

        public bool HasSufficientStock(int variantId, int requestedQuantity)
        {
            return CalculateStock(variantId) >= requestedQuantity;
        }

        public void Delete(int id)
        {
            var variant = _context.Variants.Find(id);
            if (variant != null)
            {
                variant.IsActive = false;
                variant.DeletedAt = DateTime.UtcNow;
                _context.SaveChanges();
            }
        }

        public IEnumerable<Variant> GetByCategories(int topCategoryId, int subCategoryId)
        {
            return _context.Variants
                .Include(v => v.VariantAttributeValues)
                .ThenInclude(vav => vav.AttributeType)
                .Include(v => v.Product)
                .ThenInclude(p => p.TopCategory)
                .Include(v => v.Product)
                .ThenInclude(p => p.SubCategory)
                .Where(v => v.Product.TopCategoryId == topCategoryId &&
                           v.Product.SubCategoryId == subCategoryId)
                .ToList();
        }

        public IEnumerable<Variant> GetByCategoriesAndPriceRange(int? topCategoryId, int? subCategoryId, decimal? minPrice, decimal? maxPrice)
        {
            var query = _context.Variants
                .Include(v => v.VariantAttributeValues)
                .ThenInclude(vav => vav.AttributeType)
                .Include(v => v.Product)
                .ThenInclude(p => p.TopCategory)
                .Include(v => v.Product)
                .ThenInclude(p => p.SubCategory)
                .AsQueryable();

            if (topCategoryId.HasValue)
                query = query.Where(v => v.Product.TopCategoryId == topCategoryId);

            if (subCategoryId.HasValue)
                query = query.Where(v => v.Product.SubCategoryId == subCategoryId);

            if (minPrice.HasValue)
                query = query.Where(v => v.Price >= minPrice);

            if (maxPrice.HasValue)
                query = query.Where(v => v.Price <= maxPrice);

            return query.ToList();
        }
    }
}
