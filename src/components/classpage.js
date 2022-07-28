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
import { arrayUnion, arrayRemove, updateDoc } from "firebase/firestore";

class ClassPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cTab: "Chat",
      inMyClass: false,
      addBtn: "Add",
      currentClass: this.props.currentClass.class,
      currentSchool: this.props.currentClass.school,
      classCode: (this.props.currentClass.class + " @ " + this.props.currentClass.school)
    }
    this.gotDiscussions = [];
    this.gotNotes = [];
    this.gotQIDs = [];
    this.btnDisabled = !this.props.isLoggedIn;
  }

  async getDiscussions() {
    const disRef = doc(db, "discussions", this.state.classCode);
    const disSnap = await getDoc(disRef);
    console.log("Getting Discussions");
    let qArray = disSnap.data().qNames;
    this.gotDiscussions = qArray;
    return qArray;
  }

  async getNotes() {
    const notRef = doc(db, "notes repo", this.state.classCode);
    const notSnap = await getDoc(notRef);
    console.log("Getting Notes..");
    let nArray = notSnap.data().nNames;
    this.gotNotes = nArray;
    return nArray;
  }

  renderTab(currentTab) {
    
    switch(currentTab){
      default:
      case "Chat":
        return <ChatBox classCode={this.state.classCode}
                          username={this.props.username}/>;
      case "Discussion":
        return <Discussions qNames={this.gotDiscussions} 
                              classCode={this.state.classCode}
                              username={this.props.username}/>;
      case "Notes":
        return <NotesRepo nNames={this.gotNotes}
                          classCode={this.state.classCode}
                          username={this.props.username}/>;
    }
  }

  async checkIfInMyClasses() {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    console.log("Checked if in myclasses...");
    let _MyClasses = userSnap.data().MyClasses;
    if (userSnap.exists()) {
      for (let i in _MyClasses) {
        if (_MyClasses[i] === this.state.classCode) {
          this.setState({inMyClass: true, addBtn: "Remove"});
        }
      }
    }
  }

  first = false;

  async componentDidMount() {
    if (auth.currentUser != null) {
      this.checkIfInMyClasses();
      this.btnDisabled = false;
    }
    if (!this.first) {
      this.first = true;
      this.gotDiscussions = await this.getDiscussions();
      this.gotNotes = await this.getNotes();}
  }

  async changeMyClass() {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const classRef = doc(db, "classes", this.state.classCode);
    if (this.state.inMyClass) {
      await updateDoc(userRef, {
          MyClasses: arrayRemove(this.state.classCode)
      });
      const classSnap = await getDoc(classRef);
      let oldNum = 0;
      if (classSnap.exists()) {
        oldNum = classSnap.data().numOfStudents;
      }
      await updateDoc(classRef, {
        numOfStudents: (oldNum - 1)
      });
      this.setState({inMyClass: false, addBtn: "Add"});
    } else {
      await updateDoc(userRef, {
        MyClasses: arrayUnion(this.state.classCode)
      });
      const classSnap = await getDoc(classRef);
      let oldNum = 0;
      if (classSnap.exists()) {
        oldNum = classSnap.data().numOfStudents;
      }
      await updateDoc(classRef, {
        numOfStudents: (oldNum + 1)
      });
      this.setState({inMyClass: true, addBtn: "Remove"});
    }
    
  }

  render() {
    return (
    <>
      <Button 
        style={{float: "right",marginRight: "10px",backgroundColor: "#006666"}} 
        onClick={() => this.changeMyClass()}
        id='addToClass'
        disabled={this.btnDisabled}>
        {this.state.addBtn}
      </Button>
      <h1>{this.state.currentClass}</h1>  
      <h1><span style={{color: "lightgray"}}>@ {this.state.currentSchool}</span></h1>
      <Container style={{maxWidth: "1000px"}}>
      <div>
        <Nav justify variant="tabs" defaultActiveKey="link-1">
            <Nav.Item>
                <Nav.Link 
                  onClick={() => this.setState({ cTab: "Chat" })} 
                  eventKey="link-1">Live Chat</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link onClick={async () => {this.setState({ cTab: "Discussion" });
                                          await this.getDiscussions();}} eventKey="link-2">Discussions</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link onClick={async () => {this.setState({ cTab: "Notes" });
                                          this.gotNotes = await this.getNotes();}} eventKey="link-3">Notes Repository</Nav.Link>
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