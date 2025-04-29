using ECommerceApp.Business.DTOs.AttributeType;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceApp.Business.Abstract {
    public interface IAttributeTypeService {
        IEnumerable<AttributeTypeDto> GetAll();
        void Add(CreateAttributeTypeDto createAttributeTypeDto);
    }
}
