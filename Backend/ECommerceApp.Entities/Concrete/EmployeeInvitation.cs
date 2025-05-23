namespace ECommerceApp.Entities.Concrete {
    public class EmployeeInvitation {
        public int EmployeeInvitationId { get; set; }
        public required string UUID { get; set; }
        public required string Email { get; set; }
        public required int SupplierId { get; set; }
        public virtual Supplier? Supplier { get; set; }
    }
}
