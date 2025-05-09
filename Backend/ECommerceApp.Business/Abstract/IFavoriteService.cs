using ECommerceApp.Business.DTOs.Favorite;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceApp.Business.Abstract
{
    public interface IFavoriteService
    {
        IEnumerable<FavoriteDto> GetAll(string token);
        int Add(string token, CreateFavoriteDto createFavoriteDto);
        void Delete(string token, int id);
    }
}
