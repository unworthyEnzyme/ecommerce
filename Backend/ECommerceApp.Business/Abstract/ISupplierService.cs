using ECommerceApp.Business.DTOs.Supplier;
using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Business.Abstract
{
    public interface ISupplierService
    {
        SupplierDto GetById(int id);
        List<SupplierDto> GetAll();
        void Create(string token, CreateSupplierDto supplierDto);
        void Update(UpdateSupplierDto supplierDto);
        void Delete(int id);
        List<SupplierDto> GetSuppliersByUserId(int userId);
        SupplierStatistics GetSupplierStatistics(int supplierId);
    }
}
