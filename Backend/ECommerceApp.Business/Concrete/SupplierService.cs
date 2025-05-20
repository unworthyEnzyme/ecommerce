using System.IdentityModel.Tokens.Jwt;
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

        public int Create(string token, CreateSupplierDto supplierDto)
        {
            var supplier = new Supplier
            {
                Name = supplierDto.Name,
                ContactName = supplierDto.ContactName,
                ContactEmail = supplierDto.ContactEmail,
                PhoneNumber = supplierDto.PhoneNumber,
                Address = supplierDto.Address
            };

            var ownerId = GetUserIdFromToken(token);
            var owner = _context.Users.FirstOrDefault(u => u.UserId == ownerId);
            if (owner != null)
            {
                supplier.Users = [owner];
            }

            return _supplierRepository.Add(supplier);
        }

        public void Delete(int id)
        {
            _supplierRepository.Delete(id);
        }

        public List<SupplierDto> GetAll()
        {
            return _supplierRepository.GetAll().Select(s => new SupplierDto
            {
                Id = s.SupplierId,
                Name = s.Name,
                ContactName = s.ContactName,
                ContactEmail = s.ContactEmail,
                PhoneNumber = s.PhoneNumber,
                Address = s.Address
            }).ToList();
        }

        public SupplierDto GetById(int id)
        {
            var supplier = _supplierRepository.GetById(id);
            if (supplier == null)
                return null;

            return new SupplierDto
            {
                Id = supplier.SupplierId,
                Name = supplier.Name,
                ContactName = supplier.ContactName,
                ContactEmail = supplier.ContactEmail,
                PhoneNumber = supplier.PhoneNumber,
                Address = supplier.Address
            };
        }

        public List<SupplierDto> GetSuppliersByUserId(int userId)
        {
            return _supplierRepository.GetSuppliersByUserId(userId).Select(s => new SupplierDto
            {
                Id = s.SupplierId,
                Name = s.Name,
                ContactName = s.ContactName,
                ContactEmail = s.ContactEmail,
                PhoneNumber = s.PhoneNumber,
                Address = s.Address
            }).ToList();
        }

        public SupplierStatistics GetSupplierStatistics(int supplierId)
        {
            throw new NotImplementedException();
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

        private int GetUserIdFromToken(string token)
        {
            if (string.IsNullOrEmpty(token))
                throw new UnauthorizedAccessException("No token provided");

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

            if (jsonToken == null)
                throw new UnauthorizedAccessException("Invalid token");

            var userIdClaim = jsonToken.Claims.FirstOrDefault(c => c.Type == "nameid");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                throw new UnauthorizedAccessException("Invalid user ID in token");

            return userId;
        }
    }
}
