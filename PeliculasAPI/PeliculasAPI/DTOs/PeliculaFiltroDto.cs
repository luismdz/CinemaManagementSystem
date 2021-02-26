using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.DTOs
{
    public class PeliculaFiltroDto
    {
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
        public PaginacionDTO Paginacion { 
            get 
            {
                return new PaginacionDTO() { PageNumber = PageNumber, PageSize = PageSize };
            } 
        }
        public string Titulo { get; set; }
        public int GeneroId { get; set; }
        public bool EnCines { get; set; }
        public bool ProximosEstrenos { get; set; }
    }
}
