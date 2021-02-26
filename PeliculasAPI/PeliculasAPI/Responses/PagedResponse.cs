using PeliculasAPI.DTOs;
using System.Linq;

namespace PeliculasAPI.Responses
{
    public class PagedResponse<T>
    {
        public PagedResponse() { }
       
        public PagedResponse(IQueryable<T> data, PaginacionDTO page)
        {
            Data = data;
            PageNumber = page.PageNumber;
            PageSize = page.PageSize;
        }

        public IQueryable<T> Data { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public int? TotalRecords { get; set; }
    }
}
