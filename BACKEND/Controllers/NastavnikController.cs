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
    public class NastavnikController : ControllerBase
    {
        public SkolaContext Context { get; set; }

        public NastavnikController(SkolaContext context)
        {
            Context = context;
        }
        [HttpGet]
        [Route("VratiNastavnika/{NastavnikID}")]

        public async Task<ActionResult> VratiNastavnika(int NastavnikID)
        {
            try
            {
                return Ok(await Context.Nastavnici.Where(p => p.ID == NastavnikID).Select(n => new
                {
                    n.ID,
                    n.Ime,
                    n.Prezime,
                    n.Iskustvo
                }).FirstOrDefaultAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet]
        [Route("VratiNastavnike/{SkolaID}")]
        public async Task<ActionResult> VratiNastavnike(int SkolaID)
        {
            try
            {
                //var nastavnici = await Context.Nastavnici.Select(p => new { p.ID, p.Ime, p.Prezime, p.Iskustvo, brojAktivnosti = p.Aktivnosti.Count() }).ToListAsync();
                var nastavnici = await Context.Nastavnici.Include(p => p.Aktivnosti).Where(p => p.Aktivnosti.Any(akt => akt.Skola.ID == SkolaID) || p.Aktivnosti.Count() == 0).Select(
                    p => new
                    {
                        p.ID,
                        p.Ime,
                        p.Iskustvo,
                        p.Prezime,
                        brojAktivnosti = p.Aktivnosti.Count()
                    }
                ).ToListAsync();
                return Ok(nastavnici);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPost]
        [Route("DodajNastavnika/{Ime}/{Prezime}/{Iskustvo}")]
        public async Task<ActionResult> DodajNastavnika(string Ime, string Prezime, int Iskustvo)
        {
            if (string.IsNullOrWhiteSpace(Ime) || Ime.Length > 30)
                return BadRequest($"Parametar 'Ime ucenika' : {Ime} nije moguc!");

            if (string.IsNullOrWhiteSpace(Prezime) || Prezime.Length > 30)
                return BadRequest($"Parametar 'Prezime ucenika' : {Prezime} nije moguc!");

            if (Iskustvo < 0 || Iskustvo > 10000)
                return BadRequest($"Parametar 'Iskustvo' : {Iskustvo} nije moguc!");
            try
            {
                Nastavnik n = new Nastavnik();
                n.Ime = Ime;
                n.Prezime = Prezime;
                n.Iskustvo = Iskustvo;
                Context.Nastavnici.Add(n);
                await Context.SaveChangesAsync();

                return Ok($"Uspesno dodat nastavnik {Ime} {Prezime} {n.ID}");

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("ZameniIskustvo/{NastavnikID}/{Iskustvo}")]
        [HttpPut]
        public async Task<ActionResult> ZameniIskustvo(int NastavnikID, int Iskustvo)
        {
            try
            {
                var nastavnik = await Context.Nastavnici.Where(p => p.ID == NastavnikID).FirstOrDefaultAsync();
                nastavnik.Iskustvo = Iskustvo;
                Context.Update(nastavnik);

                await Context.SaveChangesAsync();

                return Ok("Uspesno promenjeno iskustvo!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("IzbrisiNastavnika/{NastavnikID}")]
        [HttpDelete]
        public async Task<ActionResult> IzbrisiNastavnika(int NastavnikID)
        {
            try
            {
                var nastavnik = await Context.Nastavnici.Where(p => p.ID == NastavnikID).Include(p => p.Aktivnosti).FirstOrDefaultAsync();
                if (nastavnik.Aktivnosti.Count() > 0)
                    return BadRequest("Nije moguce obrisati nastavnika koji idalje drzi aktivnosti!");

                Context.Remove(nastavnik);

                await Context.SaveChangesAsync();

                return Ok("Uspesno izbrisan nastavnik!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}