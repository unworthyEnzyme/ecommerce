using ECommerceApp.Business.DTOs.AttributeType;

namespace ECommerceApp.Business.Abstract
{
    public interface IAttributeTypeService
    {
        IEnumerable<AttributeTypeDto> GetAll();
        void Add(CreateAttributeTypeDto createAttributeTypeDto);
    }
}
