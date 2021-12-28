using Microsoft.EntityFrameworkCore;

namespace Models
{

    public class SkolaContext : DbContext
    {

        public DbSet<Skola> Skole { get; set; }

        public DbSet<Aktivnost> Aktivnosti { get; set; }

        public DbSet<Pohadja> PohadjaAktivnost { get; set; }

        public DbSet<Nastavnik> Nastavnici { get; set; }

        public DbSet<Ucenik> Ucenici { get; set; }

        public SkolaContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

        }
    }
}