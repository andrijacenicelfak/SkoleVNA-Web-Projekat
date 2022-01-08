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
    public class PohadjaController : ControllerBase
    {
        public SkolaContext Context { get; set; }

        public PohadjaController(SkolaContext context)
        {
            Context = context;
        }

        [EnableCors("CORS")]
        [Route("PreuzmiUcenikeUpisaneNaAktivnost/{AktivnostID}")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiUcenikeUpisaneNaAktivnost(int AktivnostID)
        {
            try
            {
                var nesto = Context.PohadjaAktivnost.Include(p => p.Aktivnost).Where(a => a.Aktivnost.ID == AktivnostID).Include(p => p.Ucenik).Select(p => new
                {
                    ime = p.Ucenik.Ime,
                    prezime = p.Ucenik.Prezime,
                    brojTelefonaRoditelja = p.Ucenik.BrojTelefonaRoditelja,
                    ucenikID = p.Ucenik.ID,
                    imeRoditelja = p.Ucenik.ImeRoditelja,
                    poslednjiDatumPlacanje = p.PoslednjePlacanje.ToShortDateString(),
                    ocena = p.Ocena
                });

                return Ok(await nesto.ToListAsync());
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return BadRequest(e.Message);
            }
        }
        [HttpPost]
        [EnableCors("CORS")]
        [Route("/UpisiUcenika/{UcenikID}/{AktivnostID}")]
        public async Task<ActionResult> UpisiUcenika(int UcenikID, int AktivnostID)
        {
            try
            {
                var ucenik = await Context.Ucenici.Where(p => p.ID == UcenikID).FirstOrDefaultAsync();
                var aktivnost = await Context.Aktivnosti.Where(p => p.ID == AktivnostID).FirstOrDefaultAsync();
                if (ucenik == null || aktivnost == null)
                    throw new Exception("Nema takvih ucenika i/ili aktivnosti!");
                Pohadja p = new Pohadja();
                p.Ucenik = ucenik;
                p.Aktivnost = aktivnost;
                p.PoslednjePlacanje = DateTime.Today; // Mora da plati da bi mogao da upise
                Context.PohadjaAktivnost.Add(p);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno upisan ucenik u aktivnost!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [EnableCors("CORS")]
        [HttpPut]
        [Route("Uplati/{UcenikID}/{AktivnostID}")]
        public async Task<ActionResult> Uplati(int UcenikID, int AktivnostID)
        {
            try
            {
                var poh = await Context.PohadjaAktivnost.Where(p => p.Aktivnost.ID == AktivnostID && p.Ucenik.ID == UcenikID).FirstOrDefaultAsync();
                if (poh == null)
                    throw new Exception("Greska, nema takve aktivnosti ili ucenika!");
                poh.PoslednjePlacanje = DateTime.Today;
                await Context.SaveChangesAsync();
                return Ok("Postavljen novi datum placanja!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [EnableCors("CORS")]
        [HttpPut]
        [Route("UpisiOcenu/{UcenikID}/{AktivnostID}/{Ocena}")]
        public async Task<ActionResult> UpisiOcenu(int UcenikID, int AktivnostID, int Ocena)
        {
            try
            {
                var poh = await Context.PohadjaAktivnost.Where(p => p.Aktivnost.ID == AktivnostID && p.Ucenik.ID == UcenikID).FirstOrDefaultAsync();
                if (poh == null)
                    throw new Exception("Greska, nema takve aktivnosti ili ucenika!");
                poh.Ocena = Ocena;
                Context.Update(poh);
                await Context.SaveChangesAsync();
                return Ok("Postavljen novi datum placanja!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [EnableCors("CORS")]
        [Route("VratiUcenikeKojiNisuUpisani")]
        public async Task<ActionResult> VratiUcenikeKojiNisuUpisani()
        {
            try
            {
                var ucenici = await Context.Ucenici.Where(p => p.ListaAktivnosti.Count == 0).ToListAsync();
                return Ok(ucenici);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete]
        [EnableCors("CORS")]
        [Route("IspisiUcenikaOdAktivnosti/{UcenikID}/{AktivnostID}")]
        public async Task<ActionResult> IspisiUcenikaOdAktivnosti(int UcenikID, int AktivnostID)
        {
            try
            {
                var poh = await Context.PohadjaAktivnost.Where(p => p.Aktivnost.ID == AktivnostID && p.Ucenik.ID == UcenikID).FirstOrDefaultAsync();
                if (poh == null)
                    throw new Exception("Greska, nema takve aktivnosti ili ucenika!");
                Context.Remove(poh);
                await Context.SaveChangesAsync();
                return Ok("Postavljen novi datum placanja!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}