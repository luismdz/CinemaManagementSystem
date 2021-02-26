using AutoMapper;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.Utilidades
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Genero, GeneroDto>().ReverseMap();
            CreateMap<Actor, ActorDto>().ReverseMap();
            CreateMap<Actor, ActorCreacionDto>().ReverseMap();
            CreateMap<Cine, CineDto>().ReverseMap();
            CreateMap<PeliculasCreacionDto, Pelicula>()
                .ForMember(x => x.Poster, opt => opt.Ignore())
                .ForMember(x => x.PeliculasGeneros, opt => opt.MapFrom(MapearPeliculasGenerosCreacion))
                .ForMember(x => x.PeliculasActores, opt => opt.MapFrom(MapearPeliculasActoresCreacion))
                .ForMember(x => x.PeliculasCines, opt => opt.MapFrom(MapearPeliculasCinesCreacion));
             CreateMap<Pelicula, PeliculaDto>()
                .ForMember(x => x.Generos, opt => opt.MapFrom(MapearPeliculasGeneros))
                .ForMember(x => x.Actores, opt => opt.MapFrom(MapearPeliculasActores))
                .ForMember(x => x.Cines, opt => opt.MapFrom(MapearPeliculasCines));
            
        }

        public static List<GeneroDto> MapearPeliculasGeneros(Pelicula pelicula, PeliculaDto peliculaDto)
        {
            var result = new List<GeneroDto>();
            
            if (pelicula.PeliculasGeneros != null)
            {
                foreach (var genero in pelicula.PeliculasGeneros)
                {
                    result.Add(new GeneroDto() 
                    { 
                        Id = genero.GeneroId,
                        Nombre = genero.Genero?.Nombre
                    });
                }
            }

            return result;
        }

        public static List<PeliculaActorDto> MapearPeliculasActores(Pelicula pelicula, PeliculaDto peliculaDto)
        {
            var result = new List<PeliculaActorDto>();

            if (pelicula.PeliculasActores != null)
            {
                foreach (var peliculaActor in pelicula.PeliculasActores)
                {
                    result.Add(new PeliculaActorDto() 
                    { 
                        Id = peliculaActor.ActorId,
                        Nombre = peliculaActor.Actor.Nombre,
                        Apellido = peliculaActor.Actor.Apellido,
                        Foto = peliculaActor.Actor.Foto,
                        Personaje = peliculaActor.Personaje,
                        Orden = peliculaActor.Orden
                    });
                }
            }

            return result;
        }

        public static List<CineDto> MapearPeliculasCines(Pelicula pelicula, PeliculaDto peliculaDto)
        {
            var result = new List<CineDto>();

            if (pelicula.PeliculasCines != null)
            {
                foreach (var cine in pelicula.PeliculasCines)
                {
                    result.Add(new CineDto() 
                    { 
                        Id = cine.CineId,
                        Nombre = cine.Cine.Nombre,
                        Latitud = cine.Cine.Latitud,
                        Longitud = cine.Cine.Longitud
                    });
                }
            }

            return result;
        }

        /// <summary>
        /// Mapeos PeliculasCreacionDto -> Pelicula
        /// </summary>
        public static List<PeliculasGeneros> MapearPeliculasGenerosCreacion(PeliculasCreacionDto nuevaPelicula, Pelicula pelicula)
        {
            var result = new List<PeliculasGeneros>();

            if (nuevaPelicula.GenerosIds != null)
            {
                foreach (var id in nuevaPelicula.GenerosIds)
                {
                    result.Add(new PeliculasGeneros() { GeneroId = id });
                }
            }

            return result;
        }

        public static List<PeliculasActores> MapearPeliculasActoresCreacion(PeliculasCreacionDto nuevaPelicula, Pelicula pelicula)
        {
            var result = new List<PeliculasActores>();
            int orden = 1;

            if (nuevaPelicula.Actores == null)
                return result;

            foreach (var actor in nuevaPelicula.Actores)
            {
                result.Add(new PeliculasActores()
                {
                    ActorId = actor.Id,
                    Personaje = actor.Personaje,
                    Orden = orden
                });

                orden++;
            }

            return result;
        }

        public static List<PeliculasCines> MapearPeliculasCinesCreacion(PeliculasCreacionDto nuevaPelicula, Pelicula pelicula)
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
        /// <summary>
        /// Mapeos PeliculasCreacionDto -> Pelicula
        /// </summary>


    }
}
