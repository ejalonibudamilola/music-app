import React from "react";

import "./SearchResults.css";

import TrackList from "../TrackList/TrackList";

class SearchResults extends React.Component{

    constructor(props) {
      super(props)
    
      console.log("Props in Search "+props.items);
    }

    render(){
        return (
            <div className="SearchResults">
                <h2>Results</h2>
                <TrackList tracks={this.props.SearchResults} onAdd={this.props.onAdd} />
            </div>
        );
    }
}

export default SearchResults;