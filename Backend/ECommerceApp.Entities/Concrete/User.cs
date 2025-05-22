namespace ECommerceApp.Entities.Concrete
{
    public class User
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public int RoleId { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public virtual Role Role { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<UserAddress> UserAddresses { get; set; }
        public virtual ICollection<Supplier> Suppliers { get; set; }
    }
}
