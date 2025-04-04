namespace ECommerceApp.Entities.Concrete
{
    public class Operation
    {
        public int OperationId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public bool IsActive { get; set; }
        public virtual ICollection<Role> Roles { get; set; }
    }
}