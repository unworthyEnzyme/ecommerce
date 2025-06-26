using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApp.DataAccess.Concrete.EntityFramework
{
    public class SupplierRepository(AppDbContext context) : ISupplierRepository
    {
        private readonly AppDbContext _context = context;

        public int Add(Supplier supplier)
        {
            _context.Suppliers.Add(supplier);
            _context.SaveChanges();
            return supplier.SupplierId;
        }

        public void Delete(int id)
        {
            var supplier = _context.Suppliers.Find(id);
            if (supplier != null)
            {
                supplier.IsActive = false;
                _context.SaveChanges();
            }
        }

        public List<Supplier> GetAll()
        {
            return _context.Suppliers.Where(s => s.IsActive).ToList();
        }

        public Supplier GetById(int id)
        {
            return _context.Suppliers
                .Include(s => s.Users)
                .FirstOrDefault(s => s.SupplierId == id && s.IsActive);
        }

        public List<Supplier> GetSuppliersByUserId(int userId)
        {
            return _context.Users
                .Include(u => u.Suppliers)
                .FirstOrDefault(u => u.UserId == userId)
                ?.Suppliers
                .Where(s => s.IsActive)
                .ToList() ?? new List<Supplier>();
        }

        public void Update(Supplier supplier)
        {
            supplier.LastUpdated = DateTime.UtcNow;
            _context.Suppliers.Update(supplier);
            _context.SaveChanges();
        }
    }
}
