namespace ECommerceApp.Business.DTOs.Supplier
{
  public class CreateSupplierDto
  {
    public string Name { get; set; }
    public string ContactName { get; set; }
    public string ContactEmail { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public int OwnerId { get; set; }
  }
}
