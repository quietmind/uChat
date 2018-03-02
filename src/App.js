import React, { Component } from 'react';
import './styles/App.css';
import firebase from 'firebase';
import { RoomList } from './components/RoomList.js';
import { RoomParticipants } from './components/RoomParticipants.js';
import { MessageList } from './components/MessageList.js';
import { User } from './components/User.js';
import { FindUser } from './components/FindUser.js';
import { Grid, Row, Col, Navbar } from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {activeRoom: "", user: null};
    this.activeRoom = this.activeRoom.bind(this);
    this.setUser = this.setUser.bind(this);

     firebase.initializeApp({
      apiKey: "AIzaSyB1pS62UtIhoign_y3ZrnhB7jtZ8JPqnpc",
      authDomain: "uchat-d72b6.firebaseapp.com",
      databaseURL: "https://uchat-d72b6.firebaseio.com",
      projectId: "uchat-d72b6",
      storageBucket: "",
      messagingSenderId: "226684050288"
 });
  }

  activeRoom(room) {
    this.setState({ activeRoom: room });
    const userRef = firebase.database().ref("presence/" + this.state.user.uid);
    const roomKey = room === "" ? "" : room.key;
    const roomTitle = room === "" ? "" : room.title;
    userRef.update({currentRoom: roomKey, roomName: roomTitle});
  }

  setUser(user) {
    this.setState({ user: user });
  }

  render() {
    let messageList, currentUser, roomList, roomParticipants, findUser;

    if (this.state.user !== null) {
      roomList = (
        <RoomList
          firebase={firebase}
          activeRoom={this.activeRoom}
          user={this.state.user.email}
        />
      );
      currentUser = this.state.user.displayName;
      findUser = (
        <FindUser
          firebase={firebase}
        />
      );
    }
    else {
      currentUser = "Guest";
    }

    if (this.state.user !== null && this.state.activeRoom) {
      messageList = (
        <MessageList
          firebase={firebase}
          activeRoom={this.state.activeRoom.key}
          user={this.state.user}
        />
      );
      roomParticipants = (
        <RoomParticipants
          firebase={firebase}
          activeRoom={this.state.activeRoom.key}
        />
      );
    }

    return (
      <Grid fluid className="main">
        <Row className="show-grid main-row">

          <Col sm={3} xs={12} className="sidenav">
            <Navbar fluid>
              <Navbar.Header>
                <Navbar.Brand>
                  <h1>uChat</h1>
                </Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                <User
                  firebase={firebase}
                  setUser={this.setUser}
                  welcome={currentUser}
                />
                {findUser}
                <Col xs={12} className="room-section">
                  <h2 className="active-room">{this.state.activeRoom.title || "Select a Room"}</h2>
                    {roomParticipants}
                </Col>
                {roomList}
              </Navbar.Collapse>
            </Navbar>
          </Col>

          {messageList}

        </Row>
      </Grid>
    );
  }
}

export default App;
