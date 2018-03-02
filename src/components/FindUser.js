import React, { Component } from 'react';
import { FormGroup, FormControl, Table } from 'react-bootstrap';
import '.././styles/FindUser.css';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return(
      <form onSubmit={(e) => e.preventDefault()}>
        <FormGroup>
          <FormControl
            type="text"
            value={this.props.searchText}
            placeholder="Find User"
            onChange={this.handleChange}
          />
        </FormGroup>
      </form>
    );
  }
}

class UserTable extends Component {
  render() {
    const searchText = this.props.searchText;
    const rows = [];

    this.props.users.forEach((user) => {
      if (!searchText || user.username.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
        return;
      }

      const isOnline = user.isOnline ?
        <i alt="yes" className="fa fa-check"></i> :
        <i alt="no" className="fa fa-times"></i>;

      rows.push(
        <tr key={user.key}>
          <td>{user.username}</td>
          <td>{isOnline}</td>
          <td>{user.roomName}</td>
        </tr>
      );
    });

    return(
      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Online</th>
            <th>Room</th>
          </tr>
        </thead>
          <tbody>
            {rows}
          </tbody>
      </Table>
    );
  }
}

class FilterUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {searchText: ""};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(searchText) {
    this.setState({searchText: searchText});
  }

  render() {
    return(
      <div>
        <SearchBar
          searchText={this.state.searchText}
          onChange={this.handleChange}
        />
        <UserTable
          users={this.props.users}
          searchText={this.state.searchText}
        />
      </div>
    );
  }
}

export class FindUser extends React.Component {
  constructor(props) {
    super(props);
      this.state = {userList: [], isOpen: false};
      this.toggleList = this.toggleList.bind(this);
    }

  toggleList() {
    this.setState( prevState => ({
      isOpen: !prevState.isOpen
    }));
  }

  componentDidMount() {
    const userRef = this.props.firebase.database().ref("presence/");
    userRef.on('value', snapshot => {
      const userChanges = [];
        if (snapshot.val()) {
          snapshot.forEach((participant) => {
            userChanges.push({
              key: participant.key,
              username: participant.val().username,
              roomName: participant.val().roomName,
              isOnline: participant.val().isOnline
            });
          });
        }
      this.setState({ userList: userChanges});
    });
  }
  render() {
    const userList = this.state.userList;
    return (
      <div>
        <p
          id="find-user"
          className="cursor-color-change"
          onClick={this.toggleList}>
            <span className="fa fa-search"></span>
            {this.state.isOpen ? " Hide" : " Find User"}
        </p>
        {this.state.isOpen ? <FilterUsers users={userList} /> : null }
      </div>
    );
  }
}
