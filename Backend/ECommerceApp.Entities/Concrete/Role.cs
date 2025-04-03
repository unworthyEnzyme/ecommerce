namespace ECommerceApp.Entities.Concrete
{
    public class Role
    {
        public int RoleId { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public bool IsActive { get; set; }
        public virtual ICollection<User> Users { get; set; }
    }
}