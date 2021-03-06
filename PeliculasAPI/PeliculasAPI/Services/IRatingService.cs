using PeliculasAPI.DTOs;
using System.Threading.Tasks;

namespace PeliculasAPI.Services
{
    public interface IRatingService
    {
        Task<RatingDto> Rate(RatingDto newRating, string email);
        Task<int> GetUserRating(int peliculaId, string email);
    }
}