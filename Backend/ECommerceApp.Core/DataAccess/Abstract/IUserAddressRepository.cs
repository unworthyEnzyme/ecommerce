using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Core.DataAccess.Abstract
{
    public interface IUserAddressRepository
    {
        int Add(UserAddress userAddress);
        void Update(UserAddress userAddress);
        void Delete(int userAddressId);
        UserAddress GetById(int userAddressId);
        IEnumerable<UserAddress> GetAllByUserId(int userId);
        IEnumerable<UserAddress> GetAll();
    }
}
