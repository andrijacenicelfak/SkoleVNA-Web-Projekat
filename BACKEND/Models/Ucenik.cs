using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Models
{

    [Table("Ucenik")]
    public class Ucenik
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(30)]
        public string Ime { get; set; }

        [Required]
        [MaxLength(30)]
        public string Prezime { get; set; }

        [Required]
        [MaxLength(13)]
        [RegularExpression("\\d+")]
        public string BrojTelefonaRoditelja { get; set; }

        [MaxLength(30)]
        public string ImeRoditelja { get; set; }

        public virtual List<Pohadja> ListaAktivnosti { get; set; }

    }
}