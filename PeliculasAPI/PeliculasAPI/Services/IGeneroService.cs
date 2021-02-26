using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.Services
{
    public interface IGeneroService
    {
        GeneroDto Create(GeneroDto nuevoGenero);
        Task<bool> Delete(int id);
        IEnumerable<GeneroDto> GetAll(); 
        IQueryable<GeneroDto> GetAll(PaginacionDTO paginacion);
        GeneroDto GetById(int id);
        Task<GeneroDto> Update(int id, GeneroDto generoEditado);
    }
}