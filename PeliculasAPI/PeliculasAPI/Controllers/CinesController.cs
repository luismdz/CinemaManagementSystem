using Microsoft.AspNetCore.Http;
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
    [Route("api/cines")]
    [ApiController]
    public class CinesController : ControllerBase
    {
        private readonly ICineService cineService;

        public CinesController(ICineService cineService)
        {
            this.cineService = cineService;
        }


        [HttpGet]
        public ActionResult<List<CineDto>> GetAll([FromQuery] PaginacionDTO paginacion)
        {
            var cines = cineService.GetAll();

            if (cines is null)
            {
                return BadRequest();
            }

            if(paginacion == null)
            {
                return Ok(cines);
            }

            int totalRecords = cines.Count();

            var cinesFiltrados = cines.AsQueryable()
                .OrderBy(c => c.Nombre)
                .Skip((int)((paginacion.PageNumber - 1) * paginacion.PageSize))
                .Take((int)paginacion.PageSize);

            return Ok(new PagedResponse<CineDto>(cinesFiltrados, paginacion) { TotalRecords = totalRecords });
        }

        [HttpGet("List")]
        public ActionResult<List<CineDto>> GetAll()
        {
            var cines = cineService.GetAll();

            if (cines == null)
            {
                return NoContent();
            }

            return Ok(cines);
        }

        [HttpGet("{id:int}")]
        public ActionResult<CineDto> GetById(int id)
        {
            var cine = cineService.GetById(id);
            if (cine is null)
                return NotFound(id);

            return Ok(cine);
        }

        [HttpPost]
        public async Task<ActionResult<CineDto>> Post([FromBody] CineDto nuevoCine)
        {
            if (nuevoCine is null)
                return BadRequest(new ArgumentNullException(nameof(nuevoCine)));

            var cine = await cineService.Create(nuevoCine);

            return Ok(cine);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<CineDto>> Put(int id, [FromBody] CineDto cineEditado)
        {
            var cine = await cineService.Update(id, cineEditado);
            
            if (cine is null)
                return NotFound(id);

            return Ok(cine);
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<CineDto>> Delete(int id)
        {
            if(!await cineService.Delete(id))
            {
                return NotFound(id);
            }

            return NoContent();
        }

    }
}
