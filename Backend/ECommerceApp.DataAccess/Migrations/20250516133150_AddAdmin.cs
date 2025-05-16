using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerceApp.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "CreatedAt", "DeletedAt", "Email", "IsActive", "Password", "RoleId", "UpdatedAt" },
                values: new object[] { 2, new DateTime(2025, 4, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "admin@gmail.com", true, "$2y$10$dcgED.SZWILlsRjKxArc.OpzCcmqhh40NraravIPfGXB8k5QV6UNe", 1, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2);
        }
    }
}
