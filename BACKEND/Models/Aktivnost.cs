using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Models
{

    [Table("Aktivnost")]
    public class Aktivnost
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(30)]
        public string Naziv { get; set; }

        [Required]
        [Range(0, 5000)]
        public int Cena { get; set; }

        [Required]
        public Skola Skola { get; set; }

        [Range(1, 7)]
        public int BrojDanaUNedelji { get; set; }

        public virtual Nastavnik Nastavnik { get; set; }

        public virtual List<Pohadja> ListaUcenka { get; set; }

    }
}