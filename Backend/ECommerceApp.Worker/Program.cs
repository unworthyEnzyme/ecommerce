using ECommerceApp.DataAccess.Concrete.EntityFramework;
using ECommerceApp.Worker.Repositories;
using ECommerceApp.Worker.Services;
using Microsoft.EntityFrameworkCore;

var builder = Host.CreateApplicationBuilder(args);

// Register DbContext with connection string
builder.Services.AddDbContext<AppDbContext>();

// Register repositories as singleton (they handle their own scoping)
builder.Services.AddSingleton<IStockRepository, ECommerceApp.Worker.Repositories.StockRepository>();
builder.Services.AddSingleton<IStockMovementRepository, StockMovementRepository>();

// Register the hosted service
builder.Services.AddHostedService<OrderConsumerHostedService>();

var host = builder.Build();

// Ensure database is created and migrated
using (var scope = host.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

host.Run();
