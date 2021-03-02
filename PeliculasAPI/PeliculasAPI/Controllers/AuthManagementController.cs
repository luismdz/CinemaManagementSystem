using Microsoft.AspNetCore.Mvc;
using PeliculasAPI.Auth;
using PeliculasAPI.Auth.Services;
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
