using PeliculasAPI.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.Services
{
    public interface ICineService
    {
        Task<CineDto> Create(CineDto nuevoCine);
        Task<bool> Delete(int id);
        IEnumerable<CineDto> GetAll();
        IQueryable<CineDto> GetAll(PaginacionDTO paginacion);
        CineDto GetById(int id);
        Task<CineDto> Update(int id, CineDto cineEditado);
    }
}