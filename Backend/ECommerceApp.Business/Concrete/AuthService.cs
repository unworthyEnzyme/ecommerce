using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Auth;
using ECommerceApp.Business.DTOs.Profile;
using ECommerceApp.Business.DTOs.UserAddress;
using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using Microsoft.IdentityModel.Tokens;

namespace ECommerceApp.Business.Concrete
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private const string SecretKey = "your-very-long-secret-key-here-min-16-characters";

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public string Login(LoginDto loginDto)
        {
            var user = _userRepository.GetByEmail(loginDto.Email);
            if (user == null)
                throw new Exception("User not found");

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
                throw new Exception("Invalid password");

            return GenerateJwtToken(user);
        }

        public void Register(RegisterDto registerDto)
        {
            if (_userRepository.EmailExists(registerDto.Email))
                throw new Exception("Email already exists");

            if (registerDto.Password != registerDto.ConfirmPassword)
                throw new Exception("Passwords do not match");

            var user = new User
            {
                Email = registerDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                RoleId = 2, // Default user role
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _userRepository.Add(user);
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(SecretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role?.Name ?? "User")
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        public ProfileDto? GetProfile(string token)
        {
            if (string.IsNullOrEmpty(token))
                throw new UnauthorizedAccessException("No token provided");

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken ?? throw new UnauthorizedAccessException("Invalid token");
            var userIdClaim = jsonToken.Claims.FirstOrDefault(c => c.Type == "nameid");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                throw new UnauthorizedAccessException("Invalid user ID in token");

            var user = _userRepository.GetById(userId);
            if (user == null)
                return null;

            var addresses = user.UserAddresses?
                .Where(a => a.IsActive)
                .Select(a => new UserAddressDto
                {
                    UserAddressId = a.UserAddressId,
                    AddressLine1 = a.AddressLine1,
                    AddressLine2 = a.AddressLine2,
                    City = a.City,
                    Country = a.Country,
                    PostalCode = a.PostalCode,
                    PhoneNumber = a.PhoneNumber,
                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt
                })
                .ToList() ?? [];

            return new ProfileDto
            {
                Id = user.UserId,
                Email = user.Email,
                FirstName = user.FirstName ?? string.Empty,
                LastName = user.LastName ?? string.Empty,
                PhoneNumber = user.PhoneNumber ?? string.Empty,
                Addresses = addresses
            };
        }
    }
}
