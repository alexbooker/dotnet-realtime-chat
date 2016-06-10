import ReactDom from "react-dom";
import React from "react";
import axios from "axios"
import Pusher from "pusher-js"

const ChatInputForm = ({onSubmit}) => {
    let usernameInput;
    let messageInput;
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
                username: usernameInput.value,
                message: messageInput.value
            });
            messageInput.value = "";
        }}>
            <input type="text" placeholder="username" ref={node => {
                usernameInput = node;
            }} />
            <input type="text" placeholder="message" ref={node => {
                messageInput = node;
            }}/>
            <input type="submit" value="Send" />
        </form>
    );
}
const ChatMessage = ({message, username}) => (
    <li><strong>{username} says:</strong> {message}</li>
);

const ChatMessages = ({messages}) => (
    <ul>
        {messages.map((message) => 
            <ChatMessage message={message.Text} username={message.Username} />)}
    </ul>
);

const Chat = React.createClass({
    getInitialState () {
        return {
            messages: []
        }
    },

    componentDidMount () {
        this.pusher = new Pusher("d55447385c490cb7e41a");
        this.channel = this.pusher.subscribe("messages");
        this.channel.bind("new_message",
            message => {
                console.log("Pusher message", message);
                this.setState({
                    messages: this.state.messages.concat(message)
                });
            });
        axios
            .get("http://localhost:3000/api/ChatMessages")
            .then(({data}) => {
                this.setState({
                    messages: this.state.messages.concat(data)
                });
                console.log("axios.get returned", this.state.messages);
            })
            .catch(err => {
                console.log("error", err);
            });
    },

    onSubmit (message) {
        axios
            .post("http://localhost:3000/api/ChatMessages", {
                Username: message.username,
                Text: message.message
            })
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            });
        console.log(message);
    },
     
    render () {
        console.log(this.state.messages);
        return (
            <div>
                <h1>Realtime Chat</h1>
                <ChatMessages messages={this.state.messages} />
                <ChatInputForm onSubmit={this.onSubmit} />
            </div>
        );
    }
});
 
ReactDom.render(
    <Chat />,
    document.getElementById("root"))