using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApp.DataAccess.Concrete.EntityFramework
{
    public class VariantRepository(AppDbContext context) : IVariantRepository
    {
        private readonly AppDbContext _context = context;

        private int CalculateStock(int variantId)
        {
            return _context.StockMovements
                .Where(sm => sm.VariantId == variantId && sm.IsActive)
                .Sum(sm => sm.MovementType == "IN" ? sm.Quantity : -sm.Quantity);
        }

        private Stock GetOrCreateStock(int variantId)
        {
            var stock = _context.Stocks.FirstOrDefault(s => s.VariantId == variantId);
            if (stock == null)
            {
                stock = new Stock
                {
                    VariantId = variantId,
                    Quantity = 0,
                    CreatedAt = DateTime.UtcNow,
                    LastUpdated = DateTime.UtcNow,
                    IsActive = true
                };
                _context.Stocks.Add(stock);
            }
            return stock;
        }

        public int Add(Variant variant)
        {
            _context.Variants.Add(variant);
            _context.SaveChanges();
            return variant.VariantId;
        }

        public void AddStockMovement(StockMovement movement)
        {
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                _context.StockMovements.Add(movement);

                var stock = GetOrCreateStock(movement.VariantId);
                stock.Quantity += movement.MovementType == "IN" ? movement.Quantity : -movement.Quantity;
                stock.LastUpdated = DateTime.UtcNow;

                _context.SaveChanges();
                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
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
                .Include(v => v.Stock)
                .Where(v => v.IsActive)
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
                .Include(v => v.Stock)
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
                .Include(v => v.Stock)
                .Where(v => v.Product.TopCategoryId == topCategoryId &&
                           v.Product.SubCategoryId == subCategoryId &&
                           v.IsActive)
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
                .Include(v => v.Stock)
                .Where(v => v.IsActive)
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

        public IEnumerable<Variant> GetByCategoriesPriceRangeAndAttributes(
            int? topCategoryId,
            int? subCategoryId,
            decimal? minPrice,
            decimal? maxPrice,
            Dictionary<int, string> attributeFilters)
        {
            var query = _context.Variants
                .Include(v => v.VariantAttributeValues)
                    .ThenInclude(vav => vav.AttributeType)
                .Include(v => v.Product)
                    .ThenInclude(p => p.TopCategory)
                .Include(v => v.Product)
                    .ThenInclude(p => p.SubCategory)
                .Include(v => v.Stock)
                .Where(v => v.IsActive)
                .AsQueryable();

            if (topCategoryId.HasValue)
                query = query.Where(v => v.Product.TopCategoryId == topCategoryId);

            if (subCategoryId.HasValue)
                query = query.Where(v => v.Product.SubCategoryId == subCategoryId);

            if (minPrice.HasValue)
                query = query.Where(v => v.Price >= minPrice);

            if (maxPrice.HasValue)
                query = query.Where(v => v.Price <= maxPrice);

            // Apply attribute filters
            if (attributeFilters != null && attributeFilters.Count > 0)
            {
                foreach (var filter in attributeFilters)
                {
                    int attributeTypeId = filter.Key;
                    string attributeValue = filter.Value;

                    query = query.Where(v =>
                        v.VariantAttributeValues.Any(vav =>
                            vav.AttributeTypeId == attributeTypeId &&
                            vav.AttributeValue == attributeValue &&
                            vav.IsActive));
                }
            }

            return query.ToList();
        }
    }
}
