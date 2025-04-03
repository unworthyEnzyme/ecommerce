using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Core.DataAccess.Abstract
{
    public interface IUserRepository
    {
        User GetByEmail(string email);
        void Add(User user);
        void Update(User user);
        bool EmailExists(string email);
    }
}