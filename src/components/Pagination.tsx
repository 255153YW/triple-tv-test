import React from 'react';

interface Props {
    showNumberOfPages: number;
    totalPageCount: number;
    currentPageIndex: number;
    setCurrentPageNr:Function;
    currentPageIndexStateName:string;
}
  
interface State {}

export default class Pagination extends React.Component<Props, State> {

    setParentPageNr(value:number){
        this.props.setCurrentPageNr(this.props.currentPageIndexStateName, value+1);
    }

    renderPagination(){
        let currentPageIndex = this.props.currentPageIndex;
        let totalPageCount = this.props.totalPageCount;

        let rows = [];
        
        let initialStart = 0;
        let initialSize = 10;
        let initialThreshold = Math.round(initialSize*0.5+1);

        var size;
        var start;
        if(currentPageIndex + 1 > initialThreshold){
          size = currentPageIndex + 1 + (initialSize - initialThreshold);
          start = size - initialSize;
        }else{
          size = initialSize;
          start = initialStart;
        }

        if(size > totalPageCount){
          size = totalPageCount;
        }

        if(start < 0){
          start = 0;
        }

        if(currentPageIndex !== 0){
            rows.push(
                <span key={"pagination-nav-first"} className={"pagination arrow"} onClick={this.setParentPageNr.bind(this, 0)}> 
                    <div className="inline-block"> &#10096;&#10096; </div> 
                </span>
            );
        }

        

        if(currentPageIndex-1 > -1){
            rows.push(
                <span key={"pagination-nav-prev"} className={"pagination arrow"} onClick={this.setParentPageNr.bind(this, currentPageIndex-1)}> 
                    <div className="inline-block"> &#10096; </div> 
                </span>
            );
        }
        

        for (let i = start; i < size; i++) {
            if(i===currentPageIndex){
                rows.push(
                    <div key={`pagination-${i}`} className={"pagination active number"}> 
                    <div className="inline-block"> {i+1} </div> 
                    </div>
                );
            }
            else{
                rows.push(
                <div key={`pagination-${i}`} className={"pagination number"} onClick={this.setParentPageNr.bind(this, i)}>
                    <div className="inline-block" >  {i+1} </div>
                </div>
                );
            }
        }

        if(currentPageIndex+1 < totalPageCount){
            rows.push(
                <div key={"pagination-nav-next"} className={"pagination arrow"} onClick={this.setParentPageNr.bind(this, currentPageIndex+1)}> 
                    <div className="inline-block"> &#10097; </div> 
                </div>
            );
        }

        if(currentPageIndex !== totalPageCount-1){
            rows.push(
                <span key={"pagination-nav-last"} className={"pagination arrow"} onClick={this.setParentPageNr.bind(this, totalPageCount-1)}> 
                    <div className="inline-block"> &#10097;&#10097; </div> 
                </span>
            );
        }
        

        return (
            <div className="inline-block">
                {rows}
            </div>
        )
    }

    render() {
        return(
            <div className={"pagination-wrapper"}>
                {this.renderPagination()}
            </div>
        )
    }
}