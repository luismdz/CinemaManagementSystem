using Microsoft.AspNetCore.Mvc;
using PeliculasAPI.DTOs;
using PeliculasAPI.Responses;
using PeliculasAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.Controllers
{
    [Route("api/actores")]
    [ApiController]
    public class ActoresController : ControllerBase
    {
        private readonly IActorService actorService;

        public ActoresController(IActorService actorService)
        {
            this.actorService = actorService;
        }

        [HttpGet]
        public ActionResult<ActorDto> GetAllByPage([FromQuery] PaginacionDTO paginacion)
        {
            var actores = actorService.GetAll();

            if (actores == null)
            {
                return BadRequest();
            }

            int totalRecords = actores.Count();

            var actoresFiltrados = actores.AsQueryable()
                .OrderBy(a => a.Nombre)
                .Skip((int)((paginacion.PageNumber - 1) * paginacion.PageSize))
                .Take((int)paginacion.PageSize);

            return Ok(new PagedResponse<ActorDto>(actoresFiltrados, paginacion) { TotalRecords = totalRecords });
        }

        [HttpGet("List")]
        public ActionResult<List<ActorDto>> GetAll()
        {
            var actores = actorService.GetAll();

            if (actores == null)
            {
                return BadRequest();
            }

            return Ok(actores);
        }
        
        [HttpGet("buscarPorNombre/{nombre}")]
        public async Task<ActionResult<List<ActorDto>>> GetByName(string nombre)
        {
            var actores = await actorService.GetByName(nombre);

            if (actores == null)
            {
                return BadRequest();
            }

            return Ok(actores);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ActorDto> GetById(int id)
        {
            var actor = actorService.GetById(id);

            if (actor == null)
            {
                return NotFound();
            }

            return Ok(actor);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ActorDto>> Put(int id, [FromForm] ActorCreacionDto actorEditado)
        {
            var actor = await actorService.Update(id, actorEditado);
            
            if (actor == null) 
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<ActorDto>> Post([FromForm] ActorCreacionDto nuevoActor)
        {
            if (nuevoActor is null)
            {
                return BadRequest(new ArgumentNullException(nameof(nuevoActor)));
            }

            var actor = await actorService.Create(nuevoActor);

            return CreatedAtAction(nameof(GetById), new { id = actor.Id }, actor);
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ActorDto>> Delete(int id)
        {
            var existe = await actorService.Delete(id);

            if (!existe)
            {
                return NotFound();
            }

            return NoContent();
        }

    }
}
