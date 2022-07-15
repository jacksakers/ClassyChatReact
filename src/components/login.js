import React, { Component } from 'react';
import '../App.css';
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    }
  }

  onUChange(e) {
    this.setState({username: e.target.value});
  }

  onPChange(e) {
    this.setState({password: e.target.value});
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.state.username);
  }

  render() {
    return (
      <><Container>
          <Card
          style={{padding: "10px", backgroundColor: "#006666"}}>
          <Form
            onSubmit={e => this.onSubmit(e)}
            >
              <div 
              style={{margin: "10px", fontSize: "25px", color: "white"}}
              ><p>Welcome to ClassyChat!</p>
              <p style={{fontSize: "18px"}}>Enter your info below to either log in if you have and account or sign up if you don't!</p> </div>
          <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control 
                  aria-label="Username"
                  aria-describedby="basic-addon1" 
                  placeholder="Username" 
                  onChange={e => this.onUChange(e)}/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control 
                type="password" 
                placeholder="Password" 
                onChange={e => this.onPChange(e)}/>
          </Form.Group>
          <button 
            type="submit" 
            className='login-btn' 
            onClick={() => {console.log("POST THAT!")}}
            >
              Log In / Sign Up
          </button>
          </Form>
          </Card>
        </Container>
      </>
    );
  };
}      

export default LogIn;
