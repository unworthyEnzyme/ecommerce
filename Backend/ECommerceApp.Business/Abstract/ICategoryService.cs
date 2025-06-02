using ECommerceApp.Business.DTOs.Category;
using ECommerceApp.Business.DTOs.Product;

namespace ECommerceApp.Business.Abstract
{
    public interface ICategoryService
    {
        IEnumerable<TopCategoryDto> GetTopCategories();
        IEnumerable<SubCategoryDto> GetSubCategories(int topCategoryId);
        void AddTopCategory(TopCategoryDto topCategoryDto);
        void AddSubCategory(CreateSubCategoryDto createSubCategoryDto);
    }
}
