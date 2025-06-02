namespace ECommerceApp.Business.DTOs.UserAddress
{
    public class CreateUserAddressDto
    {
        public required string AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public required string City { get; set; }
        public required string Country { get; set; }
        public required string PostalCode { get; set; }
        public required string PhoneNumber { get; set; }
    }
}
