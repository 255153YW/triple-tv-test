import React from 'react';
import { RouteComponentProps } from "react-router-dom";

import {ImageBaseUrl} from "utils/API";

import MovieOverviewProps from 'interfaces/MovieOverviewProps';

interface Props extends RouteComponentProps{
    movieList:Array<MovieOverviewProps>,
    isVertical:boolean
};
  
interface State {}

export default class ShowMovieCardList extends React.Component<Props,State> {
    goToMovieDetails(id:number){
        this.props.history.push(`/movie/${id}`);
    }

    render() {
        return this.props.movieList.map((movie)=>{
            let className = "movie-list-entry";
            let imagePath = movie.poster_path;
            let imageSizes = ["w185","w500"];
            if(this.props.isVertical){
                className += " vertical";
                imagePath = movie.backdrop_path;
                imageSizes = ["w300","w780"];
            }
            
            return (
                <div key={movie.id} className={className} onClick={this.goToMovieDetails.bind(this,movie.id)}>
                    <img
                    alt={movie.title}
                    srcSet={
                        `${ImageBaseUrl}/${imageSizes[0]}/${imagePath} 1x, ${ImageBaseUrl}/${imageSizes[1]}${imagePath} 2x`
                    } 
                    src={`${ImageBaseUrl}/${imageSizes[0]}${imagePath}`}/>

                    <div className="movie-list-entry-card">
                        <div className="movie-list-entry-title">
                            {movie.title}
                        </div>
                        
                        <div className="movie-list-entry-info">
                            <span><i className="fas fa-star"></i> {movie.vote_average}</span>
                        </div>
                    </div>
                </div>
            );
        });
    }
}