using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Supplier;
using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.DataAccess.Concrete.EntityFramework;
using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Business.Concrete
{
    public class SupplierService : ISupplierService
    {
        private readonly ISupplierRepository _supplierRepository;
        private readonly AppDbContext _context;

        public SupplierService(ISupplierRepository supplierRepository, AppDbContext context)
        {
            _supplierRepository = supplierRepository;
            _context = context;
        }

        public void Create(CreateSupplierDto supplierDto)
        {
            var supplier = new Supplier
            {
                Name = supplierDto.Name,
                ContactName = supplierDto.ContactName,
                ContactEmail = supplierDto.ContactEmail,
                PhoneNumber = supplierDto.PhoneNumber,
                Address = supplierDto.Address
            };

            var owner = _context.Users.Find(supplierDto.OwnerId);
            if (owner != null)
            {
                supplier.Users = new List<User> { owner };
            }

            _supplierRepository.Add(supplier);
        }

        public void Delete(int id)
        {
            _supplierRepository.Delete(id);
        }

        public List<Supplier> GetAll()
        {
            return _supplierRepository.GetAll();
        }

        public Supplier GetById(int id)
        {
            return _supplierRepository.GetById(id);
        }

        public List<Supplier> GetSuppliersByUserId(int userId)
        {
            return _supplierRepository.GetSuppliersByUserId(userId);
        }

        public void Update(UpdateSupplierDto supplierDto)
        {
            var supplier = _supplierRepository.GetById(supplierDto.SupplierId);
            if (supplier != null)
            {
                supplier.Name = supplierDto.Name;
                supplier.ContactName = supplierDto.ContactName;
                supplier.ContactEmail = supplierDto.ContactEmail;
                supplier.PhoneNumber = supplierDto.PhoneNumber;
                supplier.Address = supplierDto.Address;
                _supplierRepository.Update(supplier);
            }
        }
    }
}
