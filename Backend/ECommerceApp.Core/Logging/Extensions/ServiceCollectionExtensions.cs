using ECommerceApp.Core.Logging.Abstract;
using ECommerceApp.Core.Logging.Concrete;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerceApp.Core.Logging.Extensions;

public static class ServiceCollectionExtensions
{
  /// <summary>
  /// Adds console logging to the service collection
  /// </summary>
  /// <param name="services">The service collection</param>
  /// <param name="minimumLogLevel">The minimum log level to output</param>
  /// <returns>The service collection for chaining</returns>
  public static IServiceCollection AddConsoleLogging(this IServiceCollection services, LogLevel minimumLogLevel = LogLevel.Information)
  {
    services.AddSingleton<ILoggerFactory>(provider => new ConsoleLoggerFactory(minimumLogLevel));

    // Register a factory method for ILogger that uses the calling type as category
    services.AddTransient<ILogger>(provider =>
    {
      var factory = provider.GetRequiredService<ILoggerFactory>();
      return factory.CreateLogger("Default");
    });

    return services;
  }

  /// <summary>
  /// Adds a custom logger factory to the service collection
  /// </summary>
  /// <param name="services">The service collection</param>
  /// <param name="loggerFactory">The logger factory instance</param>
  /// <returns>The service collection for chaining</returns>
  public static IServiceCollection AddCustomLogging(this IServiceCollection services, ILoggerFactory loggerFactory)
  {
    services.AddSingleton(loggerFactory);

    services.AddTransient<ILogger>(provider =>
    {
      var factory = provider.GetRequiredService<ILoggerFactory>();
      return factory.CreateLogger("Default");
    });

    return services;
  }
}
