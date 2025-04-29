using ECommerceApp.Business.DTOs.Product;
using ECommerceApp.Business.DTOs.Variant;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceApp.Business.Abstract
{
    public interface IVariantService
    {
        IEnumerable<VariantDto> GetAll();
        void Add(CreateVariantDto createVariantDto);
        VariantDto GetById(int id);
    }
}
