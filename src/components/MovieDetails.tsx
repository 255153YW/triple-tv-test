import React from 'react';
import { RouteComponentProps, match } from "react-router-dom";

import {tmdbKey, API, ImageBaseUrl} from "utils/API";

import Loading from './Loading';
import ShowErrorMessage from './ShowErrorMessage'
import APIErrorProps from 'interfaces/APIErrorProps';

import MovieDetailsProps from 'interfaces/MovieDetailsProps';
import ShowReviews from './ShowReviews';
import ShowSimilarMovies from './ShowSimilarMovies';

interface MatchParameter {id: string; }

interface Props extends RouteComponentProps{
    match:match<MatchParameter>;
};

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

interface MovieVideosData{
    id:string,
    results:Array<MovieClip>
}
  
interface State {
    loading:boolean,
    loadingVideos:boolean,
    error:undefined|APIErrorProps,
    movieData:undefined|MovieDetailsProps,
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

    triggerGetData(id:string){
        if(!this.state.loading && !this.state.loadingVideos){
            this.setState({
                loading:true,
                loadingVideos:true
            },this.getData.bind(this,id));
        }else{
            this.getData(id);
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
                window.scrollTo(0, 0);
            });
    }

    componentDidMount(){
        this.mounted = true;
        let id = this.props.match.params.id;
        this.triggerGetData(id);
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    componentDidUpdate(prevProps:Props, prevState:State){
        let oldMovieId = prevProps.match.params.id;
        let newMovieId = this.props.match.params.id;
        let idChanged = newMovieId !== oldMovieId;

        if(idChanged){
            this.triggerGetData(newMovieId);
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
                    <iframe className={"movie-details-trailer"}
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0&origin=${window.location.hostname}`}
                    frameBorder="0">
                    </iframe>
                )
            }else if(this.state.movieData){
                let imagePath = this.state.movieData.backdrop_path;
                let imageSizes = ["w300","w780"];
                return (
                    <img className={"movie-details-trailer"}
                    alt={this.state.movieData.title}
                    srcSet={
                        `${ImageBaseUrl}/${imageSizes[0]}/${imagePath} 1x, ${ImageBaseUrl}/${imageSizes[1]}${imagePath} 2x`
                    } 
                    src={`${ImageBaseUrl}/${imageSizes[0]}${imagePath}`}/>
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
                        <div className={"movie-details-container"}>
                            <div className={"card-container"}>
                                {this.renderTrailer()}
                            </div>
                            <div className={"movie-details-card"}>
                                <div className={"movie-details-card-title"}>
                                    {this.state.movieData.title}
                                </div>
                                <div className={"movie-details-card-content"}>
                                    {this.state.movieData.overview}
                                </div>
                            </div>
                            <ShowSimilarMovies {...this.props}/>
                            <ShowReviews movieTitle={this.state.movieData && this.state.movieData.title} {...this.props}/>
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