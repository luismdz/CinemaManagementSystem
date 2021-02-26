using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.Services
{
    public class CineService : ICineService
    {
        private readonly AppDbContext _dbContext;
        public CineService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IEnumerable<CineDto> GetAll()
        {
            return _dbContext.Cines
                .Select(c => new CineDto()
                {
                    Id = c.Id,
                    Nombre = c.Nombre,
                    Latitud = c.Latitud,
                    Longitud = c.Longitud
                });
        }

        public IQueryable<CineDto> GetAll(PaginacionDTO paginacion)
        {
            return _dbContext.Cines.AsQueryable()
                .OrderBy(c => c.Nombre)
                .Skip((int)((paginacion.PageNumber - 1) * paginacion.PageSize))
                .Take((int)paginacion.PageSize)
                .Select(c => new CineDto()
                {
                    Id = c.Id,
                    Nombre = c.Nombre,
                    Latitud = c.Latitud,
                    Longitud = c.Longitud
                });
        }

        public CineDto GetById(int id)
        {
            return _dbContext.Cines
               .Where(c => c.Id == id)
               .Select(c => new CineDto()
               {
                   Id = c.Id,
                   Nombre = c.Nombre,
                   Latitud = c.Latitud,
                   Longitud = c.Longitud
               })
               .FirstOrDefault();
        }

        public async Task<CineDto> Update(int id, CineDto cineEditado)
        {
            var cine = await _dbContext.Cines.FindAsync(id);

            if (cine is null) return null;

            cine.Nombre = cineEditado.Nombre;
            cine.Latitud = cineEditado.Latitud;
            cine.Longitud = cineEditado.Longitud;

            await _dbContext.SaveChangesAsync();

            return new CineDto
            {
                Id = cine.Id,
                Nombre = cine.Nombre,
                Latitud = cine.Latitud,
                Longitud = cine.Longitud
            };
        }

        public async Task<CineDto> Create(CineDto nuevoCine)
        {
            Cine cine = new Cine()
            {
                Id = nuevoCine.Id,
                Nombre = nuevoCine.Nombre,
                Latitud = nuevoCine.Latitud,
                Longitud = nuevoCine.Longitud
            };

            await _dbContext.Cines.AddAsync(cine);

            await _dbContext.SaveChangesAsync();

            return new CineDto()
            {
                Id = cine.Id,
                Nombre = cine.Nombre,
                Latitud = cine.Latitud,
                Longitud = cine.Longitud
            };
        }

        public async Task<bool> Delete(int id)
        {
            var cine = await _dbContext.Cines.FindAsync(id);

            if (cine is null) return false;

            _dbContext.Cines.Remove(cine);
            return await _dbContext.SaveChangesAsync() > 0;
        }
    }
}
