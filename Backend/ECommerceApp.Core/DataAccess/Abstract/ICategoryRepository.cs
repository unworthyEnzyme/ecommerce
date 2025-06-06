﻿using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Core.DataAccess.Abstract
{
    public interface ICategoryRepository
    {
        IEnumerable<TopCategory> GetTopCategories();
        TopCategory GetTopCategoryById(int id);
        IEnumerable<SubCategory> GetSubCategoriesByTopCategoryId(int topCategoryId);
        SubCategory GetSubCategoryById(int id);
        void AddTopCategory(TopCategory topCategory);
        void UpdateTopCategory(TopCategory topCategory);
        void DeleteTopCategory(int id);
        void AddSubCategory(SubCategory subCategory, int topCategoryId);
        void UpdateSubCategory(SubCategory subCategory);
        void DeleteSubCategory(int id);
    }
}
