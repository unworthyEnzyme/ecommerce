using ECommerceApp.Business.DTOs.UserAddress;

namespace ECommerceApp.Business.Abstract
{
    public interface IUserAddressService
    {
        int CreateUserAddress(string token, CreateUserAddressDto createUserAddressDto);
        void UpdateUserAddress(string token, int id, CreateUserAddressDto updateUserAddressDto);
        void DeleteUserAddress(string token, int id);
        UserAddressDto GetUserAddressById(string token, int id);
        IEnumerable<UserAddressDto> GetUserAddressesByToken(string token);
        IEnumerable<UserAddressDto> GetAllUserAddresses(string token);
    }
}
