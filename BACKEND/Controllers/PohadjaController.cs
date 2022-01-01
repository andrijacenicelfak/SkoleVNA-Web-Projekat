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
        /*
        [HttpGet]
        [Route("/VratiUpisaneAktivnosti")]
        public async Task<ActionResult> VratiPohadja()
        {
            try
            {

                var pohajda = await Context.PohadjaAktivnost.Select(p => new { ucenikID = p.Ucenik.ID, aktivnostID = p.Aktivnost.ID, datumPlacanje = p.PoslednjePlacanje.ToShortDateString() }).ToListAsync();

                return Ok(pohajda);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        */
        [HttpPost]
        [Route("/UpisiUcenika/{UcenikID}/{AktivnostID}")]
        public async Task<ActionResult> DodajNastavnika(int UcenikID, int AktivnostID)
        {
            try
            {
                var ucenik = await Context.Ucenici.Where(p => p.ID == UcenikID).FirstOrDefaultAsync();
                var aktivnost = await Context.Aktivnosti.Where(p => p.ID == AktivnostID).FirstOrDefaultAsync();
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
        }/*
        //TREBA MI OVO
        [HttpGet]
        [Route("/PretraziUcenikaSaSvimAktivnostima/{Ime}/{Prezime}/{BrojTelefonaRoditelja}")]

        public async Task<ActionResult> PretraziUcenikaSaSvimAktivnostima(string Ime, string Prezime, string BrojTelefonaRoditelja)
        {
            try
            {
                int ucenikID = await Context.Ucenici.Where(p => p.Ime == Ime && p.Prezime == p.Prezime && p.BrojTelefonaRoditelja == BrojTelefonaRoditelja).Select(p => p.ID).FirstOrDefaultAsync();
                var nesto = Context.PohadjaAktivnost.Where(p => p.Ucenik.ID == ucenikID).Select(p => new
                {
                    aktivnostID = p.Aktivnost.ID,
                    ime = p.Ucenik.Ime,
                    prezime = p.Ucenik.Prezime,
                    id = ucenikID,
                    BrojTelefonaRoditelja = p.Ucenik.BrojTelefonaRoditelja,
                    imeRoditelja = p.Ucenik.ImeRoditelja
                });

                return Ok(await nesto.ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }*/
    }
}