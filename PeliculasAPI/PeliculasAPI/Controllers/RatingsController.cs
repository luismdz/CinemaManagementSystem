using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.Auth;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.Controllers
{
    [Route("api/rating")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class RatingsController : ControllerBase
    {
        private readonly IRatingService ratingService;

        public RatingsController(IRatingService ratingService)
        {
            this.ratingService = ratingService;
        } 

        [HttpPost]
        public async Task<ActionResult> Rate([FromBody] RatingDto newRating)
        {
            var email = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "email").Value;
            
            if(email is null) 
            { 
                return BadRequest(); 
            }

            var rating = await ratingService.Rate(newRating, email);

            return Ok(rating);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<int>> GetUserRating(int peliculaId)
        {
            // Obtener usuario autentificado 
            var email = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "email").Value;
            var userRating = await ratingService.GetUserRating(peliculaId, email);

            return Ok(userRating);
        }
    }
}
