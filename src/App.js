import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchArea from "./components/search";
import MyClasses from "./components/myclasses";
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import React from 'react';
import ClassPage from './components/classpage';
import LogIn from './components/login';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card'
import { db, auth, logout } from './firebase';
import { doc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs, setDoc } from "firebase/firestore";

let myColArray = [];

function ClassCard(props) {
  let plural = "";
  if (props.numOfStudents == 1) {
    plural = "Student";
  } else {
    plural = "Students";
  }
  return (<Card style={{
            textAlign: "left"
            }}
            id='DCard'
            onClick={() => props.passClass()}>
            <Card.Header>{props.college}</Card.Header>
            <Card.Body>
              <Card.Title>{props.classCode}</Card.Title>
            </Card.Body>
            <Card.Footer className="text-muted">{props.numOfStudents} {plural}</Card.Footer>
          </Card>);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "Search",
      isLoggedIn: false,
      username: "GUEST",
    }
    this.chosenClass = "NULL";
    this.displayArray = [];
    this.chosenSchool = "NULL";
  }

  async getUserName() {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.setState({username: docSnap.data().name, isLoggedIn: true})
    }
  }

  async getMyClasses() {
    if (auth.currentUser != null) {
      myColArray = [];
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      let _MyClasses = userSnap.data().MyClasses;
      if (userSnap.exists() && myColArray.length === 0) {
        for (let i in _MyClasses) {
          let splitArray = _MyClasses[i].split(" @ ");
          let justClass = splitArray[0];
          let justSchool = splitArray[1];
          const classRef = doc(db, "classes", _MyClasses[i]);
          const classSnap = await getDoc(classRef);
          console.log("Got Number of Students in " + _MyClasses[i])
          let numStudents = classSnap.data().numOfStudents;
          myColArray.push(<Col>
                            <ClassCard 
                              college= {justSchool}
                              classCode= {justClass}
                              passClass= {() => {this.setState({currentPage: "ClassPage"});
                                                this.chosenClass = justClass;
                                                this.chosenSchool = justSchool;}}
                              numOfStudents= {numStudents}/>
                          </Col>)
        }
      }
      this.displayArray = myColArray;
    }
  }

  componentDidUpdate() {
    if (auth.currentUser != null) {
      if (this.state.username === "GUEST") {
        this.getUserName();
      }
    }
  }

  handleLogIn(uName) {
    this.setState({isLoggedIn: true, username: uName})
  }

  renderContent() {
    switch(this.state.currentPage) {
      case "Search":
        return <SearchArea 
                onPageChange={() => this.setState({ currentPage: "ClassPage" })}
                passClass={(value) => {this.chosenClass = value.class;
                                        this.chosenSchool = value.school;}} />;
      case "MyClasses":
        return <MyClasses 
                  // passClass={(value) => {this.chosenClass = value.class;
                  //                       this.chosenSchool = value.school;
                  //                       this.setState({ currentPage: "ClassPage" });}}
                  goToLogIn={() => this.setState({currentPage: "LogIn"})}
                  arrayToDisplay={this.displayArray}/>;
      case "ClassPage":
        return <ClassPage currentClass={{school: this.chosenSchool, class: this.chosenClass}} 
                          username={this.state.username}/>;
      case "LogIn":
        if (!auth.currentUser) {
          return <LogIn didLogIn={(uName) => this.handleLogIn(uName)}/>;
        } else {
          return <><h2>Hey {this.state.username}, You Are Logged In!</h2> 
            <button 
              className='login-btn'
              onClick={() => {
                this.setState({isLoggedIn: false, username: "GUEST"});
                logout();
              }}
              >Log Out</button></>;
        }
      default:
        return <SearchArea />;
    }
  }
  render() {
    return (
      <div className="App">
        <Navbar className='color-nav' variant="dark">
          <Container>
          <Navbar.Brand onClick={() => this.setState({currentPage: "Search"})}>ClassyChat</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() => this.setState({currentPage: "Search"})}>Search</Nav.Link>
            <Nav.Link onClick={() => {this.setState({currentPage: "MyClasses"});
                                      this.getMyClasses();}}>My Classes</Nav.Link>
          </Nav>
          <Navbar.Text>
              Welcome, <span
                        onClick={() => this.setState({currentPage: "LogIn"})}
                        style={{color: "white"}}
                        id='loginlink'
                        >{this.state.username}</span>
          </Navbar.Text>
          </Container>
        </Navbar>
        {this.renderContent()}
      </div>
    );
  }

  
}

export default App;