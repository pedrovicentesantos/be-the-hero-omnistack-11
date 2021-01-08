import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// O Switch garante que só 1 rota é executada por vez

import Logon from './pages/Logon';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NewIncident from './pages/NewIncident';
import EditOng from './pages/EditOng';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Logon} />
        <Route path="/register" component={Register} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/incidents/new" component={NewIncident} />
        <Route path="/profile/edit" exact component={EditOng} />
      </Switch>
    </BrowserRouter>
  );
}