using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class Actkey
    {
        [Key]
        public int id { get; set; }
        public int userid { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string actkey { get; set; }
        public int status { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string title { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string created_at { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string updated_at { get; set; }
    }
}
