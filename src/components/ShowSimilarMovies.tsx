import React from 'react';
import { RouteComponentProps, match } from "react-router-dom";

import {tmdbKey, API} from "utils/API";

import Loading from './Loading';
import ShowErrorMessage from './ShowErrorMessage'
import APIErrorProps from 'interfaces/APIErrorProps';

import MovieListProps from 'interfaces/MovieListProps';
import ShowMovieCardList from './ShowMovieCardList';

interface MatchParameter {id: string; }

interface Props extends RouteComponentProps{
    match:match<MatchParameter>;
};

interface State {
    loading:boolean,
    error:undefined|APIErrorProps,
    movieListData:undefined|MovieListProps,
}

type StateKeys = keyof State;

export default class ShowSimilarMovies extends React.Component<Props,State> {
    mounted:boolean;
    isMobile:boolean;

    constructor(props:Props){
        super(props);
        this.mounted = false;
        this.isMobile = window.innerWidth < 500;
        this.state={
            loading:true,
            error:undefined,
            movieListData:undefined,
        }
    }

    setStateData(key: StateKeys, value: any) {
        this.setState({
          [key]: value
        } as Pick<State, StateKeys>)
    }

    triggerGetData(id:string,page:undefined|number){
        if(!this.state.loading){
            this.setState({
                loading:true
            },this.getData.bind(this,id, page));
        }else{
            this.getData(id, page);
        }
    }



    getData(id:string, page:undefined|number){
        if(page === undefined){
            page = 1;
        }
        API.get(`3/movie/${id}/similar?api_key=${tmdbKey.api_key}&language=en-US&pages=${page}`)
            .then((response) => {
                this.setStateData("movieListData",response.data);
            })
            .catch((error) => {
                this.setStateData("error",error);
            })
            .finally(() => {
                this.setStateData("loading",false);
            });
    }

    componentDidMount(){
        this.mounted = true;
        let id = this.props.match.params.id;
        this.triggerGetData(id, undefined);
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    componentDidUpdate(prevProps:Props, prevState:State){
        let oldMovieId = prevProps.match.params.id;
        let newMovieId = this.props.match.params.id;
        let idChanged = newMovieId !== oldMovieId;

        let oldPageNumber = prevState && prevState.movieListData && prevState.movieListData.page;
        let newPageNumber = this.state.movieListData && this.state.movieListData.page;
        let pageChanged = newPageNumber && (!oldPageNumber || (oldPageNumber !== newPageNumber));
       
        let fetchNewData = (idChanged || pageChanged)
        if(fetchNewData){
            this.triggerGetData(newMovieId, newPageNumber);
        }
    }

    renderMovieList(){
        let movieList = this.state.movieListData && this.state.movieListData.results;
        
        if(Array.isArray(movieList) && movieList.length > 0){
            return (
                <div className={"movie-details-card"}>
                    <div className={"movie-details-card-title"}>
                        More like this
                    </div>
                    <div className={"movie-list-row-scroll"} style={{gridTemplateColumns:`repeat(${movieList.length},185px)`}}>
                        <ShowMovieCardList movieList={movieList} isVertical={false} {...this.props}/>
                    </div>
                </div>
            );
        }else{
            return false;
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
            return this.renderMovieList();
        }
    }
}