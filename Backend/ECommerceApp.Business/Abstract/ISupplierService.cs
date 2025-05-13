using ECommerceApp.Business.DTOs.Supplier;
using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Business.Abstract
{
    public interface ISupplierService
    {
        Supplier GetById(int id);
        List<Supplier> GetAll();
        void Create(CreateSupplierDto supplierDto);
        void Update(UpdateSupplierDto supplierDto);
        void Delete(int id);
        List<Supplier> GetSuppliersByUserId(int userId);
    }
}
