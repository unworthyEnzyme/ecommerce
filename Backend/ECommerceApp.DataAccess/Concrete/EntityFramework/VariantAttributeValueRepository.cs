using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApp.DataAccess.Concrete.EntityFramework
{
    public class VariantAttributeValueRepository(AppDbContext context) : IVariantAttributeValueRepository
    {
        private readonly AppDbContext _context = context;

        public IEnumerable<VariantAttributeValue> GetAll()
        {
            return _context.VariantAttributeValues
                 .Include(v => v.Variant)
                 .Include(v => v.AttributeValue)
                 .Include(v => v.AttributeType)
                 .ToList();
        }

        public IEnumerable<VariantAttributeValue> GetByVariantIds(IEnumerable<int> variantIds)
        {
            return _context.VariantAttributeValues
                .Include(v => v.Variant)
                .Include(v => v.AttributeValue)
                .Include(v => v.AttributeType)
                .Where(v => variantIds.Contains(v.VariantId) && v.IsActive)
                .ToList();
        }
    }
}
