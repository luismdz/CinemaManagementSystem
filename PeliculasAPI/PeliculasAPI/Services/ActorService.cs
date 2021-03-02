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
    public class ActorService : IActorService
    {
        private readonly AppDbContext _dbContext;
        private readonly IAlmacenadorArchivos _almacenador;
        private readonly string container = "actores";

        public ActorService(AppDbContext dbContext, IAlmacenadorArchivos almacenador)
        {
            _dbContext = dbContext;
            _almacenador = almacenador;
        }

        public IEnumerable<ActorDto> GetAll()
        {
            return _dbContext.Actores
                .Select(a => new ActorDto() {
                    Id = a.Id,
                    Nombre = a.Nombre,
                    Apellido = a.Apellido,
                    Biografia = a.Biografia,
                    FechaNacimiento = a.FechaNacimiento,
                    Foto = a.Foto
                });
        }

        public IQueryable<ActorDto> GetAll(PaginacionDTO paginacion)
        {
            return _dbContext.Actores.AsQueryable()
                .OrderBy(g => g.Nombre)
                .Skip((int)((paginacion.PageNumber - 1) * paginacion.PageSize))
                .Take((int)paginacion.PageSize)
                .Select(g => new ActorDto() { Id = g.Id, Nombre = g.Nombre });
        }

        public async Task<List<ActorDto>> GetByName(string name)
        {
            //if(string.IsNullOrWhiteSpace(name)) { return new List<ActorDto>(); }
            if (string.IsNullOrWhiteSpace(name))
            {
                return await _dbContext.Actores
                    .Select(a => new ActorDto()
                    {
                        Id = a.Id,
                        Nombre = a.Nombre,
                        Apellido = a.Apellido,
                        Biografia = a.Biografia,
                        FechaNacimiento = a.FechaNacimiento,
                        Foto = a.Foto
                    })
                    .OrderBy(x => x.Nombre + ' ' + x.Apellido)
                    .Take(10)
                    .ToListAsync();
            }
            
            return await _dbContext.Actores
                .Where(a => (a.Nombre.Contains(name) || a.Apellido.Contains(name)))
                .Select(a => new ActorDto()
                {
                     Id = a.Id,
                     Nombre = a.Nombre,
                     Apellido = a.Apellido,
                     Biografia = a.Biografia,
                     FechaNacimiento = a.FechaNacimiento,
                     Foto = a.Foto
                 })
                .Take(10)
                .ToListAsync();
        }

        public ActorDto GetById(int id)
        {
            return _dbContext.Actores
               .Where(g => g.Id == id)
               .Select(a => new ActorDto()
                   {
                       Id = a.Id,
                       Nombre = a.Nombre,
                       Apellido = a.Apellido,
                       Biografia = a.Biografia,
                       FechaNacimiento = a.FechaNacimiento,
                       Foto = a.Foto
                   })
               .FirstOrDefault();
        }

        public async Task<ActorDto> Update(int id, ActorCreacionDto actorEditado)
        {
            var actor = await _dbContext.Actores.FindAsync(id);

            if (actor is null) return null;

            actor.Nombre = actorEditado.Nombre;
            actor.Apellido = actorEditado.Apellido;
            actor.Biografia = actorEditado.Biografia;
            actor.FechaNacimiento = actorEditado.FechaNacimiento;

            if (actorEditado.Foto != null)
            {
                actor.Foto = await _almacenador.EditarArchivo(container, actorEditado.Foto, actor.Foto);
            }

            await _dbContext.SaveChangesAsync();

            return new ActorDto()
            {
                Nombre = actor.Nombre,
                Apellido = actor.Apellido,
                Biografia = actor.Biografia,
                FechaNacimiento = actor.FechaNacimiento,
                Foto = actor.Foto
            };
        }

        public async Task<ActorDto> Create(ActorCreacionDto nuevoActor)
        {
            var actor = new Actor() {
                Nombre = nuevoActor.Nombre,
                Apellido = nuevoActor.Apellido,
                Biografia = nuevoActor.Biografia,
                FechaNacimiento = nuevoActor.FechaNacimiento,
            };

            if(nuevoActor.Foto != null)
            {
                actor.Foto = await _almacenador.GuardarArchivo(container, nuevoActor.Foto);
            }

            await _dbContext.Actores.AddAsync(actor);

            await _dbContext.SaveChangesAsync();

            return new ActorDto()
            {
                Id = actor.Id,
                Nombre = actor.Nombre,
                Apellido = actor.Apellido,
                Biografia = actor.Biografia,
                FechaNacimiento = actor.FechaNacimiento,
                Foto = actor.Foto
            };
        }

        public async Task<bool> Delete(int id)
        {
            var actor = await _dbContext.Actores.FindAsync(id);

            if (actor is null) return false;

            _dbContext.Actores.Remove(actor);

            if(await _dbContext.SaveChangesAsync() > 0)
            {
                await _almacenador.BorrarArchivo(actor.Foto, container);
            }

            return true;
        }
    }
}
