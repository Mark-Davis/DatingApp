using System;
using System.Linq;
using AutoMapper;
using DatingApp.API.DTOs;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>()
                .ForMember(u => u.PhotoUrl,
                 opt => {opt.MapFrom(u => u.Photos.FirstOrDefault(p => p.IsMain).Url);})
                .ForMember(u => u.Age,
                    opt => {opt.ResolveUsing(d => d.DateOfBirth.CalculateAge());});
            CreateMap<User, UserForDetailedDto>()
                .ForMember(u => u.PhotoUrl,
                    opt => {opt.MapFrom(u => u.Photos.FirstOrDefault(p => p.IsMain).Url);})
                .ForMember(u => u.Age,
                    opt => {opt.ResolveUsing(d => d.DateOfBirth.CalculateAge());});
            CreateMap<UserForUpdatesDto, User>();
            CreateMap<RegisterUserDto, User>();

            CreateMap<PhotoForCreationDto, Photo>();
            CreateMap<Photo, PhotoForDetailedDto>();
            CreateMap<Photo, PhotoForReturnDto>();

            CreateMap<MessageForCreationDto, Message>();
            CreateMap<Message, MessageToReturnDto>()
                .ForMember(m => m.SenderPhotoUrl,
                    opt => {opt.MapFrom(m => m.Sender.Photos.FirstOrDefault(p => p.IsMain).Url);})
                .ForMember(m => m.RecipientPhotoUrl,
                    opt => {opt.MapFrom(m => m.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url);});
        }
    }
}