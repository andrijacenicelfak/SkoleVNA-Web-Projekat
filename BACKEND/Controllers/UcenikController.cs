using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using System.Collections.Generic;

namespace SkolaVanNastavnihAktivnosti.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class UcenikController : ControllerBase
    {

        public SkolaContext Context { get; set; }
        public UcenikController(SkolaContext context)
        {
            Context = context;
        }
        ///<summary>
        /// Dodaje ucenika u bazu
        ///</summary>
        /// <param name="Ime"> Ime ucenika kog zelimo da dodamo.</param>
        /// <param name="Prezime"> Prezime ucenika kog zelimo da dodamo.</param>
        /// <param name="ImeRoditelja"> Ime roditelja ucenika kog zelimo da dodamo.</param>
        /// <param name="BrTelRod"> Broj telefona roditelja ucenika kog zelimo da dodamo.</param>
        [EnableCors("CORS")]
        [Route("DodajUcenika/{Ime}/{Prezime}/{ImeRoditelja}/{BrTelRod}")]
        [HttpPost]
        public async Task<ActionResult> DodajUcenika(string Ime, string Prezime, string ImeRoditelja, string BrTelRod)
        {
            if (string.IsNullOrWhiteSpace(Ime) || Ime.Length > 30)
                return BadRequest($"Parametar 'Ime ucenika' : {Ime} nije moguc!");

            if (string.IsNullOrWhiteSpace(Prezime) || Prezime.Length > 30)
                return BadRequest($"Parametar 'Prezime ucenika' : {Prezime} nije moguc!");

            if (string.IsNullOrWhiteSpace(ImeRoditelja) || ImeRoditelja.Length > 30)
                return BadRequest($"Parametar 'Ime roditelja ucenika' : {ImeRoditelja} nije moguc!");

            if (string.IsNullOrWhiteSpace(BrTelRod) || BrTelRod.Length > 30)
                return BadRequest($"Parametar 'Broj telefona roditelja ucenika' : {BrTelRod} nije moguc!");
            Ucenik ucenik = new Ucenik();
            ucenik.Ime = Ime;
            ucenik.Prezime = Prezime;
            ucenik.ImeRoditelja = ImeRoditelja;
            ucenik.BrojTelefonaRoditelja = BrTelRod;

            try
            {

                Context.Ucenici.Add(ucenik);
                await Context.SaveChangesAsync();

                return Ok($"Ucenik dodat : {ucenik.Ime} {ucenik.Prezime} {ucenik.ImeRoditelja} {ucenik.BrojTelefonaRoditelja} {ucenik.ID}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("PretraziUcenike/{BrojTelefonaRoditelja}")]
        [EnableCors("CORS")]

        public async Task<ActionResult> PretraziUcenike(string BrojTelefonaRoditelja)
        {
            bool onlyDig = true;
            char[] charList = BrojTelefonaRoditelja.ToCharArray();
            int i = 0;
            while (i < charList.Count() && onlyDig)
            {
                if (charList[i] < '0' || charList[i] > '9')
                    onlyDig = false;
                i++;
            }

            if (string.IsNullOrWhiteSpace(BrojTelefonaRoditelja) || BrojTelefonaRoditelja.Length > 30 || !onlyDig)
                return BadRequest($"Parametar 'Broj telefona roditelja ucenika' : {BrojTelefonaRoditelja} nije moguc!");

            try
            {

                var ucenik = await Context.Ucenici.Where(p => p.BrojTelefonaRoditelja.Equals(BrojTelefonaRoditelja)).FirstOrDefaultAsync();
                return Ok(ucenik);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpDelete]
        [EnableCors("CORS")]
        [Route("ObrisiUcenika/{UcenikID}")]
        public async Task<ActionResult> ObrisiUcenika(int UcenikID)
        {
            try
            {
                var ucenik = await Context.Ucenici.Where(p => p.ID == UcenikID).FirstOrDefaultAsync();
                if (ucenik == null)
                    throw new Exception("Greska, nema takve aktivnosti ili ucenika!");
                var listaPohadja = await Context.PohadjaAktivnost.Where(p => p.Ucenik.ID == UcenikID).ToListAsync();

                foreach (var poh in listaPohadja)
                {
                    Context.Remove(poh);
                }
                Context.Remove(ucenik);
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