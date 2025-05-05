using ECommerceApp.Business.DTOs.Cart;

namespace ECommerceApp.Business.Abstract
{
  public interface IShoppingCartService
  {
    CartDto GetCart(string token);
    CartDto AddToCart(AddToCartDto addToCartDto, string token);
    void UpdateQuantity(int cartItemId, int quantity, string token);
    void RemoveItem(int cartItemId, string token);
    void ClearCart(string token);
  }
}
