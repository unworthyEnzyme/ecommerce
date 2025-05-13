using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Core.DataAccess.Abstract
{
    public interface ISupplierRepository
    {
        Supplier GetById(int id);
        List<Supplier> GetAll();
        void Add(Supplier supplier);
        void Update(Supplier supplier);
        void Delete(int id);
        List<Supplier> GetSuppliersByUserId(int userId);
    }
}
