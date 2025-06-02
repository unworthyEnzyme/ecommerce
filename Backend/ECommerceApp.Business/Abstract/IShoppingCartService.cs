using ECommerceApp.Business.DTOs.Cart;

namespace ECommerceApp.Business.Abstract
{
  public interface IShoppingCartService
  {
    CartDto GetCart(int userId);
    CartDto AddToCart(AddToCartDto addToCartDto, int userId);
    void UpdateQuantity(int cartItemId, int quantity, int userId);
    void RemoveItem(int cartItemId, int userId);
    void ClearCart(int userId);
  }
}
