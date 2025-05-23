using ECommerceApp.Business.DTOs.Auth;
using ECommerceApp.Business.DTOs.Profile;

namespace ECommerceApp.Business.Abstract
{
    public interface IAuthService
    {
        string Login(LoginDto loginDto);
        void Register(RegisterDto registerDto);
        ProfileDto? GetProfile(string token);
        void UpdateProfile(string token, UpdateProfileDto profileDto);
        void CompleteOnboarding(string id, CompleteOnboardingDto completeOnboarding);
    }
}
