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

        [HttpGet]
        [Route("/VratiUpisaneAktivnosti")]
        public async Task<ActionResult> VratiPohadja(){
            try{

                var pohajda = await Context.PohadjaAktivnost.ToListAsync();

                return Ok(pohajda);
            }catch(Exception e){
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("/UpisiUcenika/{UcenikID}/{AktivnostID}")]
        public async Task<ActionResult> DodajNastavnika(int UcenikID, int AktivnostID){
            try{
                var ucenik = await Context.Ucenici.Where(p => p.ID == UcenikID).FirstOrDefaultAsync();
                var aktivnost = await Context.Aktivnosti.Where(p => p.ID == AktivnostID).FirstOrDefaultAsync();
                Pohadja p = new Pohadja();
                p.Ucenik = ucenik;
                p.Aktivnost = aktivnost;
                p.PoslednjePlacanje = DateTime.Today; // Mora da plati da bi mogao da upise
                return Ok($"Uspesno upisan ucenik u aktivnost!");
            }catch(Exception e){
                return BadRequest(e.Message);
            }
        }
    }
}