using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Cart;
using ECommerceApp.Business.DTOs.Variant;
using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Business.Concrete
{
  public class ShoppingCartService : IShoppingCartService
  {
    private readonly IShoppingCartRepository _cartRepository;
    private readonly IVariantRepository _variantRepository;

    public ShoppingCartService(IShoppingCartRepository cartRepository, IVariantRepository variantRepository)
    {
      _cartRepository = cartRepository;
      _variantRepository = variantRepository;
    }

    public CartDto GetCart(int userId)
    {
      var cart = _cartRepository.GetByUserId(userId);

      if (cart == null)
      {
        cart = _cartRepository.CreateCart(userId);
        return new CartDto { CartId = cart.CartId, Items = new List<CartItemDto>(), TotalAmount = 0 };
      }

      return MapCartToDto(cart);
    }

    public CartDto AddToCart(AddToCartDto addToCartDto, int userId)
    {
      var cart = _cartRepository.GetByUserId(userId) ?? _cartRepository.CreateCart(userId);

      var cartItem = new CartItem
      {
        CartId = cart.CartId,
        VariantId = addToCartDto.VariantId,
        Quantity = addToCartDto.Quantity
      };

      _cartRepository.AddItem(cartItem);
      return GetCart(userId);
    }

    public void UpdateQuantity(int cartItemId, int quantity, int userId)
    {
      var cart = _cartRepository.GetByUserId(userId);
      if (cart == null)
        throw new Exception("Cart not found");

      var cartItem = cart.CartItems.FirstOrDefault(ci => ci.CartItemId == cartItemId);
      if (cartItem == null)
        throw new Exception("Cart item not found");

      if (quantity <= 0)
        _cartRepository.RemoveItem(cartItemId);
      else
        _cartRepository.UpdateItemQuantity(cartItemId, quantity);
    }

    public void RemoveItem(int cartItemId, int userId)
    {
      var cart = _cartRepository.GetByUserId(userId);
      if (cart == null)
        throw new Exception("Cart not found");

      var cartItem = cart.CartItems.FirstOrDefault(ci => ci.CartItemId == cartItemId);
      if (cartItem == null)
        throw new Exception("Cart item not found");

      _cartRepository.RemoveItem(cartItemId);
    }

    public void ClearCart(int userId)
    {
      var cart = _cartRepository.GetByUserId(userId);
      if (cart == null)
        throw new Exception("Cart not found");

      _cartRepository.ClearCart(cart.CartId);
    }

    private static CartDto MapCartToDto(ShoppingCart cart)
    {
      var items = cart.CartItems.Select(ci => new CartItemDto
      {
        CartItemId = ci.CartItemId,
        Quantity = ci.Quantity,
        Variant = new VariantDto
        {
          Id = ci.Variant.VariantId,
          Name = ci.Variant.Product.Name,
          Price = ci.Variant.Price,
          Stock = ci.Variant.StockMovements.Sum(m => m.MovementType == "IN" ? m.Quantity : -m.Quantity),
          Attributes = ci.Variant.VariantAttributeValues.Select(vav => new VariantAttributeDto
          {
            AttributeName = vav.AttributeType.AttributeName,
            AttributeValue = vav.AttributeValue,
          }).ToList(),
        },
        SubTotal = ci.Quantity * ci.Variant.Price
      }).ToList();

      return new CartDto
      {
        CartId = cart.CartId,
        Items = items,
        TotalAmount = items.Sum(i => i.SubTotal)
      };
    }
  }
}
