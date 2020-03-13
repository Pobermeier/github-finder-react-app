// eslint-disable-next-line
import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import axios from 'axios';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import User from './components/users/User';

const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [firstLoad, setFirstLoad] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);

    const url = `https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`;

    const res = await axios.get(url);

    setUsers(res.data);
    setLoading(false);
  };

  if (firstLoad) {
    fetchUsers();
    setFirstLoad(false);
  }

  // useEffect(async () => await fetchUsers(), []);

  const clearUsers = () => {
    setUsers([]);
    setLoading(false);
    fetchUsers();
  };

  const searchUsers = async text => {
    setLoading(true);

    const url = `https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`;

    const res = await axios.get(url);

    setUsers(res.data.items);
    setLoading(false);
  };

  const getUser = async username => {
    setLoading(true);
    const url = `https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`;

    const res = await axios.get(url);

    setUser(res.data);
    setLoading(false);
  };

  const getUserRepos = async username => {
    setLoading(true);

    const url = `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`;

    const res = await axios.get(url);

    setRepos(res.data);
    setLoading(false);
  };

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Alert alert={alert} />
          <Route exact path="/">
            <Search
              searchUsers={searchUsers}
              clearUsers={clearUsers}
              showClear={users.length > 0 ? true : false}
              showAlert={showAlert}
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
                getUser={getUser}
                getUserRepos={getUserRepos}
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
};

export default App;
