using Microsoft.AspNetCore.Http;
using System;

namespace PeliculasAPI.DTOs
{
    public class ActorCreacionDto
    {
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Biografia { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public IFormFile Foto { get; set; }
    }
}
