import '../App.css';
import React from "react";
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import ChatBox from './chatbox'
import Discussions from './discussions'
import NotesRepo from './noterepo';
import Container from 'react-bootstrap/esm/Container';
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, setDoc } from "firebase/firestore";

class ClassPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cTab: "Chat",
      inMyClass: false,
      addBtn: "Add to My Classes",
      currentClass: this.props.currentClass.class,
      currentSchool: this.props.currentClass.school,
      classCode: (this.props.currentClass.class + " @ " + this.props.currentClass.school)
    }
  }

  renderTab(currentTab) {
    switch(currentTab){
      default:
      case "Chat":
        return <ChatBox />;
      case "Discussion":
        return <Discussions />;
      case "Notes":
        return <NotesRepo />;
    }
  }

  async checkIfInMyClasses() {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    console.log("READ HAPPENED");
    let _MyClasses = userSnap.data().MyClasses;
    if (userSnap.exists()) {
      for (let i in _MyClasses) {
        if (_MyClasses[i] === this.state.classCode) {
          this.setState({inMyClass: true, addBtn: "Remove from My Classes"});
        }
      }
    }
  }

  componentDidMount() {
    if (auth.currentUser != null)
      this.checkIfInMyClasses();
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
      <h1>{this.state.currentClass} <span style={{color: "lightgray"}}>@ {this.state.currentSchool}</span></h1>
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