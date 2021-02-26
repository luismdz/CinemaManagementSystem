using AutoMapper;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.Services
{
    public class GeneroService : IGeneroService
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper mapper;

        public GeneroService(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            this.mapper = mapper;
        }

        public IEnumerable<GeneroDto> GetAll()
        {
            return _dbContext.Generos
                .Select(g => new GeneroDto() { Id = g.Id, Nombre = g.Nombre });
        }
        
        public IQueryable<GeneroDto> GetAll(PaginacionDTO paginacion)
        {
            return _dbContext.Generos.AsQueryable()
                .OrderBy(g => g.Nombre)
                .Skip((int)((paginacion.PageNumber - 1) * paginacion.PageSize))
                .Take((int)paginacion.PageSize)
                .Select(g => new GeneroDto() { Id = g.Id, Nombre = g.Nombre });
        }

        public GeneroDto GetById(int id)
        {
            return _dbContext.Generos
               .Where(g => g.Id == id)
               .Select(g => new GeneroDto() { Id = g.Id, Nombre = g.Nombre })
               .FirstOrDefault();
        }

        public async Task<GeneroDto> Update(int id, GeneroDto generoEditado)
        {
            var genero = await _dbContext.Generos.FindAsync(id);

            if (genero is null) return null;

            genero.Nombre = generoEditado.Nombre;

            await _dbContext.SaveChangesAsync();

            var dto = mapper.Map<GeneroDto>(genero);

            return dto;
        }

        public GeneroDto Create(GeneroDto nuevoGenero)
        {
            Genero genero = new Genero() { Nombre = nuevoGenero.Nombre };

            _dbContext.Generos.Add(genero);
            
            _dbContext.SaveChanges();

            var dto = mapper.Map<GeneroDto>(genero);

            return dto;
        }

        public async Task<bool> Delete(int id)
        {
            var genero = await _dbContext.Generos.FindAsync(id);

            if (genero is null) return false;

            _dbContext.Generos.Remove(genero);
            return await _dbContext.SaveChangesAsync() > 0;
        }
    }
}
