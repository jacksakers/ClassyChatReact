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

class App extends React.Component {
  chosenClass = "NULL";
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "Search",
    }
  }
  renderContent() {
    switch(this.state.currentPage) {
      case "Search":
        return <SearchArea 
                onPageChange={() => this.setState({ currentPage: "ClassPage" })}
                chooseClass={(value) => this.chosenClass = value} />;
      case "MyClasses":
        return <MyClasses />;
      case "ClassPage":
        return <ClassPage classCode={this.chosenClass} />;
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
              Welcome, <a href="#login">jaksak</a>
          </Navbar.Text>
          </Container>
        </Navbar>
        {this.renderContent()}
      </div>
    );
  }

  
}

export default App;