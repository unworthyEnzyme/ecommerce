using System.IdentityModel.Tokens.Jwt;
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

        public IEnumerable<FavoriteDto> GetAll(string token)
        {
            var userId = GetUserIdFromToken(token);
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

        public int Add(string token, CreateFavoriteDto createFavoriteDto)
        {
            var userId = GetUserIdFromToken(token);

            var favorite = new Favorite
            {
                UserId = userId,
                VariantId = createFavoriteDto.VariantId,
                CreatedAt = DateTime.UtcNow
            };

            return _favoriteRepository.Add(favorite);
        }

        public void Delete(string token, int id)
        {
            var userId = GetUserIdFromToken(token);
            var favorite = _favoriteRepository.GetById(id);

            if (favorite == null)
                throw new Exception("Favorite not found");

            if (favorite.UserId != userId)
                throw new Exception("Unauthorized to delete this favorite");

            _favoriteRepository.Delete(id);
        }

        private int GetUserIdFromToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "nameid");

            if (userIdClaim == null)
                throw new Exception("Invalid token");

            return int.Parse(userIdClaim.Value);
        }
    }
}
