import {Component} from "react";
import React from "react";
import '../App.css';
import { auth } from "../firebase";


class Input extends Component {
  constructor(props) {
    super(props);
    if (auth.currentUser !== null) {
      this.btnDisabled = false;
    } else {
      this.btnDisabled = true;
    }
  }

  state = {
    text: ""
  }

  onChange(e) {
    this.setState({text: e.target.value});
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.state.text);
    this.setState({text: ""});
    this.props.onSendMessage(this.state.text);
  }

  render() {
    return (
      <div className="Input">
        <form onSubmit={e => this.onSubmit(e)}>
          <input
            onChange={e => this.onChange(e)}
            value={this.state.text}
            type="text"
            placeholder="Enter your message"
            autofocus="true"
            style={{margin: "10px"}}
          />
          <button id="send-btn" disabled={this.btnDisabled}>{this.props.text}</button>
        </form>
      </div>
    );
  }
}

export default Input;