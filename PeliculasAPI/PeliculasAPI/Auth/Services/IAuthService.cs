using PeliculasAPI.DTOs;
using PeliculasAPI.Responses;
using System.Threading.Tasks;

namespace PeliculasAPI.Auth.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> Login(UserLoginRequestDto user);
        Task<AuthResponse> Register(UserRegistrationRequestDto newUser);
    }
}