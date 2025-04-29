using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceApp.DataAccess.Concrete.EntityFramework
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly AppDbContext _context;

        public CategoryRepository(AppDbContext context)
        {
            _context = context;
        }

        public void AddSubCategory(SubCategory subCategory, int topCategoryId)
        {
            var topCategory = _context.TopCategories
                .Include(tc => tc.SubCategories)
                .FirstOrDefault(tc => tc.TopCategoryId == topCategoryId);
            if (topCategory != null)
            {
                _context.Add(subCategory);
                topCategory.SubCategories.Add(subCategory);
                _context.SaveChanges();
            }
            else
            {
                throw new Exception("Top category not found");
            }
        }

        public void AddTopCategory(TopCategory topCategory)
        {
            _context.TopCategories.Add(topCategory);
            _context.SaveChanges();
        }

        public void DeleteSubCategory(int id)
        {
            _context.SubCategories.Remove(new SubCategory { SubCategoryId = id });
        }

        public void DeleteTopCategory(int id)
        {
            _context.TopCategories.Remove(new TopCategory { TopCategoryId = id });
        }

        public IEnumerable<SubCategory> GetSubCategoriesByTopCategoryId(int topCategoryId)
        {
            return _context.TopCategories
                .Where(tc => tc.TopCategoryId == topCategoryId)
                .SelectMany(tc => tc.SubCategories)
                .ToList();
        }

        public SubCategory GetSubCategoryById(int id)
        {
            return _context.SubCategories
                .FirstOrDefault(sc => sc.SubCategoryId == id);
        }

        public IEnumerable<TopCategory> GetTopCategories()
        {
            return _context.TopCategories
                .ToList();
        }

        public TopCategory GetTopCategoryById(int id)
        {
            return _context.TopCategories
                .Include(tc => tc.SubCategories)
                .FirstOrDefault(tc => tc.TopCategoryId == id);
        }

        public void UpdateSubCategory(SubCategory subCategory)
        {
            _context.SubCategories.Update(subCategory);
        }

        public void UpdateTopCategory(TopCategory topCategory)
        {
            _context.TopCategories.Update(topCategory);
        }
    }
}
