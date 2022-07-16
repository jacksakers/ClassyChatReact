import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Select from 'react-select';  
import App from "../App";

const collegeList = [
    { label: 'University of South Carolina'},
];

const classList = [
    { label: 'ENGL 101'},
    { label: 'MATH 242'}
]
  

class SearchArea extends React.Component {

  render() {
      return (
          <Container 
            className='main-content'
            style={{maxWidth: "700px"}}>
              <Row>
                <h2>Choose Your School:</h2>
              </Row>
              <Row>
                <Select
                  options={collegeList}
                  onChange={opt => console.log(opt)}
                  />
              </Row>
              <Row>
                <h2 style={{marginTop: "10px"}}>Select Your Class:</h2>
              </Row>
              <Row>
                <Select
                  options={classList}
                  onChange={opt => this.props.chooseClass(opt.label)}
                  />
              </Row>
              <Button 
                id='send-btn' 
                onClick={() => this.props.onPageChange()}
                style={{marginTop: "10px"}}
                >Go To Class</Button>
            </Container>
        );
  }
};
  
export default SearchArea;