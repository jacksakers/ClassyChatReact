import React, { Component } from 'react';
import '../App.css';
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Input from "./Input";
import { Button } from 'bootstrap';

class Discussions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardClicked: false,
    }
  }

  handleClick() {
    if (this.state.cardClicked)
      this.setState({cardClicked: false});
    else 
      this.setState({cardClicked: true});
  }

  renderContent() {
    if (!this.state.cardClicked) {
      return <>
        <Row>
          <button
                style={{
                  width: "180px",
                  margin: "10px"
                }}
                >Create Discussion</button>
        </Row>
        <Row xs={1} md={1} className="g-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Col>
              <DiscussionCard 
                  college="University of South Carolina" 
                  question="How do you calculate the integral of a function?" 
                  didClick={() => {this.handleClick()}}/>
            </Col>
          ))}
        </Row></>;
    } else {
      return <>
              <button 
                onClick={() => this.handleClick()}
                style={{float: "left", marginRight: "5px"}}
                >Back</button>
              <DiscussionCardExpanded 
                college="University of South Carolina" 
                question="How do you calculate the integral of a function?" 
                />
            </>
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
