import React, { useEffect } from 'react';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Repos from '../repos/Repos';

const User = ({
  loading,
  user: {
    name,
    avatar_url,
    location,
    company,
    bio,
    blog,
    login,
    html_url,
    followers,
    following,
    public_repos,
    public_gists,
    hireable,
  },
  repos,
  getUser,
  getUserRepos,
  match,
}) => {
  useEffect(() => {
    getUser(match.params.login);
    getUserRepos(match.params.login);
    // eslint-disable-next-line
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <Link to="/" className="btn btn-light">
        Back to Search
      </Link>
      Hireable: {'  '}
      {hireable ? (
        <i className="fas fa-check text-success" />
      ) : (
        <i className="fas fa-times-circle text-danger" />
      )}
      <div className="card grid-2">
        <div className="all-center">
          <img
            src={avatar_url}
            className="round-img"
            alt={login}
            style={{ width: '150px' }}
          />
          <h1>{name}</h1>
          <p>Location: {location} </p>
        </div>

        <div>
          {bio && (
            <>
              <h3>Bio</h3>
              <p>{bio}</p>
            </>
          )}
          <a href={html_url} className="btn btn-dark my-1">
            Visit Github Profile
          </a>
          <ul>
            <li>
              {login && (
                <>
                  <strong>Username:</strong> {login}
                </>
              )}
            </li>
            <li>
              {company && (
                <>
                  <strong>Company:</strong> {company}
                </>
              )}
            </li>
            <li>
              {blog && (
                <>
                  <strong>Website:</strong> <a href={blog}>{blog}</a>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
      <div className="card text-center">
        <div className="badge badge-primary">Followers: {followers}</div>
        <div className="badge badge-success">Following: {following}</div>
        <div className="badge badge-danger">Followers: {public_repos}</div>
        <div className="badge badge-dark">Followers: {public_gists}</div>
      </div>
      <Repos repos={repos} />
    </>
  );
};

User.propTypes = {
  loading: PropTypes.bool,
  user: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired,
  getUserRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
};

export default User;
