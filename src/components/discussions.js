import React, { Component } from 'react';
import '../App.css';
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Input from "./Input";
import { Button } from 'bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';

class Discussions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "Cards",
      question: "",
      description: ""
    }
  }

  onQChange(e) {
    this.setState({question: e.target.value});
  }

  onDChange(e) {
    this.setState({description: e.target.value});
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.state.question + ": " + this.state.description);
    this.setState({text: ""});
    //this.props.onSendMessage(this.state.text);
  }

  renderContent() {
    switch (this.state.content) {
      default:
      case "Cards":
        return <>
            <Row>
              <button
                    style={{
                      width: "180px",
                      margin: "10px"
                    }}
                    onClick={() => {this.setState({content: "Create"})}}
                    className="login-btn"
                    >Create Discussion</button>
            </Row>
            <div className='scrollDis'>
              <Row xs={1} md={1} className="g-4">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <Col>
                    <DiscussionCard 
                        college="University of South Carolina" 
                        question="How do you calculate the integral of a function?" 
                        didClick={() => {this.setState({content: "Card"})}}/>
                  </Col>
                ))}
              </Row>
            </div>
          </>;
      case "Card":
        return <>
            <button 
              onClick={() => this.setState({content: "Cards"})}
              style={{float: "left", marginRight: "5px"}}
              className="login-btn"
              >Back</button>
            <DiscussionCardExpanded 
              college="University of South Carolina" 
              question="How do you calculate the integral of a function?" 
              />
          </>;
      case "Create":
        return <>
              <button 
                onClick={() => this.setState({content: "Cards"})}
                style={{float: "left", margin: "15px"}}
                className="login-btn"
                >Back</button>
              <Form
                style={{padding: "15px"}}
                onSubmit={e => this.onSubmit(e)}>
                <h2 style={{color: "white", backgroundColor: "#006666", borderRadius: "10px"}}>Create a Discussion:</h2> 
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Question"
                  className="mb-3"
                >
                  <Form.Control 
                  as="textarea" 
                  onChange={e => this.onQChange(e)}
                  placeholder="Leave a comment here"/>
                </FloatingLabel>
                <FloatingLabel controlId="floatingTextarea2" label="Description (optional)">
                  <Form.Control
                    as="textarea"
                    style={{ height: '100px' }}
                    onChange={e => this.onDChange(e)}
                  />
                </FloatingLabel>
                <button 
                  id="send-btn"
                  style={{ marginTop: "10px" }}
                  onClick={() => {console.log("POST THAT!")}}
                  >Post</button>
              </Form>
          </>;
    }
  }

  render() {
    return (
      <>
        <div id='classAreaParent'>
          <div className="disArea">
            {this.renderContent()}
          </div>
        </div>
      </>
    )
  };
}
          
        
function DiscussionCard(props) {
  return (<Card style={{
          textAlign: "left",
          marginBottom: "-5px"
          }}
          onClick={() => {
            props.didClick();
          }}
          id='DCard'>
          <Card.Body>
              <Card.Title>{props.question}</Card.Title>
              
          </Card.Body>
          </Card>
        );
}

function DiscussionCardExpanded(props) {
  return (<>
          <Card style={{
            textAlign: "left"
            }}>
            <Card.Body>
                <Card.Title>{props.question}</Card.Title>
                <Card.Text>
                  This is a description of the question.
                </Card.Text>
                
            </Card.Body>
            <Card.Footer >
              <div style={{textAlign: "right"}}>
                <button id='vote'>^</button>
                <button id='vote'>v</button>
                One comment
              </div>
              <div style={{textAlign: "right"}}>
                <Input text="Post" />
              </div>
            </Card.Footer>
          </Card>
          </>
        );
}

export default Discussions;
