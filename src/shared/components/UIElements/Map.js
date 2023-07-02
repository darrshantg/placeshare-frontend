import React, { useRef, useEffect} from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import "mapbox-gl/dist/mapbox-gl.css"
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;


const Map = (props) => {
    const mapRef = useRef();
    const {center,zoom} = props;
    const APIKEY = process.env.REACT_APP_MAPBOX_API_KEY;

    useEffect(() => {
        mapboxgl.accessToken = APIKEY;
        const map = new mapboxgl.Map({
            container: mapRef.current,
            style: "mapbox://styles/mapbox/satellite-streets-v11",
            center: center,
            zoom: zoom,
        });
        new mapboxgl.Marker().setLngLat(center).addTo(map);
    },[center,zoom,APIKEY]);

    return(
        <div ref = {mapRef} className={`map ${props.className}`} style = {props.style}>
            
        </div>
    ) 
};

export default Map;