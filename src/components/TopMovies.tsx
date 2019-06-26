import React from 'react';
import { RouteComponentProps } from "react-router-dom";

import {tmdbKey, API, ImageBaseUrl} from "utils/API";

import Loading from './Loading'
import Pagination from './Pagination';
import ShowErrorMessage from './ShowErrorMessage';
import APIErrorProps from 'interfaces/APIErrorProps';
import MovieOverviewProps from 'interfaces/MovieOverviewProps';
import MovieListProps from 'interfaces/MovieListProps';
import ShowMovieCardList from './ShowMovieCardList';

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

    triggerGetData(page:number){
        if(!this.state.loading){
            this.setState({
                loading:true
            },this.getData.bind(this,page));
        }else{
            this.getData(page);
        }
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

        this.triggerGetData(page);
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    componentDidUpdate(prevProps:Props, prevState:State){
        if(prevState.page !== this.state.page){
            this.triggerGetData(this.state.page);
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
                return <ShowMovieCardList movieList={movieList} isVertical={true} {...this.props}/>
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
                            <ShowMovieCardList movieList={movieList} isVertical={false} {...this.props}/>
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
            let paginationPages = 10;
            if(this.isMobile){
                paginationPages = 5;
            }
            return (
                <div className={"movie-list-wrapper"}>
                    <div className={"movie-list-container"}>
                        {this.renderMovieList()}
                    </div>
                        

                    {totalPages &&
                        <Pagination
                        showNumberOfPages={paginationPages}
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