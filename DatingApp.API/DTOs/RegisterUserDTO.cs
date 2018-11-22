using System;
using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.DTOs
{
    public class RegisterUserDto
    {
        public RegisterUserDto()
        {
            Created = DateTime.Now;
            LastActive = Created;
        }

        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(8, MinimumLength=4, ErrorMessage="Enter a password of 4-8 characters")]
        public string Password { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
    }
}