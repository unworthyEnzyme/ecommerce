using ECommerceApp.Entities.Concrete;

namespace ECommerceApp.Core.DataAccess.Abstract
{
    public interface IEmployeeInvitationRepository
    {
        EmployeeInvitation? GetByUUID(string id);
        void Delete(EmployeeInvitation invitation);
        int Add(EmployeeInvitation invitation);
    }
}
