using PeliculasAPI.Auth;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.Entidades
{
    public class Rating
    {
        public int Id { get; set; }
        [Range(1,5)]
        [Required]
        public int Puntuacion { get; set; }
        [Required]
        public int PeliculaId { get; set; }
        public Pelicula Pelicula { get; set; }
        [Required]
        public string UsuarioId { get; set; }
        public IdentityUserApp Usuario { get; set; }
    }
}
