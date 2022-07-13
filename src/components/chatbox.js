import React, { Component } from 'react';
import '../App.css';
import Messages from "./Messages";
import Input from "./Input";

class ChatBox extends Component {
    constructor(props) {
      super(props);
      this.state = {
        messages: [
          {
            text: "This is a test message!",
            member: {
              color: "blue",
              username: "bluemoon"
            }
          },
          {
            text: "hehehe",
            member: {
              color: "blue",
              username: "jaksak"
            }
          },
        ],
        member: {
          username: "jaksak",
          color: "red",
        }
      }
    }

    render() {
      return (
        <>
          <Messages
            messages={this.state.messages}
            currentMember={this.state.member}
          />
          <Input text="Send" />
        </>
      );
    }
}

export default ChatBox;
