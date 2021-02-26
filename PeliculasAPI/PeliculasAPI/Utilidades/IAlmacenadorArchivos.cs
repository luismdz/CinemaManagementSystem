using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace PeliculasAPI.Utilidades
{
    public interface IAlmacenadorArchivos
    {
        Task BorrarArchivo(string fileRoute, string container);
        Task<string> EditarArchivo(string container, IFormFile file, string fileRoute);
        Task<string> GuardarArchivo(string container, IFormFile file);
    }
}