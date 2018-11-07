using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.DTOs
{
    public class RegisterUserDTO
    {
        [Required]
        public string username { get; set; }

        [Required]
        [StringLength(8, MinimumLength=4, ErrorMessage="Enter a password of 4-8 characters")]
        public string password { get; set; }
    }
}