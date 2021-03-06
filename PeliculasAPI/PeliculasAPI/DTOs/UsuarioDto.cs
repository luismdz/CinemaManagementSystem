using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.DTOs
{
    public class UsuarioDto
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public bool IsAdmin { get; set; }
    }
}
