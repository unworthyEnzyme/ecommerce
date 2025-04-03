using ECommerceApp.Business.DTOs.Auth;

namespace ECommerceApp.Business.Abstract
{
    public interface IAuthService
    {
        string Login(LoginDto loginDto);
        void Register(RegisterDto registerDto);
    }
}