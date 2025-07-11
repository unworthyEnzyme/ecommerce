using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApp.DataAccess.Concrete.EntityFramework
{
  public class VariantImageRepository(AppDbContext context) : IVariantImageRepository
  {
    private readonly AppDbContext _context = context;

    public IEnumerable<VariantImage> GetByVariantId(int variantId)
    {
      return _context.VariantImages
          .Where(vi => vi.VariantId == variantId && vi.IsActive)
          .OrderBy(vi => vi.SortOrder)
          .ToList();
    }

    public void Add(VariantImage variantImage)
    {
      _context.VariantImages.Add(variantImage);
      _context.SaveChanges();
    }

    public void Delete(int imageId)
    {
      var image = _context.VariantImages.Find(imageId);
      if (image != null)
      {
        image.IsActive = false;
        image.DeletedAt = DateTime.UtcNow;
        _context.SaveChanges();
      }
    }

    public void Update(VariantImage variantImage)
    {
      variantImage.UpdatedAt = DateTime.UtcNow;
      _context.VariantImages.Update(variantImage);
      _context.SaveChanges();
    }

    public VariantImage? GetById(int imageId)
    {
      return _context.VariantImages
          .Include(vi => vi.Variant)
          .FirstOrDefault(vi => vi.ImageId == imageId && vi.IsActive);
    }
  }
}
