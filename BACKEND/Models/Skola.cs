using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
namespace Models
{

    [Table("Skola")]
    public class Skola
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(30)]
        public string Naziv { get; set; }

        [MaxLength(30)]
        public string Tip { get; set; }

        public virtual List<Aktivnost> Aktivnosti { get; set; }

    }
}