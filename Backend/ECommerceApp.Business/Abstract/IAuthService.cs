using ECommerceApp.Business.DTOs.Auth;
using ECommerceApp.Business.DTOs.Profile;

namespace ECommerceApp.Business.Abstract
{
    public interface IAuthService
    {
        string Login(LoginDto loginDto);
        void Register(RegisterDto registerDto);
        ProfileDto? GetProfile(int userId);
        void UpdateProfile(int userId, UpdateProfileDto profileDto);
        void CompleteOnboarding(string id, CompleteOnboardingDto completeOnboarding);
    }
}
