import React, { Component } from 'react';
import '../App.css';
import Messages from "./Messages";
import Input from "./Input";
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';

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
          {
            text: "hehehe",
            member: {
              color: "blue",
              username: "jaksak"
            }
          },
          {
            text: "hehehe",
            member: {
              color: "blue",
              username: "jaksak"
            }
          },
          {
            text: "hehehe",
            member: {
              color: "blue",
              username: "jaksak"
            }
          },
          {
            text: "hehehe",
            member: {
              color: "blue",
              username: "jaksak"
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
        },
      }
    }

    messagesEnd = null;

    scrollToBottom = () => {
      this.messagesEnd.scrollIntoView();
    }
    
    componentDidMount() {
      this.scrollToBottom();
    }

    setMessageEnd(element) {
      this.messagesEnd = element;
    }

    render() {
      return (
        <>
          <Col>
          <Row>
            <div className='scroll'>
              <Messages
                messages={this.state.messages}
                currentMember={this.state.member}
                messagesEnd={(element) => this.setMessageEnd(element)}
              />
            </div>
          </Row>
          <Row>
            <Input text="Send" />
          </Row>
          </Col>
        </>
      );
    }
}

export default ChatBox;
