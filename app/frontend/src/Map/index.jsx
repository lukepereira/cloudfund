import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactMapGL, {Marker, Popup, FlyToInterpolator} from 'react-map-gl'
import Pin from './Pin'
import { REGION_NAMES, REGIONS, INITIAL_VIEWPORT } from './constants'

import './Map.css'
import 'mapbox-gl/dist/mapbox-gl.css'

class Map extends Component {
    state = {
        viewport: INITIAL_VIEWPORT,
        width: 0,
        height: 0,
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
        
        this.setState({width, height })
        this.onViewportChange({})
    }
    
    getHeight = () => {
        return  this.state.height - 64
    }
    
    getWidth = () => {
        return  this.state.width - 240
    }
    
    onViewportChange = (updatedViewport) => {
        const viewport = {
            ...this.state.viewport,
            height: this.getHeight(),
            width: this.getWidth(),
            transitionInterpolator: new FlyToInterpolator(),
            transitionDuration: 1150,
            ...updatedViewport,
        }
        this.setState({viewport})
    }
    
    onPinClick = (selectedRegion) => {
        this.onViewportChange({
            latitude: REGIONS[selectedRegion].latitude,
            longitude: REGIONS[selectedRegion].longitude,
            zoom: 3.487,
            pitch: 70,
        })
        this.setState({selectedRegion})
    }
    
    getProjectsByLocation = (location) => {
        return this.props.projects_list &&
            this.props.projects_list.filter((project) => {
                return project.cluster_location.indexOf(location) > -1
            })
    }
    
    getMarkers = () => {        
        return REGION_NAMES.map((regionName, index) => {
        
            if (!REGIONS[regionName].latitude || !REGIONS[regionName].longitude) {
                return
            }
            const projects = this.getProjectsByLocation(regionName)
            return (
                <Marker
                    key={`marker-${index}`}
                    latitude= {REGIONS[regionName].latitude}
                    longitude={REGIONS[regionName].longitude}
                 >
                    <Pin
                        key={`pin-${index}`}
                        size={15}
                        text={projects && projects.length}
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
        const projects = this.getProjectsByLocation(selectedRegion)
        
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
                    <div className={'PopupTopSpace'} />
                    {/* <div className={'PopupTextRow'}>
                        <div className={'PopupTextTitle'}>Location:</div>
                        <div className={'PopupTextValue'}>{selectedRegion}</div>    
                    </div> */}
                    <div className={'PopupTextRow'}>
                        <div className={'PopupTextTitle'}>Clusters:</div>
                        <div className={'PopupTextValue'}>{(projects && projects.length) || 0}</div>
                    </div>
                    {
                        projects.length > 0 &&
                        <div>
                            <div className={'PopupTextTitle'}>Projects:</div>
                            {this.getProjectLinks(projects)}
                        </div>
                    }
                    <div className={'PopupBottomSpace'} />
                </div>
            </Popup>
        )
    }
    
    getProjectLinks = (projects) => (
        projects.map((project, i) => {
            return (
                <div
                    key={`project_${i}`}
                    className={'projectLink'}
                    onClick={() => this.props.history.push(`/project/${project.project_id}`)}
                >
                    {`→ ${project.project_name}`}
                </div>    
            )
        })
    )
    
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
                    mapboxApiAccessToken={'pk.eyJ1IjoibHVrZXBsYXRvIiwiYSI6ImNqNjJsMnJnNTE4MW0ycW1vcmxtNDU3ZmYifQ.rS-ceguS8DMmMNVAYz_9gQ'}
                    mapStyle="mapbox://styles/mapbox/dark-v9" 
                >
                    { this.getMarkers() }
                    { this.getPopup() }
                </ReactMapGL>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    projects_list: state.projectsReducer.projects_list,
})

export default withRouter(connect(mapStateToProps)(Map))