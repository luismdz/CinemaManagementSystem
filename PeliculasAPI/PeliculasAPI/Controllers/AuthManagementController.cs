using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PeliculasAPI.Auth;
using PeliculasAPI.Auth.Services;
using PeliculasAPI.DTOs;
using PeliculasAPI.Responses;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthManagementController : ControllerBase
    {
        private readonly IAuthService authService;

        public AuthManagementController(IAuthService authService)
        {
            this.authService = authService;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "EsAdmin")]
        [HttpGet("users")]
        public async Task<ActionResult> GetAllUsers([FromQuery] PaginacionDTO paginacion)
        {
            var result = await authService.GetAllUsers();
            var usuarios = result.Item1;
            int totalRecords = result.Item2;

            if (usuarios is null)
            {
                return NoContent();
            }

            var usuariosFiltrados = usuarios.AsQueryable()
                .OrderBy(x => x.Name)
                .Skip((int)((paginacion.PageNumber - 1) * paginacion.PageSize))
                .Take((int)paginacion.PageSize);

            return Ok(new PagedResponse<UsuarioDto>(usuariosFiltrados, paginacion) { TotalRecords = totalRecords });
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "EsAdmin")]
        [HttpPost("addAdmin")]
        public async Task<ActionResult> GiveAdmin([FromBody] string email)
        {
            var result = await authService.GiveAdminPriv(email);
            return Ok(result);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "EsAdmin")]
        [HttpPost("removeAdmin")]
        public async Task<ActionResult> RemoveAdmin([FromBody] string email)
        {
            var result = await authService.RemoveAdminPriv(email);
            return Ok(result);
        }


        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] UserRegistrationRequestDto user)
        {
            var response = await authService.Register(user);

            if(!response.Result)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] UserLoginRequestDto user)
        {
            var response = await authService.Login(user);

            if (!response.Result)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
    }
}
