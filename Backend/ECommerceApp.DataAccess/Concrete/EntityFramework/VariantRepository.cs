using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceApp.DataAccess.Concrete.EntityFramework
{
    public class VariantRepository : IVariantRepository
    {
        private readonly AppDbContext _context;

        public VariantRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Add(Variant variant)
        {
            _context.Variants.Add(variant);
            _context.SaveChanges();
        }

        public IEnumerable<Variant> GetAll()
        {
            return _context.Variants
                .Include(v => v.VariantAttributeValues)
                .ThenInclude(vav => vav.AttributeType)
                .Include(v => v.Product)
                .ThenInclude(p => p.TopCategory)
                .Include(v => v.Product)
                .ThenInclude(p => p.SubCategory)
                .ToList();
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
                .FirstOrDefault(v => v.VariantId == id);
        }

        public void Delete(int id)
        {
            var variant = _context.Variants.Find(id);
            if (variant != null)
            {
                _context.Variants.Remove(variant);
                _context.SaveChanges();
            }
        }
    }
}
