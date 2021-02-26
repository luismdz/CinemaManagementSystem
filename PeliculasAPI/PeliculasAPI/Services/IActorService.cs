using PeliculasAPI.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.Services
{
    public interface IActorService
    {
        Task<ActorDto> Create(ActorCreacionDto nuevoActor);
        Task<bool> Delete(int id);
        IEnumerable<ActorDto> GetAll();
        IQueryable<ActorDto> GetAll(PaginacionDTO paginacion);
        ActorDto GetById(int id);
        Task<ActorDto> Update(int id, ActorCreacionDto actorEditado);
        Task<List<ActorDto>> GetByName(string name);
    }
}