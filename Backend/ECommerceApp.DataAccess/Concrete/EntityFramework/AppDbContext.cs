using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApp.DataAccess.Concrete.EntityFramework {
    public class AppDbContext : DbContext {        
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

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            optionsBuilder.UseSqlServer("Server=localhost,1433;Database=ECommerceDb;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            // Existing relationships
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

            base.OnModelCreating(modelBuilder);
            
            var defaultDate = new DateTime(2025, 4, 4);
            modelBuilder.Entity<Role>().HasData(
                new Role {
                    RoleId = 1,
                    Name = "Admin",
                    CreatedAt = defaultDate,
                    IsActive = true,
                },
                new Role {
                    RoleId = 2,
                    Name = "User",
                    CreatedAt = defaultDate,
                    IsActive = true,
                });

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

            // Unique constraint for AttributeType name
            modelBuilder.Entity<AttributeType>()
                .HasIndex(at => at.AttributeName)
                .IsUnique();

            // Unique constraint for Product-AttributeType combination
            modelBuilder.Entity<ProductAttributeValue>()
                .HasIndex(pav => new { pav.ProductId, pav.AttributeTypeId })
                .IsUnique();
        }
    }
}