using PeliculasAPI.DTOs;
using PeliculasAPI.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PeliculasAPI.Auth.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> Login(UserLoginRequestDto user);
        Task<AuthResponse> Register(UserRegistrationRequestDto newUser);
        Task<(List<UsuarioDto>, int)> GetAllUsers();
        Task<APIResponse<bool>> GiveAdminPriv(string email);
        Task<APIResponse<bool>> RemoveAdminPriv(string email);
    }
}