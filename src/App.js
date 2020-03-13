import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import axios from 'axios';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import User from './components/users/User';

class App extends React.Component {
  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null,
  };

  async componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    this.setState({
      loading: true,
    });

    const url = `https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`;

    const res = await axios.get(url);

    this.setState({
      users: res.data,
      loading: false,
    });
  };

  clearUsers = () => {
    this.setState({ users: [], loading: false });
    this.fetchUsers();
  };

  searchUsers = async text => {
    // if (!text) return;
    this.setState({
      loading: true,
    });

    const url = `https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`;

    const res = await axios.get(url);

    this.setState({
      users: res.data.items,
      loading: false,
    });
  };

  getUser = async username => {
    this.setState({
      loading: true,
    });

    const url = `https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`;

    const res = await axios.get(url);

    this.setState({
      user: res.data,
      loading: false,
    });
  };

  getUserRepos = async username => {
    this.setState({
      loading: true,
    });

    const url = `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`;

    const res = await axios.get(url);

    this.setState({
      repos: res.data,
      loading: false,
    });
  };

  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });
    setTimeout(() => this.setState({ alert: null }), 3000);
  };

  render() {
    const { users, loading, user, repos } = this.state;
    return (
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Alert alert={this.state.alert} />
            <Route exact path="/">
              <Search
                searchUsers={this.searchUsers}
                clearUsers={this.clearUsers}
                showClear={users.length > 0 ? true : false}
                setAlert={this.setAlert}
              />
              <Users users={users} loading={loading} />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route
              path="/user/:login"
              render={props => (
                <User
                  {...props}
                  getUser={this.getUser}
                  getUserRepos={this.getUserRepos}
                  user={user}
                  repos={repos}
                  loading={loading}
                />
              )}
            />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
