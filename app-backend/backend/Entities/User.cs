using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Entities
{
    public class User
    {
        [Key]
        public int id { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string email { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string password { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string cusid { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string created_at { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string updated_at { get; set; }
    }
}
