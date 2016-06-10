using System.ComponentModel.DataAnnotations;

namespace PusherChatApp.WebApi.Models
{
    public class ChatMessageInput
    {
        [Required]
        public string Text { get; set; }
         
        [Required]
        public string Username { get; set; }
    }
}