using ECommerceApp.Business.DTOs.Supplier;

namespace ECommerceApp.Business.Abstract
{
    public interface ISupplierService
    {
        SupplierDto GetById(int id);
        List<SupplierDto> GetAll();
        int Create(int userId, CreateSupplierDto supplierDto);
        void Update(UpdateSupplierDto supplierDto);
        void Delete(int id);
        List<SupplierDto> GetSuppliersByUserId(int userId);
        SupplierStatistics GetSupplierStatistics(int supplierId);
        void AddEmployee(int id, CreateEmployeeDto employeeDto);
    }
}
