using System;
using System.ComponentModel.DataAnnotations;

namespace ECommerceApp.Entities.Concrete
{
  public class OrderStatus
  {
    public int StatusId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public bool IsActive { get; set; }
  }
}
