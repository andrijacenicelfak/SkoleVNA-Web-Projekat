using Microsoft.EntityFrameworkCore.Migrations;

namespace SkolaVanNastavnihAktivnosti.Migrations
{
    public partial class V4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Nastavnik",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Iskustvo = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nastavnik", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Skola",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Tip = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Skola", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Ucenik",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    BrojTelefonaRoditelja = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    ImeRoditelja = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ucenik", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Aktivnost",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Cena = table.Column<int>(type: "int", nullable: false),
                    SkolaID = table.Column<int>(type: "int", nullable: false),
                    BrojDanaUNedelji = table.Column<int>(type: "int", nullable: false),
                    NastavnikID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Aktivnost", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Aktivnost_Nastavnik_NastavnikID",
                        column: x => x.NastavnikID,
                        principalTable: "Nastavnik",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Aktivnost_Skola_SkolaID",
                        column: x => x.SkolaID,
                        principalTable: "Skola",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Pohadja",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UcenikID = table.Column<int>(type: "int", nullable: true),
                    AktivnostID = table.Column<int>(type: "int", nullable: true),
                    Ocena = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pohadja", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Pohadja_Aktivnost_AktivnostID",
                        column: x => x.AktivnostID,
                        principalTable: "Aktivnost",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Pohadja_Ucenik_UcenikID",
                        column: x => x.UcenikID,
                        principalTable: "Ucenik",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Aktivnost_NastavnikID",
                table: "Aktivnost",
                column: "NastavnikID");

            migrationBuilder.CreateIndex(
                name: "IX_Aktivnost_SkolaID",
                table: "Aktivnost",
                column: "SkolaID");

            migrationBuilder.CreateIndex(
                name: "IX_Pohadja_AktivnostID",
                table: "Pohadja",
                column: "AktivnostID");

            migrationBuilder.CreateIndex(
                name: "IX_Pohadja_UcenikID",
                table: "Pohadja",
                column: "UcenikID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Pohadja");

            migrationBuilder.DropTable(
                name: "Aktivnost");

            migrationBuilder.DropTable(
                name: "Ucenik");

            migrationBuilder.DropTable(
                name: "Nastavnik");

            migrationBuilder.DropTable(
                name: "Skola");
        }
    }
}
