using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPI.Responses;
using PeliculasAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.Controllers
{
    [Route("api/generos")]
    [ApiController]
    public class GenerosController : ControllerBase
    {
        private readonly IGeneroService _generoService;

        public GenerosController(IGeneroService generoService)
        {
            _generoService = generoService;
        }

        [HttpGet]
        public ActionResult<GeneroDto> GetAll([FromQuery] PaginacionDTO paginacion)
        {
            var generos = _generoService.GetAll();
        
            if (generos == null)
            {
                return NoContent();
            }

            int totalRecords = generos.Count();

            var generosFiltrados = generos.AsQueryable()
                .OrderBy(g => g.Nombre)
                .Skip((int)((paginacion.PageNumber - 1) * paginacion.PageSize))
                .Take((int)paginacion.PageSize);

            return Ok(new PagedResponse<GeneroDto>(generosFiltrados, paginacion) { TotalRecords = totalRecords});
        }

        [HttpGet("List")]
        public ActionResult<GeneroDto> GetAll()
        {
            var generos = _generoService.GetAll();

            if (generos == null)
            {
                return NoContent();
            }

            return Ok(generos);
        }

        [HttpGet("{id:int}")]
        public ActionResult<GeneroDto> GetById(int id)
        {
            var genero = _generoService.GetById(id);

            if(genero == null)
            {
                return NotFound();
            }

            return Ok(genero);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<GeneroDto>> Put(int id, [FromBody] GeneroDto generoEditado)
        {
            var genero = await _generoService.Update(id, generoEditado);

            if (genero == null)
            {
                return NotFound();
            }

            return Ok();
        }

        [HttpPost]
        public ActionResult<GeneroDto> Post([FromBody] GeneroDto nuevoGenero)
        {
            if(nuevoGenero is null)
            {
                return BadRequest(new ArgumentNullException(nameof(nuevoGenero)));
            }

            var genero = _generoService.Create(nuevoGenero);

            return CreatedAtAction(nameof(GetById), new { id = genero.Id }, genero);
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<Genero>> Delete (int id)
        {
            var existe = await _generoService.Delete(id);

            if (!existe)
            {
                return NotFound();
            }

            return Ok();
        }

    }
}
