using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using ECommerceApp.Entities.Concrete;
using ECommerceApp.Worker.Repositories;

namespace ECommerceApp.Worker.Services
{
    public class OrderConsumerHostedService : BackgroundService
    {
        private readonly ILogger<OrderConsumerHostedService> _logger;
        private readonly IStockRepository _stockRepository;
        private readonly IStockMovementRepository _stockMovementRepository;
        private IConnection? _connection;
        private IChannel? _channel;
        private readonly string _queueName = "order_processing";

        public OrderConsumerHostedService(
            ILogger<OrderConsumerHostedService> logger,
            IStockRepository stockRepository,
            IStockMovementRepository stockMovementRepository)
        {
            _logger = logger;
            _stockRepository = stockRepository;
            _stockMovementRepository = stockMovementRepository;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Order Consumer Hosted Service starting...");

            try
            {
                await InitializeRabbitMQ();
                await StartConsuming(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Order Consumer Hosted Service");
            }
        }

        private async Task InitializeRabbitMQ()
        {
            var factory = new ConnectionFactory()
            {
                HostName = "localhost",
                Port = 5672,
                UserName = "admin",
                Password = "password"
            };

            _connection = await factory.CreateConnectionAsync();
            _channel = await _connection.CreateChannelAsync();

            // Declare the queue (should match the publisher)
            await _channel.QueueDeclareAsync(
                queue: _queueName,
                durable: true,
                exclusive: false,
                autoDelete: false,
                arguments: null);

            _logger.LogInformation("RabbitMQ connection established and queue declared");
        }

        private async Task StartConsuming(CancellationToken stoppingToken)
        {
            if (_channel == null)
                throw new InvalidOperationException("Channel not initialized");

            var consumer = new AsyncEventingBasicConsumer(_channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var messageJson = Encoding.UTF8.GetString(body);

                try
                {
                    // Decode the outer message structure
                    var outerMessage = JsonSerializer.Deserialize<OrderMessage>(messageJson);
                    if (outerMessage == null)
                    {
                        _logger.LogWarning("Failed to deserialize outer message");
                        return;
                    }

                    _logger.LogInformation("=== RECEIVED ORDER MESSAGE ===");
                    _logger.LogInformation("Order ID: {OrderId}", outerMessage.OrderId);
                    _logger.LogInformation("Type: {Type}", outerMessage.Type);
                    _logger.LogInformation("Timestamp: {Timestamp}", outerMessage.Timestamp);

                    // Decode the inner order data
                    if (!string.IsNullOrEmpty(outerMessage.Data))
                    {
                        var orderData = JsonSerializer.Deserialize<OrderData>(outerMessage.Data);
                        if (orderData?.Items != null)
                        {
                            _logger.LogInformation("=== ORDER DETAILS ===");
                            _logger.LogInformation("Order ID: {OrderId}", orderData.OrderId);
                            _logger.LogInformation("User ID: {UserId}", orderData.UserId);
                            _logger.LogInformation("Total Amount: ${TotalAmount:F2}", orderData.TotalAmount);
                            _logger.LogInformation("Order Date: {OrderDate}", orderData.OrderDate);

                            _logger.LogInformation("=== ORDER ITEMS ===");
                            foreach (var item in orderData.Items)
                            {
                                _logger.LogInformation("- Variant ID: {VariantId}, Quantity: {Quantity}, Unit Price: ${UnitPrice:F2}",
                                    item.VariantId, item.Quantity, item.UnitPrice);

                                // Create stock movement for the order
                                var stockMovement = new StockMovement
                                {
                                    VariantId = item.VariantId,
                                    Quantity = item.Quantity,
                                    MovementType = "OUT",
                                    Reference = "Order",
                                    Notes = $"Stock reduction from order {orderData.OrderId}",
                                    CreatedAt = DateTime.Now,
                                    IsActive = true
                                };
                                await AddStockMovementAsync(stockMovement);
                            }
                        }
                    }

                    _logger.LogInformation("=============================");

                    // Acknowledge the message
                    if (_channel != null)
                        await _channel.BasicAckAsync(deliveryTag: ea.DeliveryTag, multiple: false);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing message: {Message}", messageJson);

                    // Reject the message and don't requeue it
                    if (_channel != null)
                        await _channel.BasicNackAsync(deliveryTag: ea.DeliveryTag, multiple: false, requeue: false);
                }
            };

            await _channel.BasicConsumeAsync(
                queue: _queueName,
                autoAck: false,
                consumer: consumer);

            _logger.LogInformation("Order consumer started and listening for messages...");

            // Keep the service running until cancellation is requested
            try
            {
                await Task.Delay(Timeout.Infinite, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Order consumer service is stopping...");
            }
        }

        public async Task AddStockMovementAsync(StockMovement movement)
        {
            await _stockMovementRepository.AddStockMovementAsync(movement);

            var stock = await GetOrCreateStockAsync(movement.VariantId);
            stock.Quantity += movement.MovementType == "IN" ? movement.Quantity : -movement.Quantity;
            stock.LastUpdated = DateTime.UtcNow;

            await _stockRepository.UpdateStockAsync(stock);
        }

        private async Task<Stock> GetOrCreateStockAsync(int variantId)
        {
            var stock = await _stockRepository.GetStockByVariantIdAsync(variantId);
            if (stock == null)
            {
                stock = new Stock
                {
                    VariantId = variantId,
                    Quantity = 0,
                    CreatedAt = DateTime.UtcNow,
                    LastUpdated = DateTime.UtcNow,
                    IsActive = true
                };
                stock = await _stockRepository.CreateStockAsync(stock);
            }
            return stock;
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Order Consumer Hosted Service stopping...");

            _channel?.Dispose();
            _connection?.Dispose();

            await base.StopAsync(cancellationToken);
        }

        public override void Dispose()
        {
            _channel?.Dispose();
            _connection?.Dispose();
            base.Dispose();
        }
    }

    // Data models for deserializing messages
    public class OrderMessage
    {
        public int OrderId { get; set; }
        public string Data { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string Type { get; set; } = string.Empty;
    }

    public class OrderData
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public OrderItemData[] Items { get; set; } = Array.Empty<OrderItemData>();
        public decimal TotalAmount { get; set; }
        public DateTime OrderDate { get; set; }
    }

    public class OrderItemData
    {
        public int VariantId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
