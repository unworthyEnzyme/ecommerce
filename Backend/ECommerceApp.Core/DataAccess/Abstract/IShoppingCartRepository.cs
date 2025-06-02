using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Core.DataAccess.Abstract
{
  public interface IShoppingCartRepository
  {
    ShoppingCart GetByUserId(int userId);
    ShoppingCart CreateCart(int userId);
    CartItem AddItem(CartItem item);
    void UpdateItemQuantity(int cartItemId, int quantity);
    void RemoveItem(int cartItemId);
    void ClearCart(int cartId);
  }
}
