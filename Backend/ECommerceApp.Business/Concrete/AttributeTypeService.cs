using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.AttributeType;
using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Business.Concrete
{
    public class AttributeTypeService(IAttributeTypeRepository attributeTypeRepository) : IAttributeTypeService
    {
        private readonly IAttributeTypeRepository _attributeTypeRepository = attributeTypeRepository;

        public void Add(CreateAttributeTypeDto createAttributeTypeDto)
        {
            var attributeType = new AttributeType
            {
                AttributeName = createAttributeTypeDto.Name,
            };
            _attributeTypeRepository.Add(attributeType);
        }

        public IEnumerable<AttributeTypeDto> GetAll()
        {
            return _attributeTypeRepository.GetAll().Select(a => new AttributeTypeDto
            {
                Id = a.AttributeTypeId,
                Name = a.AttributeName,
            }).ToList();
        }
    }
}
