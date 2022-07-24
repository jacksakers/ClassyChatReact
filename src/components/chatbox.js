import React, { Component } from 'react';
import '../App.css';
import Messages from "./Messages";
import Input from "./Input";
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { getDatabase, ref, onValue, set, push } from "firebase/database";

class ChatBox extends Component {
    constructor(props) {
      super(props);
      this.state = {
        messages: [{
              text: "New message",
              member: {
                color: "blue",
                username: "jaksak"
              }
            }],
        member: {
          username: this.props.username,
          color: "red",
        },
      }
    }

    messages = [];
    messagesEnd = null;
    
    componentDidMount() {
      this.getChats();
    }

    getChats() {
      const db = getDatabase();
      const messageRef = ref(db, this.props.classCode);
      let newMArray = [];
      onValue(messageRef, (snapshot) => {
        newMArray = [];
        for (const key in snapshot.val()) {
          let newMessage = snapshot.val()[key].message;
          let theUser = snapshot.val()[key].username;
          newMArray.push({
            text: newMessage,
            member: {
              color: "blue",
              username: theUser
            }
          });
        }
        this.setState({messages: newMArray});
      });
    }

    sendMessage(value) {
      const db = getDatabase();
      const postListRef = ref(db, this.props.classCode);
      const newPostRef = push(postListRef);
      set(newPostRef, {
        username: this.props.username,
        message: value
      });
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
              />
            </div>
          </Row>
          <Row>
            <Input text="Send" onSendMessage={(value) => this.sendMessage(value)} />
          </Row>
          </Col>
        </>
      );
    }
}

export default ChatBox;
