namespace ECommerceApp.Entities.Concrete
{
    public class RoleOperation
    {
        public int RoleId { get; set; }
        public int OperationId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public bool IsActive { get; set; }
        public virtual Role Role { get; set; }
        public virtual Operation Operation { get; set; }
    }
}