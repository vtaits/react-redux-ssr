import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Grid } from 'react-bootstrap';

import { useIsomorphic, LoadContextError } from 'react-redux-isomorphic';

const UserPage = ({
  match: {
    params: {
      userId,
    },
  },
}) => {
  const {
    isReady,
    context,
    error,
  } = useIsomorphic(`userDetail_${userId}`, async ({ fetch, setTitle, setStatus }) => {
    const [
      userResponse,
      otherUsersResponse,
    ] = await Promise.all([
      await fetch(`/api/users/${userId}`),
      await fetch(`/api/search/users?q=e`),
    ]);

    const status = userResponse.status;
    const json = await userResponse.json();

    const otherUsersJson = await otherUsersResponse.json();

    const otherUsers = otherUsersResponse.status < 400 ?
      otherUsersJson.items.slice(0, 5) :
      [];

    setStatus(status);

    if (status < 400) {
      const userName = json.name || json.login;

      setTitle(`User: ${userName}`);
    } else {
      setTitle(json.message);

      throw new LoadContextError({
        status,
        json,
      });
    }

    return {
      user: json,
      otherUsers,
    };
  });

  if (error) {
    return (
      <Grid>
        <h1>User not found</h1>

        <p>
          <Link to='/'>Back to users page</Link>
        </p>
      </Grid>
    );
  }

  if (!isReady) {
    return (
      <Grid>
        <h2>Loading...</h2>

        <p>
          <Link to='/'>Back to users page</Link>
        </p>
      </Grid>
    );
  }

  const {
    user,
    otherUsers,
  } = context;

  return (
    <Grid>
      <h1>{user.name || user.login}</h1>

      {
        user.name && (
          <p>Name: {user.name}</p>
        )
      }

      {
        user.public_repos && (
          <p>Public repos: {user.public_repos}</p>
        )
      }

      {
        user.public_gists && (
          <p>Public gists: {user.public_gists}</p>
        )
      }

      {
        user.followers && (
          <p>Followers: {user.followers}</p>
        )
      }

      {
        user.following && (
          <p>Following: {user.following}</p>
        )
      }

      <p>
        <Link to='/'>Back to users page</Link>
      </p>

      {
        otherUsers.length > 0 && (
          <div>
            <p>Other users:</p>

            <ul>
              {
                otherUsers.map(({ id, login }) => (
                  <li key={id}>
                    <Link to={`/${login}/`}>
                      {login}
                    </Link>
                  </li>
                ))
              }
            </ul>
          </div>
        )
      }
    </Grid>
  );
}

UserPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default UserPage;