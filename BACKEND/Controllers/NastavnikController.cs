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

        [EnableCors("CORS")]
        [HttpGet]
        [Route("VratiNastavnika/{NastavnikID}")]
        public async Task<ActionResult> VratiNastavnika(int NastavnikID)
        {
            try
            {
                var nastavnik = await Context.Nastavnici.Where(p => p.ID == NastavnikID).Select(n => new
                {
                    n.ID,
                    n.Ime,
                    n.Prezime,
                    n.Ocena
                }).FirstAsync();
                if (nastavnik == null)
                    throw new Exception("Ne postoji nastavnik sa tim ID-jem!");
                return Ok(nastavnik);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [EnableCors("CORS")]
        [Route("VratiNastavnike/{SkolaID}")]
        public async Task<ActionResult> VratiNastavnike(int SkolaID)
        {
            try
            {
                var skola = await Context.Skole.Where(p => p.ID == SkolaID).FirstAsync();
                if (skola == null)
                    throw new Exception("Skola ne postoji!");

                var nastavnici = await Context.Nastavnici.Include(p => p.Aktivnosti).Where(p => p.Aktivnosti.Any(akt => akt.Skola.ID == SkolaID) || p.Aktivnosti.Count() == 0).Select(
                    p => new
                    {
                        p.ID,
                        p.Ime,
                        p.Ocena,
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
        [EnableCors("CORS")]
        [Route("DodajNastavnika/{Ime}/{Prezime}/{Ocena}")]
        public async Task<ActionResult> DodajNastavnika(string Ime, string Prezime, float Ocena)
        {
            if (string.IsNullOrWhiteSpace(Ime) || Ime.Length > 30)
                return BadRequest($"Parametar 'Ime nastavnika' : {Ime} nije moguc!");

            if (string.IsNullOrWhiteSpace(Prezime) || Prezime.Length > 30)
                return BadRequest($"Parametar 'Prezime nastavnika' : {Prezime} nije moguc!");

            if (Ocena < 0 || Ocena > 10)
                return BadRequest($"Parametar 'Ocena' : {Ocena} nije moguc!");
            try
            {
                Nastavnik n = new Nastavnik();
                n.Ime = Ime;
                n.Prezime = Prezime;
                n.Ocena = Ocena;
                Context.Nastavnici.Add(n);
                await Context.SaveChangesAsync();

                return Ok($"Uspesno dodat nastavnik {Ime} {Prezime} {n.ID}");

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [EnableCors("CORS")]
        [Route("ZameniOcena/{NastavnikID}/{Ocena}")]
        [HttpPut]
        public async Task<ActionResult> ZameniOcena(int NastavnikID, float Ocena)
        {
            if (Ocena < 0 || Ocena > 10)
                return BadRequest($"Parametar 'Ocena' : {Ocena} nije moguc!");
            try
            {
                var nastavnik = await Context.Nastavnici.Where(p => p.ID == NastavnikID).FirstAsync();
                if (nastavnik == null)
                    throw new Exception("Ne postoji nastavnik sa takvim ID-jem!");
                nastavnik.Ocena = Ocena;
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
        [EnableCors("CORS")]
        [HttpDelete]
        public async Task<ActionResult> IzbrisiNastavnika(int NastavnikID)
        {
            try
            {
                var nastavnik = await Context.Nastavnici.Where(p => p.ID == NastavnikID).Include(p => p.Aktivnosti).FirstAsync();
                if (nastavnik == null)
                    throw new Exception("Ne postoji nastavnik sa takvim ID-jem!");

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