using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using PusherChatApp.WebApi.Models;
using PusherServer;

namespace PusherChatApp.WebApi.Controllers
{
    public class ChatMessage
    {
        public string Text { get; set; }
        public string Username { get; set; }
    }


    [EnableCors("*", "*", "*")]
    public class ChatMessagesController : ApiController
    {

        private static readonly List<ChatMessage> chatMessages = new List<ChatMessage>()
        {
            new ChatMessage {
                Text = "Hello",
                Username = "Alex"
            }
        };

        public IEnumerable<ChatMessage> Get()
        {
            return chatMessages;
        }
         
        public HttpResponseMessage Post(ChatMessageInput messageInput)
        {
            if (messageInput == null || !ModelState.IsValid)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.Accepted,
                    "Invalid input");
            }
            var message = new ChatMessage
            {
                Text = messageInput.Text,
                Username = messageInput.Username
            };
            chatMessages.Add(message);
            var pusher = new Pusher("", "", "");
            pusher.Trigger("messages", "new_message", new
            {
                message.Username,
                message.Text
            });
            return Request.CreateResponse(
                HttpStatusCode.Created,
                message);
        }
    }
}