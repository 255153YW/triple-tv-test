import MovieOverviewProps from "./MovieOverviewProps";

export default interface MovieListProps {
    page:number,
    total_results:number,
    total_pages:number,
    results:Array<MovieOverviewProps>
}
