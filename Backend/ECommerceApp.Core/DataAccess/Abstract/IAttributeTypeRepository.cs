using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Core.DataAccess.Abstract
{
    public interface IAttributeTypeRepository
    {
        IEnumerable<AttributeType> GetAll();
        void Add(AttributeType attributeType);
    }
}
