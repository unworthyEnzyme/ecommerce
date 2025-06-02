using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Favorite;
using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using ECommerceApp.Business.DTOs.Variant;

namespace ECommerceApp.Business.Concrete
{
    public class FavoriteService : IFavoriteService
    {
        private readonly IFavoriteRepository _favoriteRepository;

        public FavoriteService(IFavoriteRepository favoriteRepository)
        {
            _favoriteRepository = favoriteRepository;
        }
        public IEnumerable<FavoriteDto> GetAll(int userId)
        {
            var favorites = _favoriteRepository.GetByUserId(userId);

            return favorites.Select(f => new FavoriteDto
            {
                Id = f.FavoriteId,
                CreatedAt = f.CreatedAt,
                Variant = new VariantDto
                {
                    Id = f.Variant.VariantId,
                    Name = f.Variant.Product.Name,
                    Price = f.Variant.Price,
                    Images = f.Variant.VariantImages.Select(im => new VariantImageDto
                    {
                        ImageId = im.ImageId,
                        ImageUrl = im.ImageUrl,
                        IsPrimary = im.IsPrimary
                    })
                }

            });
        }
        public int Add(int userId, CreateFavoriteDto createFavoriteDto)
        {
            var favorite = new Favorite
            {
                UserId = userId,
                VariantId = createFavoriteDto.VariantId,
                CreatedAt = DateTime.UtcNow
            };

            return _favoriteRepository.Add(favorite);
        }
        public void Delete(int userId, int id)
        {
            var favorite = _favoriteRepository.GetById(id) ?? throw new Exception("Favorite not found");

            if (favorite.UserId != userId)
                throw new Exception("Unauthorized to delete this favorite"); _favoriteRepository.Delete(id);
        }
    }
}
