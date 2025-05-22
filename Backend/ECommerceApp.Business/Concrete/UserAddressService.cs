using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.UserAddress;
using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using System.IdentityModel.Tokens.Jwt;

namespace ECommerceApp.Business.Concrete
{
    public class UserAddressService : IUserAddressService
    {
        private readonly IUserAddressRepository _userAddressRepository;

        public UserAddressService(IUserAddressRepository userAddressRepository)
        {
            _userAddressRepository = userAddressRepository;
        }

        public int CreateUserAddress(string token, CreateUserAddressDto createUserAddressDto)
        {
            int userId = GetUserIdFromToken(token);
            var userAddress = new UserAddress
            {
                AddressLine1 = createUserAddressDto.AddressLine1,
                AddressLine2 = createUserAddressDto.AddressLine2 ?? string.Empty,
                City = createUserAddressDto.City,
                Country = createUserAddressDto.Country,
                PostalCode = createUserAddressDto.PostalCode,
                PhoneNumber = createUserAddressDto.PhoneNumber,
                UserId = userId,
                CreatedAt = DateTime.Now,
                IsActive = true
            };

            return _userAddressRepository.Add(userAddress);
        }

        public void UpdateUserAddress(string token, int id, CreateUserAddressDto updateUserAddressDto)
        {
            int userId = GetUserIdFromToken(token);
            var existingAddress = _userAddressRepository.GetById(id) ?? throw new Exception($"User address with ID {id} not found");
            if (existingAddress.UserId != userId)
            {
                throw new Exception("Unauthorized to update this address");
            }
            existingAddress.AddressLine1 = updateUserAddressDto.AddressLine1;
            existingAddress.AddressLine2 = updateUserAddressDto.AddressLine2 ?? string.Empty;
            existingAddress.City = updateUserAddressDto.City;
            existingAddress.Country = updateUserAddressDto.Country;
            existingAddress.PostalCode = updateUserAddressDto.PostalCode;
            existingAddress.PhoneNumber = updateUserAddressDto.PhoneNumber;
            existingAddress.UpdatedAt = DateTime.Now;

            _userAddressRepository.Update(existingAddress);
        }

        public void DeleteUserAddress(string token, int id)
        {
            int userId = GetUserIdFromToken(token);
            var existingAddress = _userAddressRepository.GetById(id) ?? throw new Exception($"User address with ID {id} not found");
            if (existingAddress.UserId != userId)
            {
                throw new Exception("Unauthorized to delete this address");
            }

            _userAddressRepository.Delete(id);
        }

        public UserAddressDto GetUserAddressById(string token, int id)
        {
            int userId = GetUserIdFromToken(token);
            var userAddress = _userAddressRepository.GetById(id) ?? throw new Exception($"User address with ID {id} not found");
            if (userAddress.UserId != userId)
            {
                throw new Exception("Unauthorized to view this address");
            }

            return MapToDto(userAddress);
        }

        public IEnumerable<UserAddressDto> GetUserAddressesByToken(string token)
        {
            int userId = GetUserIdFromToken(token);
            var userAddresses = _userAddressRepository.GetAllByUserId(userId);
            return userAddresses.Select(MapToDto);
        }

        public IEnumerable<UserAddressDto> GetAllUserAddresses(string token)
        {
            // This method could be restricted to admin users only
            // For now, we're just returning all addresses regardless of the token
            var userAddresses = _userAddressRepository.GetAll();
            return userAddresses.Select(MapToDto);
        }

        private UserAddressDto MapToDto(UserAddress userAddress)
        {
            return new UserAddressDto
            {
                UserAddressId = userAddress.UserAddressId,
                AddressLine1 = userAddress.AddressLine1,
                AddressLine2 = userAddress.AddressLine2,
                City = userAddress.City,
                Country = userAddress.Country,
                PostalCode = userAddress.PostalCode,
                PhoneNumber = userAddress.PhoneNumber,
                CreatedAt = userAddress.CreatedAt,
                UpdatedAt = userAddress.UpdatedAt,
            };
        }

        private static int GetUserIdFromToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "nameid") ?? throw new Exception("Invalid token");
            return int.Parse(userIdClaim.Value);
        }
    }
}
