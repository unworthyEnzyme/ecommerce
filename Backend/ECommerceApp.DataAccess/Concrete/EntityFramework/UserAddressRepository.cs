using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.DataAccess.Concrete.EntityFramework
{
    public class UserAddressRepository : IUserAddressRepository
    {
        private readonly AppDbContext _context;

        public UserAddressRepository(AppDbContext context)
        {
            _context = context;
        }

        public int Add(UserAddress userAddress)
        {
            userAddress.CreatedAt = DateTime.UtcNow;
            userAddress.IsActive = true;
            _context.UserAddresses.Add(userAddress);
            _context.SaveChanges();
            return userAddress.UserAddressId;
        }

        public void Delete(int userAddressId)
        {
            var userAddress = _context.UserAddresses.Find(userAddressId);
            if (userAddress != null)
            {
                userAddress.IsActive = false;
                userAddress.DeletedAt = DateTime.UtcNow;
                _context.SaveChanges();
            }
        }

        public IEnumerable<UserAddress> GetAll()
        {
            return _context.UserAddresses
                .Where(ua => ua.IsActive)
                .ToList();
        }

        public IEnumerable<UserAddress> GetAllByUserId(int userId)
        {
            return _context.UserAddresses
                .Where(ua => ua.UserId == userId && ua.IsActive)
                .ToList();
        }

        public UserAddress GetById(int userAddressId)
        {
            return _context.UserAddresses
                .FirstOrDefault(ua => ua.UserAddressId == userAddressId && ua.IsActive);
        }

        public void Update(UserAddress userAddress)
        {
            var existingAddress = _context.UserAddresses.Find(userAddress.UserAddressId);
            if (existingAddress != null)
            {
                existingAddress.AddressLine1 = userAddress.AddressLine1;
                existingAddress.AddressLine2 = userAddress.AddressLine2;
                existingAddress.City = userAddress.City;
                existingAddress.Country = userAddress.Country;
                existingAddress.PostalCode = userAddress.PostalCode;
                existingAddress.PhoneNumber = userAddress.PhoneNumber;
                existingAddress.UpdatedAt = DateTime.UtcNow;
                _context.SaveChanges();
            }
        }
    }
}
