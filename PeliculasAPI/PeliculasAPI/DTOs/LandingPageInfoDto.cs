using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.DTOs
{
    public class LandingPageInfoDto
    {
        public List<PeliculaDto> EnCines { get; set; }
        public List<PeliculaDto> ProximosEstrenos { get; set; }
    }
}
