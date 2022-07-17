import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Select from 'react-select';  
import CreatableSelect from 'react-select/creatable';
import { ActionMeta, OnChangeValue } from 'react-select';
import App from "../App";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { collection, query, where, getDocs, setDoc } from "firebase/firestore";

const collegeRef = collection(db, "colleges");
const collegeQ = query(collegeRef);
const classRef = collection(db, "classes");

class SearchArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classDisabled: true,
      collegeList: [],
      classList: [],
      chosenCollege: "NULL",
      chosenClass: "NULL",
      buttonDisabled: true
    }
  }

  async getCollege() {
    const querySnapshot = await getDocs(collegeQ);
    console.log(this.state.collegeList);
    this.state.collegeList = [];
    let newList = [];
    querySnapshot.forEach((doc) => {
      newList.push({label: doc.id});
      console.log(doc.id);
    });
    this.setState({collegeList: newList})
  }

  async getClasses(college) {
    const classQ = query(classRef, where("school", "==", college));
    const querySnapshot = await getDocs(classQ);
    this.state.classList = [];
    querySnapshot.forEach((doc) => {
      let justClass = doc.id.split(" @");
      this.state.classList.push({label: justClass[0]});
      console.log("CLASSES:" + doc.id);
    });
  }

  async handleCollegeChoose(college) {
    if (college.__isNew__) {
      await setDoc(doc(db, "colleges", college.label), {founding: 1801});
      this.setState({classDisabled: false, 
                    chosenCollege: college.label});
    } else {
      await this.getClasses(college.label);
      this.setState({classDisabled: false, 
                    chosenCollege: college.label});
    };
    if (this.state.chosenClass !== "NULL") {
      this.setState({chosenClass: "NULL", buttonDisabled: true})
    }
  }

  async handleClassChoose(_class) {
    if (_class.__isNew__) {
      let classCode = (_class.label + " @ " + this.state.chosenCollege)
      await setDoc(doc(db, "classes", classCode), 
                  {school: this.state.chosenCollege,
                  className: _class.label});
      this.props.passClass({school: this.state.chosenCollege, class: _class.label});
      this.setState({chosenClass: _class.label, buttonDisabled: false});
    } else {
      this.props.passClass({school: this.state.chosenCollege, class: _class.label});
      this.setState({chosenClass: _class.label, buttonDisabled: false});
    };
  }

  render() {
      return (
          <Container 
            className='main-content'
            style={{maxWidth: "700px"}}>
              <Row>
                <h2>Choose Your School:</h2>
              </Row>
              <Row>
                <div onClick={() => this.getCollege()}>
                <CreatableSelect
                  options={this.state.collegeList}
                  onChange={opt => this.handleCollegeChoose(opt)}
                  />
                  </div>
              </Row>
              <Row>
                <h2 style={{marginTop: "10px"}}>Select Your Class:</h2>
              </Row>
              <Row>
                <CreatableSelect
                  options={this.state.classList}
                  onChange={opt => this.handleClassChoose(opt)}
                  isDisabled={this.state.classDisabled}
                  />
              </Row>
              <Button 
                id='send-btn' 
                onClick={() => this.props.onPageChange()}
                style={{marginTop: "10px"}}
                disabled={this.state.buttonDisabled}
                >Go To Class</Button>
                <Row style={{marginTop: "30px"}}>
                  <h3>If you do not find your school and/or your class, add it by typing it in and clicking 'Create'.</h3>
                </Row>
            </Container>
        );
  }
};
  
export default SearchArea;