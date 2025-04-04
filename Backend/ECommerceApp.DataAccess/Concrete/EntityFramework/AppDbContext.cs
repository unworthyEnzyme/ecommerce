using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApp.DataAccess.Concrete.EntityFramework {
    public class AppDbContext : DbContext {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            optionsBuilder.UseSqlServer("Server=localhost,1433;Database=ECommerceDb;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId);

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
        }
    }
}