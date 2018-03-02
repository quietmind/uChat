import React, { Component } from "react";
import ".././styles/User.css";

export class User extends Component {
  constructor(props) {
    super(props);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  signIn() {
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        const user = result.user;
        this.props.setUser(user);
      });
  }

  signOut() {
    this.props.firebase.auth().onAuthStateChanged(user => {
      if (user !== null) {
        const userRef = this.props.firebase
          .database()
          .ref("presence/" + user.uid);
        userRef.update({ isOnline: false, currentRoom: "", roomName: "" });
      }
    });
    this.props.firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.setUser(null);
      });
  }

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged(user => {
      this.props.setUser(user);
      const isOnline = this.props.firebase.database().ref(".info/connected");
      if (user) {
        const userRef = this.props.firebase
          .database()
          .ref("presence/" + user.uid);
        isOnline.on("value", snapshot => {
          if (snapshot.val()) {
            userRef.update({ username: user.displayName, isOnline: true });
            userRef
              .onDisconnect()
              .update({ isOnline: false, currentRoom: "", roomName: "" });
          }
        });
      }
    });
  }

  render() {
    return (
      <div className="login-section">
        <h5>Welcome, {this.props.welcome}</h5>
        {this.props.welcome === "Guest" ? (
          <h6 className="cursor-color-change" onClick={this.signIn}>
            Sign In <i className="fa fa-sign-in" />
          </h6>
        ) : (
          <h6 className="cursor-color-change" onClick={this.signOut}>
            Sign Out <i className="fa fa-sign-out" />
          </h6>
        )}
      </div>
    );
  }
}
