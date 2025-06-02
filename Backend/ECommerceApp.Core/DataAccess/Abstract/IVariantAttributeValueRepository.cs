using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Core.DataAccess.Abstract
{
    public interface IVariantAttributeValueRepository
    {
        IEnumerable<VariantAttributeValue> GetAll();
        IEnumerable<VariantAttributeValue> GetByVariantIds(IEnumerable<int> variantIds);
    }
}
