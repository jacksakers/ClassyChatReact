import React, { Component } from 'react';
import '../App.css';
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

class NotesRepo extends Component {
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
                  width: "150px",
                  margin: "10px"
                }}
                >Upload Notes</button>
        </Row>
        <Row xs={1} md={1} className="g-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Col>
              <NotesCard 
                  title="Chapter 10 Notes"
                  didClick={() => this.handleClick()}/>
            </Col>
          ))}
        </Row></>;
    } else {
      return <>
              <button 
                onClick={() => this.handleClick()}
                style={{float: "left", marginRight: "5px"}}
                >Back</button>
              <NotesCardExpanded 
                    title="Chapter 10 Notes"
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
