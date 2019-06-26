import React from 'react';
import { RouteComponentProps } from "react-router-dom";

import {tmdbKey, API, ImageBaseUrl} from "utils/API";

import Loading from './Loading'
import Pagination from './Pagination';
import ShowErrorMessage from './ShowErrorMessage';
import APIErrorProps from 'interfaces/APIErrorProps';
import MovieOverviewProps from 'interfaces/MovieOverviewProps';
import MovieListProps from 'interfaces/MovieListProps';

type MovieKeys = keyof MovieOverviewProps;

interface Props extends RouteComponentProps{};
  
interface State {
    loading: boolean;
    error: undefined|APIErrorProps;
    page:number,
    pageData:undefined|MovieListProps
    itemsInRow:number
}

type StateKeys = keyof State;

export default class TopMovies extends React.Component<Props,State> {
    mounted:boolean;
    isMobile:boolean;

    constructor(props:Props){
        super(props);
        this.mounted = false;
        this.isMobile = window.innerWidth < 500;
        this.state={
            loading:true,
            error:undefined,
            page:1,
            pageData:undefined,
            itemsInRow:3
        }
    }

    setStateData(key: StateKeys, value: any) {
        this.setState({
          [key]: value
        } as Pick<State, StateKeys>)
      }

    getData(page:number){
        API.get(`3/movie/top_rated?api_key=${tmdbKey.api_key}&language=en-US&page=${page}`)
            .then((response) => {
                this.setStateData("pageData",response.data);
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
        let page = this.state.page;

        if(this.state.loading){
            this.getData(page);
        }else{
            this.setState({
                loading:true
            },this.getData.bind(this,page));
        }
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    componentDidUpdate(prevProps:Props, prevState:State){
        if(prevState.page !== this.state.page){
            this.getData(this.state.page);
        }
    }

    goToMovieDetails(id:number){
        this.props.history.push(`movie/${id}`);
    }

    renderMovieList(){
        let movieList = this.state.pageData && this.state.pageData.results;
        
        if(Array.isArray(movieList) && movieList.length > 0){
            let itemsInRow = this.state.itemsInRow;

            if(this.isMobile){
                return this.renderMovies(movieList, true);
            }else{
                let numOfRows = Math.ceil(movieList.length/itemsInRow);
                let listInTheRow=[];
                for(let rowIndex=0; rowIndex < numOfRows; rowIndex++){
                    let startIndex = rowIndex * itemsInRow;
                    let endIndex = startIndex + itemsInRow;
                    listInTheRow.push(movieList.slice(startIndex,endIndex));
                }
                return listInTheRow.map((movieList,index)=>{
                    return (
                        <div key={`row-${index}`} className={"movie-list-row"}>
                            {this.renderMovies(movieList,false)}
                        </div>
                    );
                });
            }

        }else{
            return(
                <div>Nothing to see here, Move along.</div>
            );
        }
    }

    renderMovies(movieList:Array<Object>,isVertical:boolean){
        return movieList.map((movie)=>{
            let movieTs = movie as Pick<MovieOverviewProps, MovieKeys>;
            
            let className = "movie-list-entry";
            let imagePath = movieTs.poster_path;
            let imageSizes = ["w185","w500"];
            if(isVertical){
                className += " vertical";
                imagePath = movieTs.backdrop_path;
                imageSizes = ["w300","w780"];
            }
            
            return (
                <div key={movieTs.id} className={className} onClick={this.goToMovieDetails.bind(this,movieTs.id)}>
                    <img alt={movieTs.title}
                    srcSet={
                        `${ImageBaseUrl}/${imageSizes[0]}/${imagePath} 1x, ${ImageBaseUrl}/${imageSizes[1]}${imagePath} 2x`
                    } 
                    src={`${ImageBaseUrl}/${imageSizes[0]}${imagePath}`}/>

                    <div className="movie-list-entry-card">
                        <div className="movie-list-entry-title">
                            {movieTs.title}
                        </div>
                        
                        <div className="movie-list-entry-info">
                            <span><i className="fas fa-star"></i> {movieTs.vote_average}</span>
                        </div>
                    </div>
                </div>
            );
        });
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
        else{
            let totalPages = this.state.pageData && this.state.pageData.total_pages;
            return (
                <div className={"div-block-center"}>
                    <div className={"inline-block"}>
                        <div className={"movie-list-container"}>
                            {this.renderMovieList()}
                        </div>
                    </div>
                        

                    {totalPages &&
                        <Pagination
                        showNumberOfPages={10}
                        totalPageCount={totalPages}
                        currentPageIndex={this.state.page-1} 
                        setCurrentPageNr={this.setStateData.bind(this)}
                        currentPageIndexStateName={"page"}
                        />
                    }
                </div>
            );
        }
    }
}