using ECommerceApp.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceApp.Core.DataAccess.Abstract {
    public interface IAttributeTypeRepository {
        IEnumerable<AttributeType> GetAll();
        void Add(AttributeType attributeType);
    }
}
