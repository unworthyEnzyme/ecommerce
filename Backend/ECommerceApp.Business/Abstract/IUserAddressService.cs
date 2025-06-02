using ECommerceApp.Business.DTOs.UserAddress;

namespace ECommerceApp.Business.Abstract
{
    public interface IUserAddressService
    {
        int CreateUserAddress(int userId, CreateUserAddressDto createUserAddressDto);
        void UpdateUserAddress(int userId, int id, CreateUserAddressDto updateUserAddressDto);
        void DeleteUserAddress(int userId, int id);
        UserAddressDto GetUserAddressById(int userId, int id);
        IEnumerable<UserAddressDto> GetUserAddressesByUserId(int userId);
        IEnumerable<UserAddressDto> GetAllUserAddresses();
    }
}
