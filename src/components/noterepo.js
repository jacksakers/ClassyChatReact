import React, { Component } from 'react';
import '../App.css';
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { doc, getDoc, addDoc, collection, updateDoc, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

class NotesRepo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "Notes",
      title: "",
      nCards: [],
      nExpanded: {},
      uploadNote: "",
      flagbtn: "Flag"
    }
    this.btnDisabled = true;
  }

  onChange(e) {
    this.setState({title: e.target.value});
  }

  onFChange(e) {
    this.setState({uploadNote: e.target.files});
  }

  onSubmit(e) {
    e.preventDefault();
    let nObj = {title: this.state.title,
      poster: this.props.username,
      content: ["Uploading..."]};
    this.postNote(nObj);
    let newNs = this.getNNames();
    newNs = newNs.reverse();
    this.setState({content: "Cards", title: "", uploadNote: "", nCards: newNs});
  }

  componentDidMount() {
    this.getNNames();
    if (auth.currentUser !== null) {
      this.btnDisabled = false;
    }
  }

  first = true;

  componentDidUpdate() {
    if (this.state.nExpanded.poster !== undefined && this.first) {
      this.getFlagged(this.state.nExpanded.docID);
      this.first = false;
    }
  }

  getNNames() {
    let nArray = [];
    for (let i in this.props.nNames) {
      nArray.push(<Col>
            <NotesCard 
            title={this.props.nNames[i].split(" #-# ")[0]}
            didClick={() => {this.setState({content: "Card"});
                              this.getNote(this.props.nNames[i].split(" #-# ")[1]);}}/>
          </Col>);
    }
    nArray = nArray.reverse();
    this.setState({nCards: nArray});
    return nArray;
  }

  async getNote(docID) {
    const nRef = doc(db, "notes repo", this.props.classCode, "notes", docID);
    const nSnap = await getDoc(nRef);
    console.log("Getting notes content...");
    let ncontent = nSnap.data().content;
    let nposter = nSnap.data().poster;
    let ntitle = nSnap.data().title;
    let fileName = nSnap.data().fileName;
    let nObj = {title: ntitle,
                poster: nposter,
                content: ncontent,
                docID: docID,
                flags: [],
                fileName: fileName};
    this.setState({nExpanded: nObj});
  }

  async getFlagged(docID) {
    if (this.props.username === this.state.nExpanded.poster) {
      this.setState({flagbtn: "Delete"})
    } else {
      const noteRef = doc(db, "notes repo", this.props.classCode, "notes", docID);
      const noteSnap = await getDoc(noteRef);
      if (noteSnap.data().flags.includes(auth.currentUser.uid)) {
        this.setState({flagbtn: "Flagged"});
      } else {
        this.setState({flagbtn: "Flag"});
      }
    }
  }

  async putFlag(classCode, docID, titleAndID, fileName) {
    const nRef = doc(db, "notes repo", classCode, "notes", docID);
    const nrRef = doc(db, "notes repo", classCode);
    let storage = getStorage();
    const fileLocation = ('gs://classychat-8c563.appspot.com/files_new/' + fileName);
    const fileRef = ref(storage, fileLocation);

    if (this.state.flagbtn === "Flag") {
      await updateDoc(nRef, {
        flags: arrayUnion(auth.currentUser.uid)
      });
      this.setState({flagbtn: "Flagged"})
    } else if (this.state.flagbtn === "Flagged") {
      await updateDoc(nRef, {
        flags: arrayRemove(auth.currentUser.uid)
      });
      this.setState({flagbtn: "Flag"})
    } else {
      await deleteDoc(nRef);
      await updateDoc(nrRef, {
        nNames: arrayRemove(titleAndID)
      });
      deleteObject(fileRef).then(() => {
        console.log(fileName + " deleted.");
      }).catch((error) => {
        console.error(error)
      });
      await this.updateNotes();
      this.setState({content: "Cards"});
    }

    let nSnap = await getDoc(nRef);
    if (nSnap.exists() && nSnap.data().flags.length >= 3) {
      await deleteDoc(nRef);
      await updateDoc(nrRef, {
        nNames: arrayRemove(titleAndID)
      });
      deleteObject(fileRef).then(() => {
        console.log(fileName + " deleted.");
      }).catch((error) => {
        console.error(error)
      });
      await this.updateNotes();
      this.setState({content: "Cards"});
    }
  }

  async postNote(nObj) {
    let files = this.state.uploadNote;
    const docRef = await addDoc(collection(db, "notes repo", this.props.classCode, "notes"), 
    nObj);
    const storage = getStorage();
    await updateDoc(doc(db, "notes repo", this.props.classCode, "notes", docRef.id), {
      content: []
    }); 
    for (let i in files) {
      const storageRef = ref(storage, 'files_new/' + files[i].name);
      uploadBytes(storageRef, files[i]).then((snapshot) => {
        console.log('Uploaded a file!');
        this.updateNotes();
        getDownloadURL(storageRef)
        .then(async (url) => {
          await updateDoc(doc(db, "notes repo", this.props.classCode, "notes", docRef.id), {
            content: arrayUnion(url),
            fileName: files[i].name
          }); 
          if (i === 1)
            this.updateNotes();
        })
        .catch((error) => {
          // Handle any errors
        });
      });
    }
    await updateDoc(doc(db, "notes repo", this.props.classCode), {
      nNames: arrayUnion(nObj.title + " #-# " + docRef.id)
    });
  }

  async updateNotes() {
    const noteRef = doc(db, "notes repo", this.props.classCode);
    const noteSnap = await getDoc(noteRef);
    console.log("Getting Notes...");
    let nNames = noteSnap.data().nNames;
    let nArray = [];
    for (let i in nNames) {
      nArray.push(<Col>
        <NotesCard 
        title={nNames[i].split(" #-# ")[0]}
        didClick={() => {this.setState({content: "Card"});
                          this.getNote(nNames[i].split(" #-# ")[1]);}}/>
      </Col>);
    }
    nArray = nArray.reverse();
    this.setState({nCards: nArray});
  }

  renderContent() {
    switch (this.state.content) {
      default:
      case "Cards": 
        return <>
          <Row>
            <button
              style={{
                width: "150px",
                margin: "10px"
              }}
              onClick={() => this.setState({content: "Create"})}
              className="login-btn"
              disabled={this.btnDisabled}
              >Upload Notes</button>
          </Row>
          <div className='scrollDis'>
            <Row xs={1} md={2} className="g-4">
              {this.state.nCards}
            </Row>
          </div>
          </>;
      case "Card":
        return <>
          <button 
            onClick={() => {this.setState({content: "Cards", nExpanded: {}});
                            this.updateNotes();
                            this.first = true;}}
            style={{float: "left", marginRight: "5px"}}
            className="login-btn"
            >Back</button>
          <NotesCardExpanded 
                title={this.state.nExpanded.title}
                poster={this.state.nExpanded.poster}
                content={this.state.nExpanded.content}
                flagBtn={this.state.flagbtn}
                docID={this.state.nExpanded.docID}
                updateFlag={(titleAndID) => this.putFlag(this.props.classCode, this.state.nExpanded.docID, titleAndID, this.state.nExpanded.fileName)}
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
            <h2 
              style={{color: "white", backgroundColor: "#006666", borderRadius: "10px"}}
              >Upload Notes:</h2> 
            <FloatingLabel
              controlId="floatingTextarea"
              label="Title"
              className="mb-3"
            >
              <Form.Control 
              as="textarea" 
              onChange={e => this.onChange(e)}
              placeholder="Leave a comment here"/>
            </FloatingLabel>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control 
                type="file" 
                onChange={e => this.onFChange(e)}
                multiple
                className="createNote"/>
            </Form.Group>
            <button 
              id="send-btn"
              onClick={() => {console.log("Uploading...")}}
              >Upload</button>
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

function NotesCard(props) {
  return (<Card style={{
          textAlign: "left",
          marginBottom: "-5px",
          minWidth: "350px"
          }}
          onClick={() => props.didClick()}
          id='DCard'>
          <Card.Body>
              <Card.Title>{props.title}</Card.Title>
              
          </Card.Body>
          </Card>
        );
}

function NotesCardExpanded(props) {
  let showArray = [];
  for (let i in props.content) {
    let testArray = props.content[i].split(".");
    let pdfTester = false;
    for (let i in testArray) {
      let splitArray = testArray[i].split("?");
      pdfTester = splitArray.includes("pdf");
    }
    if (pdfTester) {
      showArray.push(<>
        <Row>
          <a href={props.content[i]} 
            target="_blank" 
            rel="noreferrer"
            style={{textAlign: "center"}}
            >Open In New Window</a>
        </Row>
        <Row>
          <iframe 
            src={props.content[i]} 
            style={{height: "49vh"}}
            title={props.title}></iframe>
        </Row>
        </>);
    } else {
      showArray.push(
        <a href={props.content[i]} target="_blank" rel="noreferrer">
        <img 
          src={props.content[i]} 
          style={{maxHeight: "51.5vh"}}
          alt=""></img>
        </a>);
    }
  }
  return (<Card style={{
          textAlign: "left"
          }}>
          <Card.Header style={{textAlign: "right", fontSize: "15px"}}>
            <button 
              style={{marginRight: "20px"}} 
              className='login-btn'
              onClick={() => props.updateFlag(props.title + " #-# " + props.docID)}>
                {props.flagBtn}
            </button>
            {props.poster}
          </Card.Header>
          <Card.Body>
              <Card.Title>{props.title}</Card.Title>
              <div className='scrollNotes'>
              {showArray}
              </div>
          </Card.Body>
          </Card>
        );
}
        

export default NotesRepo;
