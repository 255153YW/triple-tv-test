import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from 'components/Home';
import NotFound from 'components/NotFound';

import MovieDetails from 'components/MovieDetails';

import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/movie/:id" component={MovieDetails}/>
        <Route path="*" component={NotFound}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
