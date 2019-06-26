import React from 'react';
import { RouteComponentProps } from "react-router-dom";

import TopMovies from './TopMovies';

export default function Home(props:RouteComponentProps) {
    return (
        <div>
            Top movies
            <TopMovies {...props}/>
        </div>
    );
  }