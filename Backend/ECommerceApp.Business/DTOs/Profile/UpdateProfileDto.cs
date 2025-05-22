using ECommerceApp.Business.DTOs.UserAddress;

namespace ECommerceApp.Business.DTOs.Profile
{
  public class UpdateProfileDto
  {
    public required string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PhoneNumber { get; set; }
  }
}
