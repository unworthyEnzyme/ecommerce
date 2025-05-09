using ECommerceApp.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceApp.Core.DataAccess.Abstract {
    public interface IFavoriteRepository {
        IEnumerable<Favorite> GetAll();
        IEnumerable<Favorite> GetByUserId(int userId);
        Favorite GetById(int id);
        int Add(Favorite favorite);
        void Update(Favorite favorite);
        void Delete(int id);
    }
}
