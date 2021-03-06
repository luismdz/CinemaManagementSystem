using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PeliculasAPI.DTOs;
using PeliculasAPI.Responses;
using PeliculasAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.Controllers
{
    [Route("api/peliculas")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "EsAdmin")]
    public class PeliculasController : ControllerBase
    {
        private readonly IPeliculaService peliculaService;
        private readonly IRatingService ratingService;

        public PeliculasController(IPeliculaService peliculaService, IRatingService ratingService)
        {
            this.peliculaService = peliculaService;
            this.ratingService = ratingService;
        }

        [HttpGet]
        public async Task<ActionResult<List<PeliculaDto>>> GetAllByPage([FromQuery] PaginacionDTO paginacion)
        {
            var peliculas = await peliculaService.GetAll();

            if (peliculas == null)
            {
                return BadRequest();
            }

            int totalRecords = peliculas.Count();

            var peliculasFiltrados = peliculas.AsQueryable()
                .OrderBy(x => x.Titulo)
                .Skip((int)((paginacion.PageNumber - 1) * paginacion.PageSize))
                .Take((int)paginacion.PageSize);

            return Ok(new PagedResponse<PeliculaDto>(peliculasFiltrados, paginacion) { TotalRecords = totalRecords });
        }

        [HttpGet("List")]
        public async Task<ActionResult<List<PeliculaDto>>> GetAll()
        {
            var peliculas = await peliculaService.GetAll();

            if (peliculas == null)
            {
                return BadRequest();
            }

            return Ok(peliculas.OrderBy(x => x.FechaLanzamiento));
        }

        [HttpGet("landingPage")]
        [AllowAnonymous]
        public async Task<ActionResult> GetLandingPage()
        {
            var result = await peliculaService.GetLandingPageInfo();

            if (result is null) return BadRequest();

            return Ok(result);
        }

        [HttpGet("filtro")]
        [AllowAnonymous]
        public async Task<ActionResult<List<PeliculaDto>>> GetFilteredMovies([FromQuery] PeliculaFiltroDto filtroDto)
        {
            var result = await peliculaService.GetFiltered(filtroDto);
            var peliculas = result.Item1.AsQueryable();
            int totalRecords = result.Item2;

            return Ok(new PagedResponse<PeliculaDto>(peliculas, filtroDto.Paginacion) { TotalRecords = totalRecords });
        }

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<PeliculaDto>> GetById(int id)
        {
            var pelicula = await peliculaService.GetById(id);

            if (pelicula == null)
            {
                return NotFound();
            }

            var usuarioPuntuacion = 0;

            if(HttpContext.User.Identity.IsAuthenticated)
            {
                var email = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "email").Value;
                usuarioPuntuacion = await ratingService.GetUserRating(pelicula.Id, email);
            }

            pelicula.UsuarioPuntuacion = usuarioPuntuacion;

            return Ok(pelicula);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<PeliculaDto>> Put(int id, [FromForm] PeliculasCreacionDto peliculaEditada)
        {
            if (peliculaEditada is null)
            {
                return BadRequest();
            }

            var pelicula = await peliculaService.Update(id, peliculaEditada);

            if (pelicula is null)
            {
                return NotFound();
            }

            return Ok(pelicula);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromForm] PeliculasCreacionDto nuevaPelicula)
        {
            if (nuevaPelicula is null)
            {
                return BadRequest(new ArgumentNullException(nameof(nuevaPelicula)));
            }

            PeliculaDto pelicula = await peliculaService.Create(nuevaPelicula);

            return CreatedAtAction(nameof(GetById), new { id = pelicula.Id }, pelicula);
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await peliculaService.Delete(id);

            if(result)
            {
                return Ok();
            } else
            {
                return NotFound();
            }
        }
    }
}
