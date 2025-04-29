using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceApp.DataAccess.Concrete.EntityFramework {
    public class AttributeTypeRepository : IAttributeTypeRepository {
        private readonly AppDbContext _context;

        public AttributeTypeRepository(AppDbContext context) {
            _context = context;
        }

        public void Add(AttributeType attributeType) {
            _context.AttributeTypes.Add(attributeType);
            _context.SaveChanges();
        }

        public IEnumerable<AttributeType> GetAll() {
            return _context.AttributeTypes.ToList();
        }
    }
}
