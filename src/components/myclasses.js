import '../App.css';
import React from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { auth } from '../firebase';
  
const MyClasses = (props) => {
  if (auth.currentUser != null) {
    return (
      <>
        <h1>My Classes:</h1>
        <Container style={{maxWidth: "900px"}}>
        <div id='classAreaParent'>
          <div className="classArea">
          <Row xs={1} md={1} className="g-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Col>
                <ClassCard 
                  college="University of South Carolina" 
                  classCode="ENGL 101" 
                  didClick={() => props.handleClassClick()}/>
              </Col>
            ))}
          </Row>
          </div>
        </div>
        </Container>
      </>
    );
  } else {
    return (<h1>You have to <button 
                              onClick={() => props.goToLogIn()}
                              className='login-btn'
                              >Log In</button> to view your classes.</h1>);
  }

};
  

function ClassCard(props) {
  return (<Card style={{
            textAlign: "left"
            }}
            id='DCard'
            onClick={() => props.didClick()}>
            <Card.Header>{props.college}</Card.Header>
            <Card.Body>
              <Card.Title>{props.classCode}</Card.Title>
            </Card.Body>
            <Card.Footer className="text-muted">5 Unread Messages</Card.Footer>
          </Card>);
}

export default MyClasses;