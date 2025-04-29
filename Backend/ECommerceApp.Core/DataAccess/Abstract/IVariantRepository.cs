using ECommerceApp.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceApp.Core.DataAccess.Abstract
{
    public interface IVariantRepository
    {
        void Add(Variant variant);
        IEnumerable<Variant> GetAll();
        Variant GetById(int id);
    }
}
