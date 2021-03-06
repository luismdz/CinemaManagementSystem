using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.Responses
{
    public class AuthResponse
    {
        public string Token { get; set; }
        public DateTime? ExpirationTime { get; set; }
        public bool Result { get; set; }
        public List<string> Errors { get; set; }
    }
}
