import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Select from 'react-select';
import Colleges from "./collegeList";

const aquaticCreatures = [
  { label: 'Shark', value: 'Shark' },
  { label: 'Dolphin', value: 'Dolphin' },
  { label: 'Whale', value: 'Whale' },
  { label: 'Octopus', value: 'Octopus' },
  { label: 'Crab', value: 'Crab' },
  { label: 'Lobster', value: 'Lobster' },
];

const collegeList = Colleges;

function App() {
  return (
    <div className="App">
      <Navbar className='color-nav' variant="dark">
        <Container>
        <Navbar.Brand href="#home">ClassyChat</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="#search">Search</Nav.Link>
          <Nav.Link href="#myclasses">My Classes</Nav.Link>
        </Nav>
        <Navbar.Text>
            Welcome, <a href="#login">jaksak</a>
        </Navbar.Text>
        </Container>
      </Navbar>
      <Container className='main-content'>
        <Row>
          <h2>Choose Your School:</h2>
        </Row>
        <Row>
          <Select
            options={collegeList}
            onChange={opt => console.log(opt)}
            />
        </Row>
      </Container>
    </div>
  );
}

export default App;
