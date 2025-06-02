using ECommerceApp.Business.DTOs.Favorite;

namespace ECommerceApp.Business.Abstract
{
    public interface IFavoriteService
    {
        IEnumerable<FavoriteDto> GetAll(int userId);
        int Add(int userId, CreateFavoriteDto createFavoriteDto);
        void Delete(int userId, int id);
    }
}
