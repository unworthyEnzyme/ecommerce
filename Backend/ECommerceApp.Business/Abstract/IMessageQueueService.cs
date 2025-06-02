using ECommerceApp.Business.DTOs.Order;

namespace ECommerceApp.Business.Abstract
{
    public interface IMessageQueueService
    {
        Task PublishOrderProcessedAsync(int orderId, string orderData);
    }
}
