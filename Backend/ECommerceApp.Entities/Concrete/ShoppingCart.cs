namespace ECommerceApp.Entities.Concrete
{
  public class ShoppingCart
  {
    public int CartId { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; }

    public virtual User User { get; set; }
    public virtual ICollection<CartItem> CartItems { get; set; }
  }
}
