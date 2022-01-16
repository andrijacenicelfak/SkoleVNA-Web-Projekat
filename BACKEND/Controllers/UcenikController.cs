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

            bool onlyDig = true;
            char[] charList = BrTelRod.ToCharArray();
            int i = 0;
            while (i < charList.Count() && onlyDig)
            {
                if (charList[i] < '0' || charList[i] > '9')
                    onlyDig = false;
                i++;
            }

            if (!onlyDig)
                return BadRequest($"Parametar 'Broj telefona roditelja' nevalidan! Moguce je koristiti samo brojeve!");

            try
            {
                Ucenik ucenik = new Ucenik();
                ucenik.Ime = Ime;
                ucenik.Prezime = Prezime;
                ucenik.ImeRoditelja = ImeRoditelja;
                ucenik.BrojTelefonaRoditelja = BrTelRod;

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
            if (string.IsNullOrWhiteSpace(BrojTelefonaRoditelja) || BrojTelefonaRoditelja.Length > 30)
                return BadRequest($"Parametar 'Broj telefona roditelja ucenika' : {BrojTelefonaRoditelja} nije moguc!");

            bool onlyDig = true;
            char[] charList = BrojTelefonaRoditelja.ToCharArray();
            int i = 0;
            while (i < charList.Count() && onlyDig)
            {
                if (charList[i] < '0' || charList[i] > '9')
                    onlyDig = false;
                i++;
            }

            if (!onlyDig)
                return BadRequest($"Parametar 'Broj telefona roditelja' nevalidan! Moguce je koristiti samo brojeve!");

            try
            {
                var ucenik = await Context.Ucenici.Where(p => p.BrojTelefonaRoditelja.Equals(BrojTelefonaRoditelja)).ToListAsync();
                if (ucenik == null)
                    throw new Exception("Nema takvog ucenika!");
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
                var ucenik = await Context.Ucenici.Where(p => p.ID == UcenikID).FirstAsync();
                if (ucenik == null)
                    throw new Exception("Ne postoji ucenik sa takvim ID-jem!");
                var listaPohadja = await Context.PohadjaAktivnost.Where(p => p.Ucenik.ID == UcenikID).ToListAsync();

                foreach (var poh in listaPohadja)
                {
                    Context.Remove(poh);
                }
                Context.Remove(ucenik);
                await Context.SaveChangesAsync();
                return Ok($"Obrisan ucenik sa ID-jem {UcenikID}!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}