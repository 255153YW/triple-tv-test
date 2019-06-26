import React from 'react';
import { RouteComponentProps, match } from "react-router-dom";

import {tmdbKey, API} from "utils/API";

import Loading from './Loading';
import ShowErrorMessage from './ShowErrorMessage'
import APIErrorProps from 'interfaces/APIErrorProps';

import Truncate from 'react-truncate';
import MovieReviewListProps from 'interfaces/MovieReviewListProps';

interface MatchParameter {id: string; }

interface Props extends RouteComponentProps{
    match:match<MatchParameter>;
    movieTitle:string
};

interface State {
    loading:boolean,
    error:undefined|APIErrorProps,
    movieReviewsData:undefined|MovieReviewListProps,
    showFullReview:Array<string>
}

type StateKeys = keyof State;

export default class ShowReviews extends React.Component<Props,State> {
    mounted:boolean;
    isMobile:boolean;

    constructor(props:Props){
        super(props);
        this.mounted = false;
        this.isMobile = window.innerWidth < 500;
        this.state={
            loading:true,
            error:undefined,
            movieReviewsData:undefined,
            showFullReview:[]
        }
    }

    showFullReviewClick(id:string){
        if(!this.state.showFullReview.includes(id)){
            let copyShowFullReview = JSON.parse(JSON.stringify(this.state.showFullReview));
            copyShowFullReview.push(id);
            this.setStateData("showFullReview", copyShowFullReview);
        }
    }

    setStateData(key: StateKeys, value: any) {
        this.setState({
          [key]: value
        } as Pick<State, StateKeys>)
    }

    triggerGetData(id:string){
        if(!this.state.loading){
            this.setState({
                loading:true,
            },this.getData.bind(this,id));
        }else{
            this.getData(id);
        }
    }

    getData(id:string){
        API.get(`3/movie/${id}/reviews?api_key=${tmdbKey.api_key}&language=en-US&pages=1`)
            .then((response) => {
                this.setStateData("movieReviewsData",response.data);
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
        this.triggerGetData(id);
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    componentDidUpdate(prevProps:Props, prevState:State){
        let oldMovieReviewsDataId = prevState && prevState.movieReviewsData && prevState.movieReviewsData.id;
        let newMovieReviewsDataId = this.state.movieReviewsData && this.state.movieReviewsData.id;

        if(newMovieReviewsDataId && (!oldMovieReviewsDataId || (oldMovieReviewsDataId !== newMovieReviewsDataId))){
            this.getData(newMovieReviewsDataId);
        }
    }

    renderReviews(){
        let noReview = (
            <div className={"movie-details-card-content"}>
                There is no review yet for <em>{this.props.movieTitle}</em>
            </div>
        );
        if(this.state.movieReviewsData){
            let movieReviewsData = this.state.movieReviewsData;
            let reviews = movieReviewsData.results;
            let numOfReviews = 3;
            let renderReviews;
            if(reviews.length > 0){
                renderReviews =  reviews.slice(0,numOfReviews).map((review)=>{
                    if(this.state.showFullReview.includes(review.id)){
                        return (
                            <div key={review.id} className={"movie-details-card-content"}>
                                <div className={"movie-details-card-title sub"}>{review.author}</div>
                                {review.content}
                            </div>
                        );
                    }
                    else{
                        return (
                            <div key={review.id} className={"movie-details-card-content"}>
                                <div className={"movie-details-card-title sub"}>{review.author}</div>
                                <Truncate lines={3} ellipsis={<span>...<a onClick={this.showFullReviewClick.bind(this,review.id)}>Read more</a></span>}>
                                    {review.content}
                                </Truncate>
                            </div>
                        );
                    }
                });

                if(reviews.length > numOfReviews){
                    renderReviews.push(
                        <div key={"review-show-all"} className={"movie-details-card-content"}>
                            <a href='/'>See all reviews</a>
                        </div>
                    );
                }

                return renderReviews;
            }else{
                return noReview;
            }
        }else{
            return noReview;
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
            return (
                <div className={"movie-details-card"}>
                    <div className={"movie-details-card-title"}>
                        Reviews
                    </div>
                    {this.renderReviews()}
                </div>
            );
        }
    }
}