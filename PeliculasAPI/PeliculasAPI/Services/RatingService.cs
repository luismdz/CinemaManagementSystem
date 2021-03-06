using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.Auth;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.Services
{
    public class RatingService : IRatingService
    {
        private readonly UserManager<IdentityUserApp> userManager;
        private readonly AppDbContext dbContext;

        public RatingService(
            UserManager<IdentityUserApp> userManager,
            AppDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        public async Task<RatingDto> Rate(RatingDto newRating, string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            var userId = user.Id;

            var actualRating = await dbContext.Ratings
                .FirstOrDefaultAsync(x => x.PeliculaId == newRating.PeliculaId && x.UsuarioId == userId);

            if (actualRating is null)
            {
                actualRating = new Rating()
                {
                    PeliculaId = newRating.PeliculaId,
                    UsuarioId = userId,
                    Puntuacion = newRating.Puntuacion
                };

                await dbContext.AddAsync(actualRating);
            }
            else
            {
                actualRating.Puntuacion = newRating.Puntuacion;
            }

            await dbContext.SaveChangesAsync();

            var dto = new RatingDto
            {
                PeliculaId = actualRating.PeliculaId,
                Puntuacion = actualRating.Puntuacion
            };

            return dto;
        }

        public async Task<int> GetUserRating(int peliculaId, string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            var userId = user.Id;

            var userRating = await dbContext.Ratings
                .Where(x => x.PeliculaId == peliculaId && x.UsuarioId == userId)
                .Select(x => x.Puntuacion)
                .FirstOrDefaultAsync();

            return userRating;
        }

    }
}
