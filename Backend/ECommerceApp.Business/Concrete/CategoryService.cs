using ECommerceApp.Business.Abstract;
using ECommerceApp.Business.DTOs.Category;
using ECommerceApp.Business.DTOs.Product;
using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceApp.Business.Concrete
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public void AddSubCategory(CreateSubCategoryDto createSubCategoryDto)
        {
            var subCategory = new SubCategory
            {
                Name = createSubCategoryDto.Name,
            };

            _categoryRepository.AddSubCategory(subCategory, createSubCategoryDto.TopCategoryId);
        }

        public void AddTopCategory(TopCategoryDto topCategoryDto)
        {
            _categoryRepository.AddTopCategory(new TopCategory
            {
                Name = topCategoryDto.Name,
            });
        }

        public IEnumerable<SubCategoryDto> GetSubCategories(int topCategoryId)
        {
            return _categoryRepository.GetSubCategoriesByTopCategoryId(topCategoryId)
                .Select(sc => new SubCategoryDto
                {
                    Id = sc.SubCategoryId,
                    Name = sc.Name,
                    TopCategoryId = topCategoryId,
                }).ToList();
        }

        public IEnumerable<TopCategoryDto> GetTopCategories()
        {
            var topCategories = _categoryRepository.GetTopCategories();
            return topCategories.Select(tc => new TopCategoryDto
            {
                Id = tc.TopCategoryId,
                Name = tc.Name,
            }).ToList();
        }
    }
}
