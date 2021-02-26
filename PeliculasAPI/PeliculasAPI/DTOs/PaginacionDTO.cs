using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.DTOs
{
    public class PaginacionDTO
    {
        private int? pageSize = 10;
        private int pageNumber = 1;
        private readonly int maximumRecordsPerPage = 100;

        public PaginacionDTO() { }

        public int PageNumber 
        { 
            get { return pageNumber; } 
            set { pageNumber = value < pageNumber ? 1 : value; } 
        }
        public int? PageSize
        {
            get
            {
                return pageSize;
            }
            set
            {
                pageSize = (value > maximumRecordsPerPage || value < 1) ? maximumRecordsPerPage : value;
            }
        }
    }
}
