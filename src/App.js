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
import { logout } from './firebase';

class App extends React.Component {
  chosenClass = "NULL";
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "Search",
      isLoggedIn: false,
      username: "GUEST"
    }
  }

  handleClassClick() {
    this.setState({currentPage: "ClassPage"})
  }

  handleLogIn(uName) {
    this.setState({isLoggedIn: true, username: uName})
  }

  renderContent() {
    switch(this.state.currentPage) {
      case "Search":
        return <SearchArea 
                onPageChange={() => this.setState({ currentPage: "ClassPage" })}
                passClass={(value) => this.chosenClass = value.class} />;
      case "MyClasses":
        return <MyClasses 
                  handleClassClick={() => this.handleClassClick()}
                  goToLogIn={() => this.setState({currentPage: "LogIn"})}/>;
      case "ClassPage":
        return <ClassPage classCode={this.chosenClass} />;
      case "LogIn":
        if (!this.state.isLoggedIn) {
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
            <Nav.Link onClick={() => this.setState({currentPage: "MyClasses"})}>My Classes</Nav.Link>
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