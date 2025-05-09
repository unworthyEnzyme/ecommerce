using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceApp.Business.DTOs.Favorite
{
    public class FavoriteDto
    {
        public int FavoriteId { get; set; }
        public int VariantId { get; set; }
        public decimal Price { get; set; }
        public string ProductName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
