import React from 'react';
import { RouteComponentProps, match } from "react-router-dom";

import {tmdbKey, API, ImageBaseUrl} from "utils/API";

import Loading from './Loading';
import ShowErrorMessage from './ShowErrorMessage'
import APIErrorObject from 'interfaces/APIErrorObject';

interface MatchParameter {id: string; }

interface Props extends RouteComponentProps{
    match:match<MatchParameter>;
    // RouteComponentProps<MatchParameter>
};

interface MovieCollection{
    id: number,
    name: string,
    poster_path: string,
    backdrop_path: string
}

interface MovieGenre{
    id: number,
    name: string
}

interface MovieProductionCompany{
    id: number,
    logo_path:string|null
    name: string,
    origin_country: string,
}

interface MovieProductionCountries{
    iso_3166_1: number,
    name: string,
}

interface MovieSpokenLanguange{
    iso_639_1: number,
    name: string,
}

interface MovieClip{
    id:string,
    iso_639_1: string,
    iso_3166_1: string,
    key: string,
    name: string,
    site: string,
    size: number,
    type: String
}

interface MovieDetailsData{
    id:string,
    imdb_id: string,
    adult: boolean,
    backdrop_path: string,
    belongs_to_collection: null|MovieCollection,
    budget: number,
    genres: Array<MovieGenre>,
    homepage: string|null,
    original_language: string,
    original_title: string,
    overview: string,
    popularity: number,
    poster_path: string,
    production_companies: Array<MovieProductionCompany>,
    production_countries: Array<MovieProductionCountries>,
    release_date: string,
    revenue: number,
    runtime: 109,
    spoken_languages: Array<MovieSpokenLanguange>,
    status: string,
    tagline: string,
    title: string,
    vote_average: number,
    vote_count: number
}

interface MovieVideosData{
    id:string,
    results:Array<MovieClip>
}
  
interface State {
    loading:boolean,
    loadingVideos:boolean,
    loadingRecommendations:boolean,
    loadingReviews:boolean,
    error:undefined|APIErrorObject,
    movieData:undefined|MovieDetailsData,
    movieVideosData:undefined|MovieVideosData
}

type StateKeys = keyof State;

export default class MovieDetails extends React.Component<Props,State> {
    mounted:boolean;
    isMobile:boolean;

    constructor(props:Props){
        super(props);
        this.mounted = false;
        this.isMobile = window.innerWidth < 500;
        this.state={
            loading:true,
            loadingVideos:true,
            loadingRecommendations:true,
            loadingReviews:true,
            error:undefined,
            movieData:undefined,
            movieVideosData:undefined
        }
    }

    setStateData(key: StateKeys, value: any) {
        this.setState({
          [key]: value
        } as Pick<State, StateKeys>)
    }

    getTrailer(){
        let movieClips = this.state.movieVideosData && this.state.movieVideosData.results;
        if(movieClips && movieClips.length > 0){
            return movieClips.find((clip)=>{
                return (clip.type === "Trailer" && clip.site === "YouTube");
            })
        }else{
            return undefined;
        }
    }

    getData(id:string){
        API.get(`3/movie/${id}?api_key=${tmdbKey.api_key}&language=en-US`)
            .then((response) => {
                this.setStateData("movieData",response.data);
            })
            .catch((error) => {
                this.setStateData("error",error);
            })
            .finally(() => {
                this.setStateData("loading",false);
            });
        
        API.get(`3/movie/${id}/videos?api_key=${tmdbKey.api_key}&language=en-US`)
            .then((response) => {
                this.setStateData("movieVideosData",response.data);
            })
            .catch((error) => {
                this.setStateData("error",error);
            })
            .finally(() => {
                this.setStateData("loadingVideos",false);
            });
    }

    componentDidMount(){
        this.mounted = true;
        let id = this.props.match.params.id;
        if(this.state.loading){
            this.getData(id);
        }else{
            this.setState({
                loading:true
            },this.getData.bind(this,id));
        }
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    componentDidUpdate(prevProps:Props, prevState:State){
        let oldMovieDataId = prevState && prevState.movieData && prevState.movieData.id;
        let newMovieDataId = this.state.movieData && this.state.movieData.id;

        if(newMovieDataId && (!oldMovieDataId || (oldMovieDataId !== newMovieDataId))){
            this.getData(newMovieDataId);
        }
    }

    renderTrailer(){
        if(this.state.loadingVideos){
            return(
                <Loading/>
            );
        }else{
            let trailer = this.getTrailer();
            if(trailer){
                return(
                    <div className={"div-block-center"}>
                        <iframe 
                        src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0&origin=${window.location.hostname}`}
                        frameBorder="0">
                        </iframe>
                    </div>
                )
            }else if(this.state.movieData){
                let imagePath = this.state.movieData.backdrop_path;
                let imageSizes = ["w300","w780"];
                return (
                    <div className={"div-block-center"}>
                        <img alt={this.state.movieData.title}
                        srcSet={
                            `${ImageBaseUrl}/${imageSizes[0]}/${imagePath} 1x, ${ImageBaseUrl}/${imageSizes[1]}${imagePath} 2x`
                        } 
                        src={`${ImageBaseUrl}/${imageSizes[0]}${imagePath}`}/>
                    </div>
                );
            }
        }
    }

    render() {
        if(this.state.loading){
            return(
                <Loading/>
            );
        }
        else if(this.state.error){
            return(
                <ShowErrorMessage error={this.state.error}/>
            )
        }
        else {
            if(this.state.movieData){
                return (
                    <div className={"div-block-center"}>
                        {this.renderTrailer()}
                        <div className={"card-container"}>
                            <div className={"movie-details-title"}>
                                {this.state.movieData.title}
                            </div>
                            <div className={"movie-details-overview"}>
                                {this.state.movieData.overview}
                            </div>
                        </div>
                        <div className={"card-container"}>
                            recommended movies
                        </div>
                        <div className={"card-container"}>
                            reviews
                        </div>
                    </div>
                );
            }else{
                return(
                    <div className={"div-block-center"}>
                        nothing to see here
                    </div>
                );
            }
        }
    }
}