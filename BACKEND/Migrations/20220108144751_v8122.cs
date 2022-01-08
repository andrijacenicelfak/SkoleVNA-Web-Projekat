using Microsoft.EntityFrameworkCore.Migrations;

namespace SkolaVanNastavnihAktivnosti.Migrations
{
    public partial class v8122 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Iskustvo",
                table: "Nastavnik");

            migrationBuilder.AlterColumn<string>(
                name: "BrojTelefonaRoditelja",
                table: "Ucenik",
                type: "nvarchar(13)",
                maxLength: 13,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(30)",
                oldMaxLength: 30);

            migrationBuilder.AddColumn<float>(
                name: "Ocena",
                table: "Nastavnik",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ocena",
                table: "Nastavnik");

            migrationBuilder.AlterColumn<string>(
                name: "BrojTelefonaRoditelja",
                table: "Ucenik",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(13)",
                oldMaxLength: 13);

            migrationBuilder.AddColumn<int>(
                name: "Iskustvo",
                table: "Nastavnik",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
