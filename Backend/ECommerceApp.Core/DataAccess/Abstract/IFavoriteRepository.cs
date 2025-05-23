using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Core.DataAccess.Abstract
{
    public interface IFavoriteRepository
    {
        IEnumerable<Favorite> GetAll();
        IEnumerable<Favorite> GetByUserId(int userId);
        Favorite GetById(int id);
        int Add(Favorite favorite);
        void Update(Favorite favorite);
        void Delete(int id);
    }
}
