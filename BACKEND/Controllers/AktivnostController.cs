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
        //OVO MI JE POTREBNO
        [EnableCors("CORS")]
        [Route("VratiAktivnostiZaSkolu/{SkolaID}")]
        [HttpGet]
        public async Task<ActionResult> VratiAktivnostiZaSkolu(int SkolaID)
        {
            try
            {
                return Ok(await Context.Aktivnosti.Where(p => p.Skola.ID == SkolaID).Select(p => new
                {
                    aktivnostID = p.ID,
                    aktivnostNaziv = p.Naziv,
                    aktivnostCena = p.Cena,
                    nastavnikID = p.Nastavnik.ID,
                    aktivnostBrojDana = p.BrojDanaUNedelji
                }).ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [EnableCors("CORS")]
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
        [Route("ZameniNastavnika/{AktivnostID}/{NastavnikID}")]
        [HttpPut]
        public async Task<ActionResult> ZameniNastavnika(int AktivnostID, int NastavnikID)
        {
            try
            {
                var akt = await Context.Aktivnosti.Where(p => p.ID == AktivnostID).Include(p => p.Nastavnik).ThenInclude(p => p.Aktivnosti).FirstOrDefaultAsync();
                if (akt == null)
                    return BadRequest("Ne postoji takva aktivnost!");
                var nastavnik = await Context.Nastavnici.Where(p => p.ID == NastavnikID).Include(p => p.Aktivnosti).FirstOrDefaultAsync();
                if (nastavnik == null)
                    return BadRequest("Ne postoji takav nastavnik!");

                akt.Nastavnik.Aktivnosti.Remove(akt);
                nastavnik.Aktivnosti.Add(akt);
                akt.Nastavnik = nastavnik;
                Context.Update(akt);
                Context.Update(nastavnik);
                await Context.SaveChangesAsync();

                return Ok("Zamenjen Nastavnik!");
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
                var pohadjaLista = await Context.PohadjaAktivnost.Where(p => p.Aktivnost.ID == ID).ToListAsync();
                foreach (var poh in pohadjaLista)
                {
                    Context.Remove(poh);
                }

                Context.Aktivnosti.Remove(aktivnost);

                await Context.SaveChangesAsync();

                return Ok($"Obrisina skola sa ID : ${ID}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /*
                        [Route("PreuzmiSveAktivnosti")]
                        [HttpGet]

                        public async Task<ActionResult> PreuzmiSveAktivnosti()
                        {
                            try
                            {
                                var akt = Context.Aktivnosti.Select(p => new { p.Naziv, p.BrojDanaUNedelji, p.Cena, p.ID, skolaID = p.Skola.ID });

                                return Ok(await akt.ToListAsync());
                            }
                            catch (Exception e)
                            {
                                return BadRequest(e.Message);
                            }
                        }*/
    }
}