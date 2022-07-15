import React, { Component } from 'react';
import '../App.css';
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

class NotesRepo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "Notes",
      title: ""
    }
  }

  onChange(e) {
    this.setState({title: e.target.value});
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.state.title);
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
                width: "150px",
                margin: "10px"
              }}
              onClick={() => this.setState({content: "Create"})}
              className="login-btn"
              >Upload Notes</button>
          </Row>
          <Row xs={1} md={1} className="g-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Col>
                <NotesCard 
                    title="Chapter 10 Notes"
                    didClick={() => this.setState({content: "Card"})}/>
              </Col>
            ))}
          </Row></>;
      case "Card":
        return <>
          <button 
            onClick={() => this.setState({content: "Cards"})}
            style={{float: "left", marginRight: "5px"}}
            className="login-btn"
            >Back</button>
          <NotesCardExpanded 
                title="Chapter 10 Notes"
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
            <h2 
              style={{color: "white", backgroundColor: "#006666", borderRadius: "10px"}}
              >Upload Notes:</h2> 
            <FloatingLabel
              controlId="floatingTextarea"
              label="Title"
              className="mb-3"
            >
              <Form.Control 
              as="textarea" 
              onChange={e => this.onChange(e)}
              placeholder="Leave a comment here"/>
            </FloatingLabel>
            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Control type="file" multiple />
            </Form.Group>
            <button 
              id="send-btn"
              onClick={() => {console.log("Upload THAT!")}}
              >Upload</button>
          </Form>
        </>;
    }
  }

  render() {
    return (
      <>
        <div id='classAreaParent'>
          <div className="classArea">
            {this.renderContent()}
          </div>
        </div>
      </>
    )
  };
}
          
        
function NotesCard(props) {
  return (<Card style={{
          textAlign: "left",
          marginBottom: "-5px"
          }}
          onClick={() => props.didClick()}
          id='DCard'>
          <Card.Body>
              <Card.Title>{props.title}</Card.Title>
              
          </Card.Body>
          </Card>
        );
}

function NotesCardExpanded(props) {
  return (<Card style={{
          textAlign: "left"
          }}>
          <Card.Body>
              <Card.Title>{props.title}</Card.Title>
          </Card.Body>
          </Card>
        );
}
        

export default NotesRepo;
