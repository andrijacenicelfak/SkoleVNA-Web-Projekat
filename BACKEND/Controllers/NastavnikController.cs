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
        /*
        [HttpGet]
        [Route("/VratiNastavnike")]
        public async Task<ActionResult> VratiNastavnike(){
            try{

                var nastavnici = await Context.Nastavnici.ToListAsync();

                return Ok(nastavnici);
            }catch(Exception e){
                return BadRequest(e.Message);
            }
        }
        */
        /*
        [HttpPost]
        [Route("/DodajNastavnika/{Ime}/{Prezime}/{Iskustvo}")]
        public async Task<ActionResult> DodajNastavnika(string Ime, string Prezime, int Iskustvo){
            try{
                Nastavnik n = new Nastavnik();
                n.Ime = Ime;
                n.Prezime = Prezime;
                n.Iskustvo = Iskustvo;
                Context.Nastavnici.Add(n);
                await Context.SaveChangesAsync();

                return Ok($"Uspesno dodat nastavnik {Ime} {Prezime} {n.ID}");

            }catch(Exception e){
                return BadRequest(e.Message);
            }
        }*/
    }
}