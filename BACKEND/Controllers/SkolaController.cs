using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace SkolaVanNastavnihAktivnosti.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SkolaController : ControllerBase
    {

        public SkolaContext Context { get; set; }
        public SkolaController(SkolaContext context)
        {
            Context = context;
        }

        [Route("PreuzmiSkole")]
        [EnableCors("CORS")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiSkole()
        {
            try
            {
                var skole = Context.Skole.Select(p => new { p.Naziv, p.Tip, p.ID });

                return Ok(await skole.ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}