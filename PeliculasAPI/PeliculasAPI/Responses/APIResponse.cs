using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI
{
    public class APIResponse<T>
    {
        public APIResponse() { }

        public APIResponse(T response)
        {
            Data = response;
        }

        public T Data { get; set; }
        public string Message { get; set; }
    }
}
