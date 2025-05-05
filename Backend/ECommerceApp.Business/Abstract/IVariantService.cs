using ECommerceApp.Business.DTOs.Variant;

namespace ECommerceApp.Business.Abstract
{
    public interface IVariantService
    {
        IEnumerable<VariantDto> GetAll();
        int Add(CreateVariantDto createVariantDto);
        VariantDto GetById(int id);
        void Delete(int id);
    }
}
