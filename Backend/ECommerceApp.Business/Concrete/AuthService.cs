using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Auth;
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
    }
}