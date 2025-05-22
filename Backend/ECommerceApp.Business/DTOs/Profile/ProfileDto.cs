using ECommerceApp.Business.DTOs.UserAddress;

namespace ECommerceApp.Business.DTOs.Profile {
    public class ProfileDto {
        public int Id { get; set; }
        public required string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public required IEnumerable<UserAddressDto> Addresses { get; set; }
    }
}
