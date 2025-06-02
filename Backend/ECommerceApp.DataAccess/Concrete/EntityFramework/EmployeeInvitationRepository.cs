using ECommerceApp.Core.DataAccess.Abstract;
using ECommerceApp.Entities.Concrete;
using Microsoft.EntityFrameworkCore;

namespace ECommerceApp.DataAccess.Concrete.EntityFramework
{
    public class EmployeeInvitationRepository : IEmployeeInvitationRepository
    {
        private readonly AppDbContext _context;
        public EmployeeInvitationRepository(AppDbContext context)
        {
            _context = context;
        }

        public int Add(EmployeeInvitation invitation) {
            _context.EmployeeInvitations.Add(invitation);
            _context.SaveChanges();
            return invitation.EmployeeInvitationId;
        }

        public void Delete(EmployeeInvitation invitation)
        {
            _context.EmployeeInvitations.Remove(invitation);
        }

        public EmployeeInvitation? GetByUUID(string id)
        {
            return _context.EmployeeInvitations
                .Include(e => e.Supplier)
                .Where(e => e.UUID.Equals(id))
                .FirstOrDefault();
        }
    }
}
