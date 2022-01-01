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
                    poslednjiDatumPlacanje = p.PoslednjePlacanje.ToShortDateString()
                });

                return Ok(await nesto.ToListAsync());
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return BadRequest(e.Message);
            }
        }
        /*
        ///<summary>
        /// Preuzima sve ucenike sa svim aktivnostima
        ///</summary>
        [Route("PreuzmiUcenike")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiUcenike()
        {
            try
            {
                var ucenici = Context.Ucenici;

                return Ok(await ucenici.ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
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
            Console.WriteLine(Ime + " " + Prezime);
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
        // Malo nebitna funckija, ako se na kraju odlucim izbrisacu! TODO
        ///<summary> Izmeni informacije o roditelju nekog ucenika. </summary>
        /// <param name="StariBrojTelRoditelja"> Stari broj telefona roditelja ucenika.</param>
        /// <param name="NoviBrojTelRoditelja"> Novi broj telefona roditelja ucenika.</param>
        /// <param name="ImeRoditelja"> Ime roditelja ucenika.</param>
        [EnableCors("CORS")]
        [Route("IzmeniInformacijeORoditelju/{StariBrojTelRoditelja}/{NoviBrojTelRoditelja}/{ImeRoditelja}")]
        [HttpPut]
        public async Task<ActionResult> IzmeniInformacijeORoditelju(string StariBrojTelRoditelja, string NoviBrojTelRoditelja, string ImeRoditelja)
        {
            if (string.IsNullOrEmpty(StariBrojTelRoditelja) || StariBrojTelRoditelja.Length > 30)
                return BadRequest($"Broj telefona {StariBrojTelRoditelja} nije validan");

            if (string.IsNullOrEmpty(NoviBrojTelRoditelja) || NoviBrojTelRoditelja.Length > 30)
                return BadRequest($"Broj telefona {NoviBrojTelRoditelja} nije validan");

            if (string.IsNullOrEmpty(ImeRoditelja) || ImeRoditelja.Length > 30)
                return BadRequest($"Podatak {ImeRoditelja} nije validan");

            try
            {

                Ucenik u = await Context.Ucenici.Where(p => p.BrojTelefonaRoditelja.Equals(StariBrojTelRoditelja)).FirstOrDefaultAsync();

                if (u == null)
                    return BadRequest("Ne postoji takav ucenik!");

                u.BrojTelefonaRoditelja = NoviBrojTelRoditelja;

                if (!string.IsNullOrEmpty(ImeRoditelja))
                    u.ImeRoditelja = ImeRoditelja;

                Context.Ucenici.Update(u);

                await Context.SaveChangesAsync();

                return Ok($"Promenjen ucenik : {u.Ime} {u.Prezime}, {u.ImeRoditelja} {u.BrojTelefonaRoditelja}");

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary> Nadji ucenika preko imena, prezimena i broja telefona roditelja. </summary>
        /// <param name="Ime"> Ime ucenika kog trazimo. </param>
        /// <param name="Prezime"> Prezime ucenika kog trazimo. </param>
        /// <param name="BrojTelefonaRoditelja"> Broj telefona roditelja ucenika kog trazimo. </param>
        /// <returns> Lista ucenika </returns>
        [Route("NadjiUcenika/{Ime}/{Prezime}/{BrojTelefonaRoditelja}")]
        [HttpGet]
        public async Task<ActionResult> NadjiUcenika(string Ime, string Prezime, string BrojTelefonaRoditelja)
        {
            try
            {
                return Ok(await Context.Ucenici.Where(p => (p.Ime == Ime && p.Prezime == Prezime && p.BrojTelefonaRoditelja == BrojTelefonaRoditelja)).ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        /// <summary> Nadji ucenika preko imena i prezimena. </summary>
        /// <param name="Ime"> Ime ucenika kog trazimo. </param>
        /// <param name="Prezime"> Prezime ucenika kog trazimo. </param>
        /// <returns> Lista ucenika </returns>
        [Route("NadjiUcenika/{Ime}/{Prezime}")]
        [HttpGet]
        public async Task<ActionResult> NadjiUcenika(string Ime, string Prezime)
        {
            try
            {
                return Ok(await Context.Ucenici.Where(p => (p.Ime == Ime && p.Prezime == Prezime)).ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        ///<summary> Brise ucenika preko ID </summary>
        ///<param name="ID"> Indetifikacioni broj </param>
        [EnableCors("CORS")]
        [Route("IzbrisiUcenika/{ID}")]
        [HttpDelete]
        public async Task<ActionResult> IzbrisiUcenika(int ID)
        {
            if (ID < 0)
                return BadRequest("Nije validan ID");

            try
            {
                var ucenik = await Context.Ucenici.Where(p => p.ID == ID).FirstAsync();

                string poruka = $"Izbrisan ucenik {ucenik.Ime} {ucenik.Prezime}";

                Context.Ucenici.Remove(ucenik);
                await Context.SaveChangesAsync();

                return Ok(poruka);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }*/
    }
}