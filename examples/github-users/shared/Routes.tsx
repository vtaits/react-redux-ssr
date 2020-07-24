import React from 'react';
import type {
  FC,
} from 'react';

import { Switch, Route } from 'react-router-dom';

import Page404 from './page404';
import User from './user';
import Users from './users';

const Routes: FC = () => (
  <Switch>
    <Route
      path="/:userId/"
      component={User}
    />

    <Route
      path="/"
      component={Users}
    />

    <Route
      path="*"
      component={Page404}
    />
  </Switch>
);

export default Routes;