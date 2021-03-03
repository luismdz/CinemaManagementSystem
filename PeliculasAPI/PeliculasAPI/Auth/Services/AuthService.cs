using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PeliculasAPI.Auth;
using PeliculasAPI.Auth.Services;
using PeliculasAPI.Responses;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace PeliculasAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<IdentityUserApp> userManager;
        private readonly SignInManager<IdentityUserApp> signInManager;
        private readonly IConfiguration configuration;

        public AuthService(
            UserManager<IdentityUserApp> userManager,
            SignInManager<IdentityUserApp> signInManager,
            IConfiguration configuration)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
        }

        public async Task<AuthResponse> Register(UserRegistrationRequestDto newUser)
        {
            var existingUser = await userManager.FindByEmailAsync(newUser.Email);

            if (existingUser != null)
            {
                return new AuthResponse()
                {
                    Result = false,
                    ExpirationTime = null,
                    Errors = new List<string>() { "Este Email ya se encuentra registrado." }
                };
            }

            var user = new IdentityUserApp
            { 
                UserName = newUser.Email, 
                Email = newUser.Email, 
                Name = newUser.Name 
            };

            var isCreated = await userManager.CreateAsync(user, newUser.Password);

            if (isCreated.Succeeded)
            {
                var jwtTokenResponse = await GenerateJwtToken(user);
                jwtTokenResponse.Result = true;

                return jwtTokenResponse;
            }
            else
            {
                return new AuthResponse()
                {
                    Result = false,
                    ExpirationTime = null,
                    Errors = isCreated.Errors.Select(x => x.Description).ToList()
                };
            }
        }

        public async Task<AuthResponse> Login(UserLoginRequestDto user)
        {
            // Verificar si el usuario existe
            var existingUser = await userManager.FindByEmailAsync(user.Email);

            // Si no existe
            if (existingUser is null)
            {
                return new AuthResponse()
                {
                    Result = false,
                    ExpirationTime = null,
                    Errors = new List<string>() { "Autentificación inválida" }
                };
            }

            // Verificar si contraseña es correcta para Email o username
            var isSignedIn = await signInManager.PasswordSignInAsync(
                user.Email, 
                user.Password,
                isPersistent: false, 
                lockoutOnFailure: false);

            if (isSignedIn.Succeeded)
            {
                var jwtTokenResponse = await GenerateJwtToken(existingUser);
                jwtTokenResponse.Result = true;

                return jwtTokenResponse;
            }
            else
            {
                return new AuthResponse()
                {
                    Result = false,
                    ExpirationTime = null,
                    Errors = new List<string>() { "Autentificación inválida" }
                };
            }

        }

        private async Task<AuthResponse> GenerateJwtToken(IdentityUserApp user)
        {
            var claims = new List<Claim>()
            {
                new Claim("email", user.Email)
            };

            if (user.Name != null)
            {
                claims.Add(new Claim("name", user.Name));
            }

            // Obtener claims del usuario de DB
            var existingUserClaims = await userManager.GetClaimsAsync(user);
            claims.AddRange(existingUserClaims);

            // Construir token
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["jwtKey"]));
            var signinCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiration = DateTime.UtcNow.AddHours(12);

            var token = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: expiration,
                signingCredentials: signinCredentials);

            return new AuthResponse()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ExpirationTime = expiration
            };
        }
    }
}
