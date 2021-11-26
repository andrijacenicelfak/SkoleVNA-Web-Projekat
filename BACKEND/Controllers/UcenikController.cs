using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace SkolaVanNastavnihAktivnosti.Controllers{
    [ApiController]
    [Route("[controller]")]
    public class UcenikCotroller : ControllerBase{

        public SkolaContext Context {get; set;}
        public UcenikCotroller(SkolaContext context){
            Context = context;
        }

        [Route("Ucenici")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiUcenike(){
            try{
                var ucenici = Context.Ucenici.Select(p => new {p.Ime, p.Prezime, p.ImeRoditelja, p.BrojTelefonaRoditelja/**/, p.ID /**/});
                return Ok(await ucenici.ToListAsync());
            }catch(Exception e){
                return BadRequest(e.Message); 
            }
        }
        [EnableCors("CORS")]
        [Route("DodajUcenika/{Ime}/{Prezime}/{ImeRoditelja}/{BrTelRod}")]
        [HttpPost]
        public async Task<ActionResult> DodajUcenika(string Ime, string Prezime, string ImeRoditelja, string BrTelRod){
            if(string.IsNullOrWhiteSpace(Ime) || Ime.Length > 30 )
                return BadRequest($"Parametar 'Ime ucenika' : {Ime} nije moguc!");
            if(string.IsNullOrWhiteSpace(Prezime) || Prezime.Length > 30 )
                return BadRequest($"Parametar 'Prezime ucenika' : {Prezime} nije moguc!");
            if(string.IsNullOrWhiteSpace(ImeRoditelja) || ImeRoditelja.Length > 30 )
                return BadRequest($"Parametar 'Ime roditelja ucenika' : {ImeRoditelja} nije moguc!");
            if(string.IsNullOrWhiteSpace(BrTelRod) || BrTelRod.Length > 30 )
                return BadRequest($"Parametar 'Broj telefona roditelja ucenika' : {BrTelRod} nije moguc!");
            
            Ucenik ucenik = new Ucenik();
            ucenik.Ime = Ime;
            ucenik.Prezime = Prezime;
            ucenik.ImeRoditelja = ImeRoditelja;
            ucenik.BrojTelefonaRoditelja = BrTelRod;

            try{
                Context.Ucenici.Add(ucenik);
                await Context.SaveChangesAsync();
                return Ok($"Ucenik dodat : {Ime} {Prezime} {ImeRoditelja} {BrTelRod} {ucenik.ID}");
            }catch(Exception e){
                return BadRequest(e.Message);
            }
        }
    }
}