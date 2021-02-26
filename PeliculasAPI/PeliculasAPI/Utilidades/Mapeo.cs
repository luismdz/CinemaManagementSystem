using PeliculasAPI.Entidades;
using PeliculasAPI.DTOs;
using System.Collections.Generic;

namespace PeliculasAPI.Utilidades
{
    public class Mapeo
    {
        public static List<PeliculasGeneros> MapearPeliculasGeneros(PeliculasCreacionDto nuevaPelicula)
        {
            var result = new List<PeliculasGeneros>();

            if (nuevaPelicula.GenerosIds == null) 
                return result;

            foreach (var id in nuevaPelicula.GenerosIds)
            {
                result.Add(new PeliculasGeneros() { GeneroId = id });
            }

            return result;
        }

         public static List<PeliculasActores> MapearPeliculasActores(PeliculasCreacionDto nuevaPelicula)
        {
            var result = new List<PeliculasActores>();
            int orden = 1;

            if (nuevaPelicula.Actores == null) 
                return result;

            foreach (var actor in nuevaPelicula.Actores)
            {
                result.Add(new PeliculasActores() { 
                    ActorId = actor.Id, 
                    Personaje = actor.Personaje,
                    Orden = orden
                });

                orden++;
            }

            return result;
        }

         public static List<PeliculasCines> MapearPeliculasCines(PeliculasCreacionDto nuevaPelicula)
        {
            var result = new List<PeliculasCines>();

            if (nuevaPelicula.CinesIds == null) 
                return result;

            foreach (var id in nuevaPelicula.CinesIds)
            {
                result.Add(new PeliculasCines() { CineId = id });
            }

            return result;
        }

    }
}
