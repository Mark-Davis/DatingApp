using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace DatingApp.API.Data
{
    public class Seed
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        public Seed(UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public void SeedUsers()
        {
            if (!_userManager.Users.Any())
            {
                var userData = File.ReadAllText("Data/UserSeedData.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);
                var roles = new List<Role> {
                    new Role {Name = RoleTypes.Member},
                    new Role {Name = RoleTypes.Administrator},
                    new Role {Name = RoleTypes.Moderator},
                    new Role {Name = RoleTypes.VIP}
                };

                foreach (var role in roles)
                {
                    _roleManager.CreateAsync(role).Wait();
                }

                foreach (var user in users)
                {
                    foreach (var photo in user.Photos)
                    {
                        photo.IsApproved = true;
                    }

                    _userManager.CreateAsync(user, "password").Wait();
                    _userManager.AddToRoleAsync(user, RoleTypes.Member).Wait();
                }

                var adminUser = new User {
                    UserName = "Admin"
                };

                IdentityResult result = _userManager.CreateAsync(adminUser, "password").Result;

                if (result.Succeeded)
                {
                    var admin = _userManager.FindByNameAsync("Admin").Result;
                    _userManager.AddToRolesAsync(admin, new []{RoleTypes.Administrator, RoleTypes.Moderator}).Wait();
                }
            }
        }
    }
}