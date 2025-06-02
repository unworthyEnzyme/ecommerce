using ECommerceApp.Business.DTOs.Variant;

namespace ECommerceApp.Business.DTOs.Favorite
{
    public class FavoriteDto
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public VariantDto Variant { get; set; }
    }
}
