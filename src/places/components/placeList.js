import React, {useContext} from "react";
import "./placeList.css"
import Card from "../../shared/components/UIElements/card"
import PlaceItem from "./placeItem"
import Button from "../../shared/components/FormElements/button";
import { AuthContext } from "../../shared/context/auth-context";

const PlaceList = (props) => {
    const auth = useContext(AuthContext);

    if(props.items.length === 0) {
        if(props.userId === auth.userId) {
            return(
                <div className="place-list center">
                   <Card className="place-item__no-content">
                       <h2>No places found. Maybe create one?</h2>
                       <Button to = "/places/new">Share Place</Button>
                   </Card>
               </div>
           );
        }
        return(
            <div className="place-list center">
               <Card className="place-item__no-content">
                   <h2>No places found for this user.</h2>
               </Card>
           </div>
       );
    }

    return <ul className="place-list">
        {props.items.map(place => (
            <PlaceItem 
                key = {place.id} 
                id = {place.id} 
                image = {place.image} 
                title = {place.title} 
                description = {place.description} 
                address = {place.address} 
                creatorId = {place.creator} 
                coordinates = {place.location} 
                onDelete = {props.onDeletePlace}
            />
        ))}
    </ul>
};

export default PlaceList;