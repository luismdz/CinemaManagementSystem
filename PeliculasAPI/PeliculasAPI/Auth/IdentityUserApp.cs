using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.Auth
{
    public class IdentityUserApp: IdentityUser
    {
        public string Name { get; set; }
    }
}
