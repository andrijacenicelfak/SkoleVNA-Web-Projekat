using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace Models
{

    [Table("Nastavnik")]
    public class Nastavnik
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(30)]
        public string Ime { get; set; }

        [Required]
        [MaxLength(30)]
        public string Prezime { get; set; }

        [Range(0, 10000)]
        public int Iskustvo { get; set; }

        public virtual List<Aktivnost> Aktivnosti { get; set; }
    }
}