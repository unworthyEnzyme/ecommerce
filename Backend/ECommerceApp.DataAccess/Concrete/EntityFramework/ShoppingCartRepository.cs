using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApp.DataAccess.Concrete.EntityFramework
{
  public class ShoppingCartRepository : IShoppingCartRepository
  {
    private readonly AppDbContext _context;

    public ShoppingCartRepository(AppDbContext context)
    {
      _context = context;
    }

    public ShoppingCart GetByUserId(int userId)
    {
      return _context.ShoppingCarts
          .Include(c => c.CartItems.Where(ci => ci.IsActive))
            .ThenInclude(ci => ci.Variant)
            .ThenInclude(v => v.VariantAttributeValues)
            .ThenInclude(vav => vav.AttributeType)
          .Include(c => c.CartItems.Where(ci => ci.IsActive))
            .ThenInclude(ci => ci.Variant)
            .ThenInclude(v => v.Product)
          .Include(c => c.CartItems.Where(ci => ci.IsActive))
            .ThenInclude(ci => ci.Variant)
            .ThenInclude(v => v.StockMovements)
          .FirstOrDefault(c => c.UserId == userId && c.IsActive);
    }

    public ShoppingCart CreateCart(int userId)
    {
      var cart = new ShoppingCart
      {
        UserId = userId,
        CreatedAt = DateTime.UtcNow,
        IsActive = true
      };

      _context.ShoppingCarts.Add(cart);
      _context.SaveChanges();
      return cart;
    }

    public CartItem AddItem(CartItem item)
    {
      var existingItem = _context.CartItems
          .FirstOrDefault(ci => ci.CartId == item.CartId &&
                              ci.VariantId == item.VariantId &&
                              ci.IsActive);

      if (existingItem != null)
      {
        existingItem.Quantity += item.Quantity;
        existingItem.UpdatedAt = DateTime.UtcNow;
        _context.CartItems.Update(existingItem);
      }
      else
      {
        item.CreatedAt = DateTime.UtcNow;
        item.IsActive = true;
        _context.CartItems.Add(item);
      }

      _context.SaveChanges();
      return existingItem ?? item;
    }

    public void UpdateItemQuantity(int cartItemId, int quantity)
    {
      var item = _context.CartItems.Find(cartItemId);
      if (item != null)
      {
        item.Quantity = quantity;
        item.UpdatedAt = DateTime.UtcNow;
        _context.SaveChanges();
      }
    }

    public void RemoveItem(int cartItemId)
    {
      var item = _context.CartItems.Find(cartItemId);
      if (item != null)
      {
        item.IsActive = false;
        item.UpdatedAt = DateTime.UtcNow;
        _context.SaveChanges();
      }
    }

    public void ClearCart(int cartId)
    {
      var items = _context.CartItems.Where(ci => ci.CartId == cartId && ci.IsActive);
      foreach (var item in items)
      {
        item.IsActive = false;
        item.UpdatedAt = DateTime.UtcNow;
      }
      _context.SaveChanges();
    }
  }
}
