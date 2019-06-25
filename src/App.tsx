import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from 'components/Home';
import NotFound from 'components/Home';

import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="*" component={NotFound}/>
      </Switch>
    </Router>
  );
}

export default App;
