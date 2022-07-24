import '../App.css';
import React from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { auth } from "../firebase";

class MyClasses extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      displayArray: []
    }
  }

  renderMyClasses() {
    if (this.state.displayArray.length === 0) {
      this.setState({displayArray: this.props.arrayToDisplay})
    }
  }

  render() {
    if (auth.currentUser != null) {
      return (
        <>
          <h1>My Classes:</h1>
          <Container style={{maxWidth: "900px"}}>
          <div id='classAreaParent'>
            <div className="classArea">
              <div className='scrollLonger'>
              <Row xs={1} md={1} className="g-4">
                {this.props.arrayToDisplay}
              </Row>
              </div>
            </div>
          </div>
          </Container>
        </>
      );
    } else {
      return (<h1>You have to <button 
                                onClick={() => this.props.goToLogIn()}
                                className='login-btn'
                                >Log In</button> to view your classes.</h1>);
    }
  }

};

export default MyClasses;