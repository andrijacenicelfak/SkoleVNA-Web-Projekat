using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace SkolaVanNastavnihAktivnosti.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class AktivnostCotroller : ControllerBase
    {
        public SkolaContext Context { get; set; }

        public AktivnostCotroller(SkolaContext context)
        {
            Context = context;
        }

        [Route("DodajAktivnost/{Naziv}/{Cena}/{NazivSkole}/{BrojDana}/{IDNastavnika}")]
        [HttpPost]
        public async Task<ActionResult> DodajAktivnost(string Naziv, int Cena, string NazivSkole, int BrojDana, int IDNastavnika)
        {
            try
            {
                var nastavnik = await Context.Nastavnici.Where(p => p.ID == IDNastavnika).FirstAsync();
                var skola = await Context.Skole.Where(p => p.Naziv.Equals(NazivSkole)).FirstAsync();
                int IdSkole = skola.ID;

                Aktivnost akt = new Aktivnost();
                akt.Naziv = Naziv;
                akt.BrojDanaUNedelji = BrojDana;
                akt.Cena = Cena;
                akt.Nastavnik = nastavnik;

                skola.Aktivnosti.Add(akt);
                Context.Aktivnosti.Add(akt);

                await Context.SaveChangesAsync();

                return Ok($"Dodata Aktivnost: {akt.ID}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [EnableCors("CORS")]
        [Route("ObrisiAktivnost/{ID}")]
        [HttpDelete]
        public async Task<ActionResult> ObrisiAktivnost(int ID)
        {
            try
            {
                var aktivnost = await Context.Aktivnosti.Where(p => p.ID == ID).FirstAsync();

                Context.Aktivnosti.Remove(aktivnost);

                await Context.SaveChangesAsync();

                return Ok($"Obrisina skola sa ID : {ID}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("PreuzmiSveAktivnosti")]
        [HttpGet]

        public async Task<ActionResult> PreuzmiSveAktivnosti()
        {
            try
            {
                var akt = Context.Aktivnosti.Select(p => new { p.Naziv, p.BrojDanaUNedelji, p.Cena });

                return Ok(await akt.ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}