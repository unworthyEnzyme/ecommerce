using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApp.DataAccess.Concrete.EntityFramework
{
    public class FavoriteRepository : IFavoriteRepository
    {
        private readonly AppDbContext _context;

        public FavoriteRepository(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Favorite> GetAll()
        {
            return _context.Favorites
                .Include(f => f.Variant)
                    .ThenInclude(v => v.Product)
                .Include(f => f.Variant)
                    .ThenInclude(v => v.VariantImages)
                .ToList();
        }

        public IEnumerable<Favorite> GetByUserId(int userId)
        {
            return _context.Favorites
                .Include(f => f.Variant)
                    .ThenInclude(v => v.Product)
                .Include(f => f.Variant)
                    .ThenInclude(v => v.VariantImages)
                .Where(f => f.UserId == userId)
                .ToList();
        }

        public Favorite GetById(int id)
        {
            return _context.Favorites
                .Include(f => f.Variant)
                    .ThenInclude(v => v.Product)
                .FirstOrDefault(f => f.FavoriteId == id);
        }

        public int Add(Favorite favorite)
        {
            _context.Favorites.Add(favorite);
            _context.SaveChanges();
            return favorite.FavoriteId;
        }

        public void Update(Favorite favorite)
        {
            _context.Favorites.Update(favorite);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var favorite = _context.Favorites.Find(id);
            if (favorite != null)
            {
                _context.Favorites.Remove(favorite);
                _context.SaveChanges();
            }
        }
    }
}
