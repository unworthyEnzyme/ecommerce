using ECommerceApp.Business.DTOs.Category;
using ECommerceApp.Business.DTOs.Product;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceApp.Business.Abstract {
    public interface ICategoryService {
        IEnumerable<TopCategoryDto> GetTopCategories();
        IEnumerable<SubCategoryDto> GetSubCategories(int topCategoryId);
        void AddTopCategory(TopCategoryDto topCategoryDto);
        void AddSubCategory(CreateSubCategoryDto createSubCategoryDto);
    }
}
