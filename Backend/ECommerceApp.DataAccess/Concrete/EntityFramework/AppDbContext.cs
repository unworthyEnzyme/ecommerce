using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApp.DataAccess.Concrete.EntityFramework
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Operation> Operations { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<TopCategory> TopCategories { get; set; }
        public DbSet<SubCategory> SubCategories { get; set; }
        public DbSet<AttributeType> AttributeTypes { get; set; }
        public DbSet<ProductAttributeValue> ProductAttributeValues { get; set; }
        public DbSet<ProductVariantAttributeType> ProductVariantAttributeTypes { get; set; }
        public DbSet<Variant> Variants { get; set; }
        public DbSet<VariantAttributeValue> VariantAttributeValues { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderStatus> OrderStatuses { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<ShippingAddress> ShippingAddresses { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<PaymentStatus> PaymentStatuses { get; set; }
        public DbSet<VariantImage> VariantImages { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=localhost,1433;Database=ECommerceDb;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User relationships
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId);

            modelBuilder.Entity<Role>()
                .HasMany(r => r.Operations)
                .WithMany(o => o.Roles);

            // Product relationships
            modelBuilder.Entity<Product>()
                .HasOne(p => p.SubCategory)
                .WithMany(sc => sc.Products)
                .HasForeignKey(p => p.SubCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.TopCategory)
                .WithMany(tc => tc.Products)
                .HasForeignKey(p => p.TopCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Many-to-many relationship between TopCategory and SubCategory
            modelBuilder.Entity<TopCategory>()
                .HasMany(tc => tc.SubCategories)
                .WithMany(sc => sc.TopCategories)
                .UsingEntity(j => j.ToTable("CategoryRelations"));

            // Configure primary keys
            modelBuilder.Entity<OrderStatus>()
                .HasKey(os => os.StatusId);

            modelBuilder.Entity<PaymentStatus>()
                .HasKey(ps => ps.PaymentStatusId);

            modelBuilder.Entity<ShippingAddress>()
                .HasKey(sa => sa.ShippingAddressId);

            modelBuilder.Entity<Order>()
                .HasKey(o => o.OrderId);

            modelBuilder.Entity<OrderItem>()
                .HasKey(oi => oi.OrderItemId);

            modelBuilder.Entity<Payment>()
                .HasKey(p => p.PaymentId);

            modelBuilder.Entity<PromotionCode>()
                .HasKey(pc => pc.PromotionCodeId);

            modelBuilder.Entity<VariantImage>()
                .HasKey(vi => vi.ImageId);

            // Order relationships
            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Status)
                .WithMany()
                .HasForeignKey(o => o.StatusId);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.ShippingAddress)
                .WithMany()
                .HasForeignKey(o => o.ShippingAddressId);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.PromotionCode)
                .WithMany()
                .HasForeignKey(o => o.PromotionCodeId);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Variant)
                .WithMany()
                .HasForeignKey(oi => oi.VariantId);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Order)
                .WithMany(o => o.Payments)
                .HasForeignKey(p => p.OrderId);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Status)
                .WithMany()
                .HasForeignKey(p => p.PaymentStatusId);

            // Configure unique constraints
            modelBuilder.Entity<Product>()
                .HasIndex(p => p.ProductCode)
                .IsUnique();

            modelBuilder.Entity<TopCategory>()
                .HasIndex(tc => tc.Name)
                .IsUnique();

            modelBuilder.Entity<SubCategory>()
                .HasIndex(sc => sc.Name)
                .IsUnique();

            modelBuilder.Entity<AttributeType>()
                .HasIndex(at => at.AttributeName)
                .IsUnique();

            modelBuilder.Entity<OrderStatus>()
                .HasIndex(os => os.Name)
                .IsUnique();

            modelBuilder.Entity<PaymentStatus>()
                .HasIndex(ps => ps.Name)
                .IsUnique();

            modelBuilder.Entity<PromotionCode>()
                .HasIndex(pc => pc.Code)
                .IsUnique();

            // Product attribute and variant relationships
            modelBuilder.Entity<ProductAttributeValue>()
                .HasOne(pav => pav.Product)
                .WithMany(p => p.ProductAttributeValues)
                .HasForeignKey(pav => pav.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductAttributeValue>()
                .HasOne(pav => pav.AttributeType)
                .WithMany(at => at.ProductAttributeValues)
                .HasForeignKey(pav => pav.AttributeTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProductVariantAttributeType>()
                .HasOne(pvat => pvat.Product)
                .WithMany(p => p.ProductVariantAttributeTypes)
                .HasForeignKey(pvat => pvat.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductVariantAttributeType>()
                .HasOne(pvat => pvat.AttributeType)
                .WithMany(at => at.ProductVariantAttributeTypes)
                .HasForeignKey(pvat => pvat.AttributeTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Variant>()
                .HasOne(v => v.Product)
                .WithMany(p => p.Variants)
                .HasForeignKey(v => v.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VariantAttributeValue>()
                .HasOne(vav => vav.Variant)
                .WithMany(v => v.VariantAttributeValues)
                .HasForeignKey(vav => vav.VariantId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VariantAttributeValue>()
                .HasOne(vav => vav.AttributeType)
                .WithMany(at => at.VariantAttributeValues)
                .HasForeignKey(vav => vav.AttributeTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<VariantImage>()
                .HasOne(vi => vi.Variant)
                .WithMany(v => v.VariantImages)
                .HasForeignKey(vi => vi.VariantId)
                .OnDelete(DeleteBehavior.Cascade);

            // Seed data
            var defaultDate = new DateTime(2025, 4, 4);
            modelBuilder.Entity<Role>().HasData(
                new Role
                {
                    RoleId = 1,
                    Name = "Admin",
                    CreatedAt = defaultDate,
                    IsActive = true,
                },
                new Role
                {
                    RoleId = 2,
                    Name = "User",
                    CreatedAt = defaultDate,
                    IsActive = true,
                });

            // Seed OrderStatus
            modelBuilder.Entity<OrderStatus>().HasData(
                new OrderStatus { StatusId = 1, Name = "Pending", Description = "Order has been placed", IsActive = true },
                new OrderStatus { StatusId = 2, Name = "Processing", Description = "Order is being processed", IsActive = true },
                new OrderStatus { StatusId = 3, Name = "Shipped", Description = "Order has been shipped", IsActive = true },
                new OrderStatus { StatusId = 4, Name = "Delivered", Description = "Order has been delivered", IsActive = true },
                new OrderStatus { StatusId = 5, Name = "Cancelled", Description = "Order has been cancelled", IsActive = true }
            );

            // Seed PaymentStatus
            modelBuilder.Entity<PaymentStatus>().HasData(
                new PaymentStatus { PaymentStatusId = 1, Name = "Pending", IsActive = true },
                new PaymentStatus { PaymentStatusId = 2, Name = "Completed", IsActive = true },
                new PaymentStatus { PaymentStatusId = 3, Name = "Failed", IsActive = true },
                new PaymentStatus { PaymentStatusId = 4, Name = "Refunded", IsActive = true }
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}
