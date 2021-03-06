using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
namespace Models
{

    [Table("Pohadja")]
    public class Pohadja
    {
        [Key]
        public int ID { get; set; }

        public virtual Ucenik Ucenik { get; set; }

        public virtual Aktivnost Aktivnost { get; set; }

        public DateTime PoslednjePlacanje { get; set; }

        [Range(0, 5)]
        public int Ocena { get; set; }

    }
}