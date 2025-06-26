using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApp.DataAccess.Concrete.EntityFramework
{
    public class UserRepository(AppDbContext context) : IUserRepository
    {
        private readonly AppDbContext _context = context;

        public User? GetByEmail(string email)
        {
            return _context.Users
                .Include(u => u.Role)
                .FirstOrDefault(u => u.Email == email && u.IsActive);
        }

        public void Add(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public void Update(User user)
        {
            user.UpdatedAt = DateTime.UtcNow;
            _context.Users.Update(user);
            _context.SaveChanges();
        }
        public bool EmailExists(string email)
        {
            return _context.Users.Any(u => u.Email == email && u.IsActive);
        }

        public User? GetById(int userId)
        {
            return _context.Users
                .Include(u => u.Role)
                .Include(u => u.UserAddresses.Where(a => a.IsActive))
                .FirstOrDefault(u => u.UserId == userId && u.IsActive);
        }

        public IEnumerable<User> GetAll()
        {
            return _context.Users
                .Include(u => u.Role)
                .Include(u => u.UserAddresses.Where(a => a.IsActive))
                .Where(u => u.IsActive)
                .ToList();
        }
    }
}
