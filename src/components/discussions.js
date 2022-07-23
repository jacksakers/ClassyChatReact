import React, { Component } from 'react';
import '../App.css';
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Input from "./Input";
import { Button } from 'bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';
import { doc, getDoc, addDoc, collection, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { db } from '../firebase';


class Discussions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "Cards",
      question: "",
      description: "",
      qCards: [],
      qExpanded: {},
      disCommentArray: [],
    }
  }

  onQChange(e) {
    this.setState({question: e.target.value});
  }

  onDChange(e) {
    this.setState({description: e.target.value});
  }

  async getAnswers(docID) {
    const qRef = doc(db, "discussions", this.props.classCode, "questions", docID);
    const qSnap = await getDoc(qRef);
    console.log("Getting expanded questions");
    let qdescription = qSnap.data().description;
    let qposter = qSnap.data().poster;
    let qtitle = qSnap.data().title;
    let qObj = {title: qtitle,
                poster: qposter,
                description: qdescription,
                docID: docID};
    let aArray = qSnap.data().aArray;
    let _disCommentArray = [];
    if (aArray !== undefined) {
      aArray.sort((a, b) => {
                    console.log(a.split(" #-# ")[2] + " and " + b.split(" #-# ")[2]);
                    return b.split(" #-# ")[2] - a.split(" #-# ")[2];})
      console.log(aArray);
      for (let i in aArray) {
          _disCommentArray.push(
            <DisComment answer={ aArray[i].split(" #-# ")[0]}
              poster= {aArray[i].split(" #-# ")[1]}
              score= {aArray[i].split(" #-# ")[2]}/>
          )
      }
    }
    console.log(_disCommentArray);
    this.setState({qExpanded: qObj, disCommentArray: _disCommentArray});
  }

  async updateDiscussions() {
    const disRef = doc(db, "discussions", this.props.classCode);
    const disSnap = await getDoc(disRef);
    console.log("Getting Discussions");
    let qNames = disSnap.data().qNames;
    let qArray = [];
    for (let i in qNames) {
      qArray.push(<Col>
            <DiscussionCard 
            college="University of South Carolina" 
            question={qNames[i].split(" #-# ")[0]}
            didClick={() => {this.setState({content: "Card"});
                              this.getAnswers(qNames[i].split(" #-# ")[1]);}}/>
          </Col>);
    }
    this.setState({qCards: qArray});
  }

  async postDiscussion(qObj) {
    const docRef = await addDoc(collection(db, "discussions", this.props.classCode, "questions"), 
    qObj);
    await updateDoc(doc(db, "discussions", this.props.classCode), {
      qNames: arrayUnion(qObj.title + " #-# " + docRef.id)
    });
    this.updateDiscussions();
  }

  componentDidMount() {
    this.getQNames();
  }

  getQNames() {
    let qArray = [];
    for (let i in this.props.qNames) {
      qArray.push(<Col>
            <DiscussionCard 
            college="University of South Carolina" 
            question={this.props.qNames[i].split(" #-# ")[0]}
            didClick={() => {this.setState({content: "Card"});
                              this.getAnswers(this.props.qNames[i].split(" #-# ")[1]);}}/>
          </Col>);
    }
    this.setState({qCards: qArray});
    return qArray;
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.state.question + ": " + this.state.description);
    let qObj = {title: this.state.question,
      poster: this.props.username,
      description: this.state.description};
    this.postDiscussion(qObj);
    let newQs = this.getQNames();
    this.setState({content: "Cards", question: "", description: "", qCards: newQs});
  }

  renderContent() {
    switch (this.state.content) {
      default:
      case "Cards":
        return <>
            <Row>
              <button
                    style={{
                      width: "180px",
                      margin: "10px"
                    }}
                    onClick={() => {this.setState({content: "Create"})}}
                    className="login-btn"
                    >Create Discussion</button>
            </Row>
            <div className='scrollDis'>
              <Row xs={1} md={1} className="g-4">
                {this.state.qCards}
              </Row>
            </div>
          </>;
      case "Card":
        return <>
            <button 
              onClick={() => {this.updateDiscussions();
                              this.setState({content: "Cards"});}}
              style={{float: "left", marginRight: "5px"}}
              className="login-btn"
              >Back</button>
            <DiscussionCardExpanded 
              question={this.state.qExpanded.title}
              poster={this.state.qExpanded.poster}
              description={this.state.qExpanded.description} 
              disCommentArray= {this.state.disCommentArray}
              username={this.props.username}
              classCode={this.props.classCode}
              docID={this.state.qExpanded.docID}
              updateAnswers={() => this.getAnswers(this.state.qExpanded.docID)}
              />
          </>;
      case "Create":
        return <>
              <button 
                onClick={() => this.setState({content: "Cards"})}
                style={{float: "left", margin: "15px"}}
                className="login-btn"
                >Back</button>
              <Form
                style={{padding: "15px"}}
                onSubmit={e => this.onSubmit(e)}>
                <h2 style={{color: "white", backgroundColor: "#006666", borderRadius: "10px"}}>Create a Discussion:</h2> 
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Question"
                  className="mb-3"
                >
                  <Form.Control 
                  as="textarea" 
                  onChange={e => this.onQChange(e)}
                  placeholder="Leave a comment here"/>
                </FloatingLabel>
                <FloatingLabel controlId="floatingTextarea2" label="Description (optional)">
                  <Form.Control
                    as="textarea"
                    style={{ height: '100px' }}
                    onChange={e => this.onDChange(e)}
                  />
                </FloatingLabel>
                <button 
                  id="send-btn"
                  style={{ marginTop: "10px" }}
                  onClick={() => {console.log("POST THAT!")}}
                  >Post</button>
              </Form>
          </>;
    }
  }

  render() {
    return (
      <>
        <div id='classAreaParent'>
          <div className="disArea">
            {this.renderContent()}
          </div>
        </div>
      </>
    )
  };
}
          
        
function DiscussionCard(props) {
  return (<Card style={{
          textAlign: "left",
          marginBottom: "-5px"
          }}
          onClick={() => {
            props.didClick();
          }}
          id='DCard'>
          <Card.Body>
              <Card.Title>{props.question}</Card.Title>
              
          </Card.Body>
          </Card>
        );
}

