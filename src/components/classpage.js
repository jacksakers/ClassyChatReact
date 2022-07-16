import '../App.css';
import React from "react";
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import ChatBox from './chatbox'
import Discussions from './discussions'
import NotesRepo from './noterepo';
import Container from 'react-bootstrap/esm/Container';


class ClassPage extends React.Component {
  constructor(props) {
    super(props);
    this.classCode = props.classCode;
    this.state = {
      cTab: "Chat",
      inMyClass: false,
      addBtn: "Add to My Classes"
    }
  }

  renderTab(currentTab) {
    switch(currentTab){
      default:
      case "Chat":
        return <ChatBox />;
        break;
      case "Discussion":
        return <Discussions />;
        break;
      case "Notes":
        return <NotesRepo />;
        break;
    }
  }

  render() {
    return (
    <>
      <Button 
      style={{float: "right",marginRight: "10px",backgroundColor: "#006666"}} 
      onClick={() => {
        if (this.state.inMyClass)
          this.setState({inMyClass: false, addBtn: "Add to My Classes"})
        else 
          this.setState({inMyClass: true, addBtn: "Remove from My Classes"})
      }}
      >
        {this.state.addBtn}
      </Button>
      <h1>{this.classCode} <span style={{color: "lightgray"}}>@ University of South Carolina</span></h1>
      <Container style={{maxWidth: "1000px"}}>
      <div>
        <Nav justify variant="tabs" defaultActiveKey="link-1">
            <Nav.Item>
                <Nav.Link 
                  onClick={() => this.setState({ cTab: "Chat" })} 
                  eventKey="link-1">Live Chat</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link onClick={() => this.setState({ cTab: "Discussion" })} eventKey="link-2">Discussions</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link onClick={() => this.setState({ cTab: "Notes" })} eventKey="link-3">Notes Repository</Nav.Link>
            </Nav.Item>
        </Nav>
        
        {this.renderTab(this.state.cTab)}

      </div>
      </Container>
    </>
    )
  }
};

export default ClassPage;