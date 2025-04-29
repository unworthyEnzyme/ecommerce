using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceApp.Business.DTOs.Category
{
    public class CreateSubCategoryDto
    {
        public string Name { get; set; }
        public int TopCategoryId { get; set; }
    }
}
