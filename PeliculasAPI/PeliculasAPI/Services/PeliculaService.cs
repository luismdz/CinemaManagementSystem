using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPI.Utilidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.Services
{
    public class PeliculaService : IPeliculaService
    {
        private readonly AppDbContext _dbContext;
        private readonly IAlmacenadorArchivos _almacenador;
        private readonly IMapper mapper;
        private readonly string container = "peliculas";

        public PeliculaService(
            AppDbContext dbContext,
            IAlmacenadorArchivos almacenador,
            IMapper mapper)
        {
            _dbContext = dbContext;
            _almacenador = almacenador;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<PeliculaDto>> GetAll()
        {
            var peliculas = await _dbContext.Peliculas
                .Include(x => x.PeliculasGeneros).ThenInclude(x => x.Genero)
                .Include(x => x.PeliculasActores).ThenInclude(x => x.Actor)
                .Include(x => x.PeliculasCines).ThenInclude(x => x.Cine)
                .ToListAsync();

            return mapper.Map<List<PeliculaDto>>(peliculas);
        }

        public IQueryable<PeliculaDto> GetAllByPage(PaginacionDTO paginacion)
        {
            var peliculas = _dbContext.Peliculas
                .Include(x => x.PeliculasGeneros).ThenInclude(x => x.Genero)
                .Include(x => x.PeliculasActores).ThenInclude(x => x.Actor)
                .Include(x => x.PeliculasCines).ThenInclude(x => x.Cine)
                .AsQueryable()
                .OrderBy(p => p.Titulo)
                .Skip((int)((paginacion.PageNumber - 1) * paginacion.PageSize))
                .Take((int)paginacion.PageSize);

            return mapper.Map<IQueryable<PeliculaDto>>(peliculas);
        }

        public async Task<PeliculaDto> GetById(int id)
        {
            var pelicula = await _dbContext.Peliculas
                .Where(x => x.Id == id)
                .Include(x => x.PeliculasGeneros).ThenInclude(x => x.Genero)
                .Include(x => x.PeliculasActores).ThenInclude(x => x.Actor)
                .Include(x => x.PeliculasCines).ThenInclude(x => x.Cine)
                .FirstOrDefaultAsync();

            if(pelicula is null)
            {
                return null;
            }
            
            var peliculaDto = mapper.Map<PeliculaDto>(pelicula);
            var promedio = 0.0;

            if (await _dbContext.Ratings.AnyAsync(x => x.PeliculaId == id))
            {
                promedio = await _dbContext.Ratings
                    .Where(x => x.PeliculaId == id)
                    .AverageAsync(x => x.Puntuacion);
            }

            peliculaDto.Puntuacion = promedio;

            return peliculaDto;
        }

        public async Task<LandingPageInfoDto> GetLandingPageInfo()
        {
            var top = 6;
            var today = DateTime.Now;

            var proximosEstrenos = await _dbContext.Peliculas
                .Where(x => x.FechaLanzamiento > today && !x.EnCines)
                .OrderBy(x => x.FechaLanzamiento)
                .Take(top)
                .Include(x => x.PeliculasActores).ThenInclude(x => x.Actor)
                .Include(x => x.PeliculasCines).ThenInclude(x => x.Cine)
                .Include(x => x.PeliculasGeneros).ThenInclude(x => x.Genero)
                .ToListAsync();

            var enCines = await _dbContext.Peliculas
                .Where(x => x.EnCines)
                .OrderByDescending(x => x.FechaLanzamiento)
                .Take(top)
                .Include(x => x.PeliculasActores).ThenInclude(x => x.Actor)
                .Include(x => x.PeliculasCines).ThenInclude(x => x.Cine)
                .Include(x => x.PeliculasGeneros).ThenInclude(x => x.Genero)
                .ToListAsync();

            return new LandingPageInfoDto()
            {
                ProximosEstrenos = mapper.Map<List<PeliculaDto>>(proximosEstrenos),
                EnCines = mapper.Map<List<PeliculaDto>>(enCines)
            };
        }

        public async Task<(List<PeliculaDto>, int)> GetFiltered(PeliculaFiltroDto filtroDto)
        {
            var peliculasQueryable = _dbContext.Peliculas.AsQueryable();
            int totalRecords = await peliculasQueryable.CountAsync();
            int totalRecordsFiltered = 0;
            
            if(!string.IsNullOrEmpty(filtroDto.Titulo))
            {
                peliculasQueryable = peliculasQueryable
                    .Where(x => x.Titulo
                    .Contains(filtroDto.Titulo));

                totalRecordsFiltered += await peliculasQueryable.CountAsync();
            }

            if(filtroDto.EnCines)
            {
                peliculasQueryable = peliculasQueryable.Where(x => x.EnCines);
                totalRecordsFiltered += await peliculasQueryable.CountAsync();
            }
            
            if(filtroDto.ProximosEstrenos)
            {
                peliculasQueryable = peliculasQueryable
                    .Where(x => x.FechaLanzamiento > DateTime.Now);

                totalRecordsFiltered += await peliculasQueryable.CountAsync();
            }

            if(filtroDto.GeneroId != 0)
            {
                peliculasQueryable = peliculasQueryable
                    .Where(x => x.PeliculasGeneros.Select(y => y.GeneroId)
                    .Contains(filtroDto.GeneroId));

                totalRecordsFiltered += await peliculasQueryable.CountAsync();
            }

            peliculasQueryable = peliculasQueryable
                .OrderByDescending(x => x.FechaLanzamiento)
                .Skip((int)((filtroDto.Paginacion.PageNumber - 1) * filtroDto.Paginacion.PageSize))
                .Take((int)filtroDto.Paginacion.PageSize);

            var peliculasDtoFiltradas = mapper.Map<List<PeliculaDto>>(peliculasQueryable);

            return (peliculasDtoFiltradas, totalRecordsFiltered <= 0 ? totalRecords : totalRecordsFiltered);
        }

        public async Task<PeliculaDto> Update(int id, PeliculasCreacionDto peliculaEditada)
        {
            var pelicula = await _dbContext.Peliculas
                .Where(x => x.Id == id)
                .Include(x => x.PeliculasGeneros)
                .Include(x => x.PeliculasCines)
                .Include(x => x.PeliculasActores)
                .FirstOrDefaultAsync();

            if (pelicula is null)
            {
                return null;
            }

            pelicula = mapper.Map(peliculaEditada, pelicula);

            if (peliculaEditada.Poster != null)
            {
                pelicula.Poster = await _almacenador.EditarArchivo(container, peliculaEditada.Poster, pelicula.Poster);
            }

            await _dbContext.SaveChangesAsync();

            var dto = await GetById(id);
            return dto;
        }

        public async Task<PeliculaDto> Create(PeliculasCreacionDto nuevaPelicula)
        {
            var pelicula = mapper.Map<Pelicula>(nuevaPelicula);

            if(pelicula.FechaLanzamiento is null)
            {
                pelicula.FechaLanzamiento = new DateTime(1900, 01, 01);
            }

            if (nuevaPelicula.Poster != null)
            {
                pelicula.Poster = await _almacenador.GuardarArchivo(container, nuevaPelicula.Poster);
            }

            await _dbContext.AddAsync(pelicula);
            await _dbContext.SaveChangesAsync();

            var dto = await GetById(pelicula.Id);

            return dto;
        }

        public async Task<bool> Delete(int id)
        {
            var pelicula = await _dbContext.Peliculas
               .Where(x => x.Id == id)
               .Include(x => x.PeliculasGeneros)
               .Include(x => x.PeliculasCines)
               .Include(x => x.PeliculasActores)
               .FirstOrDefaultAsync();

            if (pelicula is null)
            {
                return false;
            }

            _dbContext.Remove(pelicula);

            await _almacenador.BorrarArchivo(pelicula.Poster, container);
            await _dbContext.SaveChangesAsync();

            return true;
        }
    }
}
