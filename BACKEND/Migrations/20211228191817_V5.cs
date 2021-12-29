using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SkolaVanNastavnihAktivnosti.Migrations
{
    public partial class V5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "PoslednjePlacanje",
                table: "Pohadja",
                type: "datetime2",
                maxLength: 30,
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PoslednjePlacanje",
                table: "Pohadja");
        }
    }
}
