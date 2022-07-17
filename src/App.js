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
import { db, auth, logout } from './firebase';
import { doc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs, setDoc } from "firebase/firestore";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "Search",
      isLoggedIn: false,
      username: "GUEST",
    }
    this.chosenClass = "NULL";
    this.chosenSchool = "NULL";
  }

  async getUserName() {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.setState({username: docSnap.data().name, isLoggedIn: true})
      console.log("CURRENT USERNAME: " + docSnap.data().name)
    }
  }

  componentDidUpdate() {
    if (auth.currentUser != null) {
      if (this.state.username === "GUEST") {
        this.getUserName();
      }
    }
    console.log("UPDATED")
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
                  passClass={(value) => {this.chosenClass = value.class;
                                        this.chosenSchool = value.school;
                                        this.setState({ currentPage: "ClassPage" });}}
                  goToLogIn={() => this.setState({currentPage: "LogIn"})}/>;
      case "ClassPage":
        return <ClassPage currentClass={{school: this.chosenSchool, class: this.chosenClass}} />;
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
            <Nav.Link onClick={() => {this.setState({currentPage: "MyClasses"})}}>My Classes</Nav.Link>
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