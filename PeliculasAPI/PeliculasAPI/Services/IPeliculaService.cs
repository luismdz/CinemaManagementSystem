using PeliculasAPI.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.Services
{
    public interface IPeliculaService
    {
        Task<PeliculaDto> Create(PeliculasCreacionDto nuevaPelicula);
        Task<bool> Delete(int id);
        Task<IEnumerable<PeliculaDto>> GetAll();
        IQueryable<PeliculaDto> GetAllByPage(PaginacionDTO paginacion);
        Task<LandingPageInfoDto> GetLandingPageInfo();
        Task<PeliculaDto> GetById(int id);
        Task<(List<PeliculaDto>, int)> GetFiltered(PeliculaFiltroDto filtroDto);
        Task<PeliculaDto> Update(int id, PeliculasCreacionDto peliculaEditada);
    }
}