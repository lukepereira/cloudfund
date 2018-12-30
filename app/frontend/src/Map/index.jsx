import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import ReactMapGL, {Marker, Popup, FlyToInterpolator} from 'react-map-gl'
import Pin from './Pin'
import { REGION_NAMES, REGIONS, INITIAL_VIEWPORT } from './constants'

import './Map.css'

class Map extends Component {
    state = {
        viewport: INITIAL_VIEWPORT,
        width: 0,
        height: 0,
        project_list: [],
    }
    
    componentWillMount = () => {
        this.updateDimensions()
    }
    
    componentDidMount = () => {
        window.addEventListener("resize", this.updateDimensions)
        this.setState({
            viewport: {
                ...this.state.viewport,
                width: this.getWidth(),
                height: this.getHeight(),
            },
        })
    }
    
    componentWillUnmount = () => {
        window.removeEventListener("resize", this.updateDimensions)
    }
    
    updateDimensions = () => {
        const w = window,
            d = document,
            documentElement = d.documentElement,
            body = d.getElementsByTagName('body')[0],
            width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
            height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight
        
        this.setState({width, height})
        this.onViewportChange({})
    }
    
    getProjects = () => {
        const post_url = 'https://us-central1-scenic-shift-130010.cloudfunctions.net/get_projects'    
        const config = { 
            headers: {  
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
        axios.post(
            post_url,
            {},
            config
        )
        .then((response) => {
            console.log(response.data)
            this.setState({project_list: response.data})
        })
        .catch((error) => {
            console.log(error)
        })
    }
    
    
    getHeight = () => {
        return  this.state.height - 115
    }
    
    getWidth = () => {
        return  this.state.width - 290
    }
    
    onViewportChange = (updatedViewport) => {
        const viewport = {
            ...this.state.viewport,
            height: this.getHeight(),
            width: this.getWidth(),
            transitionInterpolator: new FlyToInterpolator(),
            transitionDuration: 3000,
            ...updatedViewport,
        }
        this.setState({viewport})
    }
    
    onPinClick = (selectedRegion) => {
        this.onViewportChange({
            latitude: REGIONS[selectedRegion].latitude,
            longitude: REGIONS[selectedRegion].longitude,
            zoom: 6.5,
            pitch: 70,
        })
        this.setState({selectedRegion})
    }
    
    getProjectsByLocation = (location) => {
        return this.state.project_list
            && this.state.project_list.filter((project) => {
                project.cluster_location.indexOf(location) >= -1
            })
            || []
    }
    
    getMarkers = () => {
        return REGION_NAMES.map((regionName, index) => {
        
            if (!REGIONS[regionName].latitude || !REGIONS[regionName].longitude) {
                return
            }
            return (
                <Marker
                    key={`marker-${index}`}
                    latitude= {REGIONS[regionName].latitude}
                    longitude={REGIONS[regionName].longitude}
                 >
                    <Pin 
                        size={15}
                        text={this.getProjectsByLocation(regionName).length}
                        onClick={() => this.onPinClick(regionName)}
                    />
                </Marker>
            )
        })
    }
    
    onPopUpClose = () => {
        this.onViewportChange(INITIAL_VIEWPORT)
        this.setState({selectedRegion: null})
    }
    
    getPopup() {
        const {selectedRegion} = this.state
        return selectedRegion && (
            <Popup tipSize={5}
                anchor="bottom"
                offsetTop={-15}
                longitude={REGIONS[selectedRegion].longitude}
                latitude={REGIONS[selectedRegion].latitude}
                closeOnClick={false}
                closeButton={true}
                onClose={this.onPopUpClose}
            >
                <div className={'PopupText'}>
                    <div className={'PopupTextRow'}>
                        <div>{`Clusters:`}</div>
                        <div>0</div>
                    </div>
                    <div className={'PopupTextRow'}>
                        <div>{`Zone:`}</div>
                        <div>{selectedRegion}</div>    
                    </div>
                    <div onClick={() => this.props.history.push('/create')}> test </div>
                </div>
            </Popup>
        )
    }
    
    getCursor = ({isHovering, isDragging}) => {
        return isDragging ? 'grab' : 'default'
    }
    
    render() {
        return (
            <div 
                className={'mapContainer'} 
                ref={(mapWidgetElement) => this.mapWidgetElement = mapWidgetElement}
            >
                <ReactMapGL
                    {...this.state.viewport}
                    style={{width:'100%', height: '100%'}}
                    getCursor={this.getCursor}
                    onViewportChange={this.onViewportChange}
                    mapboxApiAccessToken={}
                    mapStyle="mapbox://styles/mapbox/dark-v9" 
                >
                    { this.getMarkers() }
                    { this.getPopup() }
                    {/* <ControlPanel
                        containerComponent={this.props.containerComponent}
                        onChange={this._onStyleChange} /> */}
                </ReactMapGL>
            </div>
        )
    }
}

export default withRouter(Map)