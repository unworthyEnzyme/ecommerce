namespace ECommerceApp.Entities.Concrete
{
    public class Favorite
    {
        public int FavoriteId { get; set; }
        public int UserId { get; set; }
        public int VariantId { get; set; }
        public DateTime CreatedAt { get; set; }

        public virtual User User { get; set; }
        public virtual Variant Variant { get; set; }
    }
}
