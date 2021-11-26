using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace SkolaVanNastavnihAktivnosti.Controllers{
    [ApiController]
    [Route("[controller]")]
    public class SkolaController : ControllerBase{

        public SkolaContext Context {get; set;}
        public SkolaController(SkolaContext context){
            Context = context;
        }

        [Route("Skole")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiSkole(){
            try{
                var skole = Context.Skole.Select(p => new {p.Naziv, p.Tip});
                return Ok(await skole.ToListAsync());
            }catch(Exception e){
                return BadRequest(e.Message); 
            }
        }
        [EnableCors("CORS")]
        [Route("DodajSkolu")]
        [HttpPost]
        public async Task<ActionResult> DodajSkolu([FromBody] Skola skola){
            if(string.IsNullOrWhiteSpace(skola.Naziv) || skola.Naziv.Length > 30 )
                return BadRequest($"Parametar 'Naziv skole' : {skola.Naziv} nije moguc!");
            if(string.IsNullOrWhiteSpace(skola.Tip) || skola.Tip.Length > 30 )
                return BadRequest($"Parametar 'Tip skole' : {skola.Tip} nije moguc!");
            
            try
            {
                Context.Skole.Add(skola);
                await Context.SaveChangesAsync();
                return Ok($"Skola je dodata! ID je: {skola.ID}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
         }

         [EnableCors("CORS")]
         [Route("DodajSkolu/{NazivSkole}/{TipSkole}")]
         [HttpPost]
         public async Task<ActionResult> DodajSkolu(string NazivSkole, string TipSkole){
             if(string.IsNullOrWhiteSpace(NazivSkole) || NazivSkole.Length > 30 )
                return BadRequest($"Parametar 'Naziv skole' : {NazivSkole} nije moguc!");
            if(string.IsNullOrWhiteSpace(TipSkole) || TipSkole.Length > 30 )
                return BadRequest($"Parametar 'Tip skole' : {TipSkole} nije moguc!");

            Skola skola = new Skola();
            skola.Naziv = NazivSkole;
            skola.Tip = TipSkole;
            
            try
            {
                Context.Skole.Add(skola);
                await Context.SaveChangesAsync();
                return Ok($"Skola je dodata! ID je: {skola.ID}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
         }

        [EnableCors("CORS")]
        [Route("IzbrisiSkolu/{id}")]
        [HttpDelete]
        public async Task<ActionResult> IzbrisiSkolu(int id){
            if (id <= 0)
            {
                return BadRequest("Pogrešan ID!");
            }
            try
            {
                var skola = await Context.Skole.FindAsync(id);
                string naziv = skola.Naziv;
                Context.Skole.Remove(skola);
                await Context.SaveChangesAsync();
                return Ok($"Uspešno izbrisana skola : {naziv}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        } 
    }
}