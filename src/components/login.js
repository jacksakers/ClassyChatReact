import React, { Component } from 'react';
import '../App.css';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container'
import { auth, registerWithEmailAndPassword, logInWithEmailAndPassword } from "../firebase";

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newUser: false,
      username: "",
      password: "",
      cPassword: ""
    }
  }

  onUChange(e) {
    this.setState({username: e.target.value});
  }

  onPChange(e) {
    this.setState({password: e.target.value});
  }

  onCPChange(e) {
    this.setState({cPassword: e.target.value});
  }

  async onLogInSubmit(e) {
    e.preventDefault();
    let fakeEmail = this.state.username + "@example.com";
    let _password = this.state.password;
    await logInWithEmailAndPassword(fakeEmail, _password);
    if (auth.currentUser)
      this.props.didLogIn(this.state.username);
  }

  async onSignUpSubmit(e) {
    e.preventDefault();
    let fakeEmail = this.state.username + "@example.com";
    let _username = this.state.username;
    let _password = this.state.password;
    if (this.state.password !== this.state.cPassword) {
      alert("Whoops, the passwords do not match!");
      return;
    }
    await registerWithEmailAndPassword(_username, fakeEmail, _password);
    if (auth.currentUser)
      this.props.didLogIn(this.state.username);
  }

  LogInForm() {
    return <><Form
        onSubmit={e => this.onLogInSubmit(e)}
        >
          <div 
          style={{margin: "10px", fontSize: "25px", color: "white"}}
          ><p>Welcome Back to ClassyChat!</p>
          <p style={{fontSize: "18px"}}>Enter Your Info Below to Log In </p> </div>
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
          Log In
      </button>
      </Form>
      <p 
        style={{color: "white", marginTop: "20px", marginBottom: "-10px"}}
        >or you can <button 
                      className='login-btn' 
                      onClick={() => this.setState({newUser: true})}
                      onTouchStart={() => this.setState({newUser: true})}
                      style={{marginBottom: "20px"}}
                      >Sign Up</button></p></>
  }

  SignInForm() {
    return <><Form
        onSubmit={e => this.onSignUpSubmit(e)}
        >
          <div 
          style={{margin: "10px", fontSize: "25px", color: "white"}}
          ><p>Welcome to ClassyChat!</p>
          <p style={{fontSize: "18px"}}>Enter Your Info Below to Sign Up</p> </div>
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
      <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control 
            type="password" 
            placeholder="Confirm Password" 
            onChange={e => this.onCPChange(e)}/>
      </Form.Group>
      <button 
        type="submit" 
        className='login-btn' 
        onClick={() => {console.log("POST THAT!")}}
        >
          Sign Up
      </button>
      </Form>
      <p 
        style={{color: "white", marginTop: "20px", marginBottom: "-10px"}}
        >or you can <button 
                      className='login-btn' 
                      onClick={() => this.setState({newUser: false})}
                      onTouchStart={() => this.setState({newUser: false})}
                      style={{marginBottom: "20px"}}
                      >Log In</button></p></>
  }

  renderForm() {
    if (!this.state.newUser) {
      return this.LogInForm();
    } else {
      return this.SignInForm();
    }
  }
  
  render() {
    return (
      <><Container style={{maxWidth: "500px"}}>
          <Card
          style={{padding: "10px", backgroundColor: "#006666"}}>
            {this.renderForm()}
          </Card>
        </Container>
      </>
    );
  }; 
}

export default LogIn;
