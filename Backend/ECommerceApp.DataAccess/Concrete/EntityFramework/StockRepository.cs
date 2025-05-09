using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApp.DataAccess.Concrete.EntityFramework
{
    public class StockRepository : IStockRepository
    {
        private readonly AppDbContext _context;

        public StockRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Add(Stock stock)
        {
            stock.CreatedAt = DateTime.UtcNow;
            stock.LastUpdated = DateTime.UtcNow;
            stock.IsActive = true;
            _context.Stocks.Add(stock);
            _context.SaveChanges();
        }

        public void Delete(Stock stock)
        {
            var existingStock = _context.Stocks.Find(stock.StockId);
            if (existingStock != null)
            {
                existingStock.IsActive = false;
                existingStock.LastUpdated = DateTime.UtcNow;
                _context.Stocks.Update(existingStock);
                _context.SaveChanges();
            }
        }

        public IEnumerable<Stock> GetAll()
        {
            return _context.Stocks
                .Where(s => s.IsActive)
                .Include(s => s.Variant)
                .ToList();
        }

        public Stock GetById(int id)
        {
            return _context.Stocks
                .Include(s => s.Variant)
                .FirstOrDefault(s => s.StockId == id && s.IsActive);
        }

        public IEnumerable<Stock> GetByVariantId(int variantId)
        {
            return _context.Stocks
                .Where(s => s.VariantId == variantId && s.IsActive)
                .Include(s => s.Variant)
                .ToList();
        }

        public void Update(Stock stock)
        {
            var existingStock = _context.Stocks.Find(stock.StockId);
            if (existingStock != null)
            {
                existingStock.Quantity = stock.Quantity;
                existingStock.LastUpdated = DateTime.UtcNow;
                _context.Stocks.Update(existingStock);
                _context.SaveChanges();
            }
        }
    }
}
