using ECommerceApp.Business.Abstract;
using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

namespace ECommerceApp.Worker.Services
{
    public class RabbitMQService : IMessageQueueService, IDisposable
    {
        private readonly IConnection _connection;
        private readonly IChannel _channel;
        private readonly string _queueName = "order_processing";

        public RabbitMQService()
        {
            var factory = new ConnectionFactory()
            {
                HostName = "localhost",
                Port = 5672,
                UserName = "admin",
                Password = "password"
            };

            _connection = factory.CreateConnectionAsync().GetAwaiter().GetResult();
            _channel = _connection.CreateChannelAsync().GetAwaiter().GetResult();

            // Declare the queue
            _channel.QueueDeclareAsync(
                queue: _queueName,
                durable: true,
                exclusive: false,
                autoDelete: false,
                arguments: null).GetAwaiter().GetResult();
        }

        public async Task PublishOrderProcessedAsync(int orderId, string orderData)
        {
            var message = new
            {
                OrderId = orderId,
                Data = orderData,
                Timestamp = DateTime.UtcNow,
                Type = "OrderProcessed"
            };

            var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));

            await _channel.BasicPublishAsync(
                exchange: string.Empty,
                routingKey: _queueName,
                body: body);
        }

        public void Dispose()
        {
            _channel?.Dispose();
            _connection?.Dispose();
        }
    }
}
