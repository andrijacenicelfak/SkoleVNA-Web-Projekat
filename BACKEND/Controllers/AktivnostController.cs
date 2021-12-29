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
    public class AktivnostController : ControllerBase
    {
        public SkolaContext Context { get; set; }

        public AktivnostController(SkolaContext context)
        {
            Context = context;
        }

        [Route("DodajAktivnost/{Naziv}/{Cena}/{IdSkole}/{BrojDana}/{IDNastavnika}")]
        [HttpPost]
        public async Task<ActionResult> DodajAktivnost(string Naziv, int Cena, int IdSkole, int BrojDana, int IDNastavnika)
        {
            try
            {
                var nastavnik = await Context.Nastavnici.Where(p => p.ID == IDNastavnika).FirstOrDefaultAsync();
                var skola = await Context.Skole.Where(p => p.ID == IdSkole).FirstOrDefaultAsync();


                Aktivnost akt = new Aktivnost();
                akt.Naziv = Naziv;
                akt.BrojDanaUNedelji = BrojDana;
                akt.Cena = Cena;
                akt.Nastavnik = nastavnik;
                akt.Skola = skola;

                Context.Aktivnosti.Add(akt);
                skola.Aktivnosti.Add(akt);

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

                return Ok($"Obrisina skola sa ID : ${ID}");
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
                var akt = Context.Aktivnosti.Select(p => new { p.Naziv, p.BrojDanaUNedelji, p.Cena, p.ID });

                return Ok(await akt.ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        //TREBA MI =>
        [Route("PreuzmiAktivnostiZaSkolu/{SkolaID}")]
        [HttpGet]

        public async Task<ActionResult> PreuzmiAktivnostiZaSkolu(int SkolaID)
        {
            try
            {
                var akt = Context.Aktivnosti.Where(p=> p.Skola.ID == SkolaID).Select(p => new { p.Naziv, p.BrojDanaUNedelji, p.Cena, p.ID, nastavnikID = p.Nastavnik.ID});

                return Ok(await akt.FirstOrDefaultAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}