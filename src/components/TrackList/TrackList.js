import React from "react";

import "./TrackList.css";

import Track from "../Track/Track";

class TrackList extends React.Component{

    constructor(props) {
      super(props)
    
      console.log("Props in Tracklist is "+props.items);
      
    }






    render(){
        return (
            <div className="TrackList">
                {this.props.tracks ? this.props.tracks.map(track => {
                    return(
                        <Track
                            track={track}
                            key={track.id}
                            onAdd={this.props.onAdd}
                            isRemoval={this.props.isRemoval}
                            onRemove={this.props.onRemove}
                        />
                    );
                }): 'No tracks to show for now'}
            </div>
        );
    }
}

export default TrackList;