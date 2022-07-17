import '../App.css';
import React, { Component } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, setDoc } from "firebase/firestore";


let myColArray = [];

class MyClasses extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      updated: false,
      displayArray: []
    }
  }

  async getMyClasses() {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    let _MyClasses = userSnap.data().MyClasses;
    if (userSnap.exists()) {
      for (let i in _MyClasses) {
        let splitArray = _MyClasses[i].split(" @ ");
        let justClass = splitArray[0];
        let justSchool = splitArray[1];
        myColArray.push(<Col>
                          <ClassCard 
                            college= {justSchool}
                            classCode= {justClass}
                            passClass= {() => this.props.passClass({school: justSchool, class: justClass})}/>
                        </Col>)
      }
    }
    console.log(myColArray);
  }

  async updateClasses() {
    console.log("UPDATING CLASSES")
    myColArray = [];
    await this.getMyClasses();
    this.setState({updated: true, displayArray: myColArray});
  }

  render() {
    if (auth.currentUser != null) {
      return (
        <>
          <h1>My Classes:</h1>
          <Container style={{maxWidth: "900px"}}>
          <div id='classAreaParent'>
            <div className="classArea">
            <Row xs={1} md={1} className="g-4">
              {this.state.displayArray}
            </Row>
            <button onClick={() => this.updateClasses()}>GET CLASSES</button>
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
  

function ClassCard(props) {
  return (<Card style={{
            textAlign: "left"
            }}
            id='DCard'
            onClick={() => props.passClass()}>
            <Card.Header>{props.college}</Card.Header>
            <Card.Body>
              <Card.Title>{props.classCode}</Card.Title>
            </Card.Body>
            <Card.Footer className="text-muted">5 Unread Messages</Card.Footer>
          </Card>);
}

export default MyClasses;