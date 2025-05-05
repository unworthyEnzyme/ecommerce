using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Core.DataAccess.Abstract
{
  public interface IVariantImageRepository
  {
    IEnumerable<VariantImage> GetByVariantId(int variantId);
    void Add(VariantImage variantImage);
    void Delete(int imageId);
    void Update(VariantImage variantImage);
    VariantImage? GetById(int imageId);
  }
}