async function postAnswer(value, username, classCode, docID) {
  console.log("posting answer..." + value)
  const qRef = doc(db, "discussions", classCode, "questions", docID);
  await updateDoc(qRef, {
      aArray: arrayUnion(value + " #-# " + username + " #-# 0")
  });
}

function DiscussionCardExpanded(props) {
  return (<>
          <Card style={{
            textAlign: "left"
            }}>
            <Card.Header style={{textAlign: "right", fontSize: "15px"}}>{props.poster}</Card.Header>
            <Card.Body>
                <Card.Title>{props.question}</Card.Title>
                <Card.Text>
                  {props.description}
                </Card.Text>
                
            </Card.Body>
            <Card.Footer >
            <div className='scrollDisComment'>
              {props.disCommentArray}
            </div>
              <div style={{textAlign: "right"}}>
                <Input 
                  text="Post" 
                  onSendMessage={async (value) => {await postAnswer(value, props.username, props.classCode, props.docID);
                                              props.updateAnswers();}}/>
              </div>
            </Card.Footer>
          </Card>
          </>
        );
}

function DisComment(props) {
  return (<div style={{border: "1px solid gray", 
                        padding: "5px", 
                        borderRadius: "5%",
                        margin: "5px"}}>
    <button id='vote'>^</button>
     {props.score}
    <button id='vote'>v</button>
    <div style={{textAlign: "right", marginBottom: "8px"}}>
      {props.answer} - {props.poster}
    </div>
    </div>
  );
}

export default Discussions;
