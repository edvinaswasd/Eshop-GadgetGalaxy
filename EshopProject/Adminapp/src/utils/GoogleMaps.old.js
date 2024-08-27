import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
 
const AnyReactComponent = ({ text }) => <div>{text}</div>;
 
class GoogleMap extends Component {
    constructor(props){
        super(props)
        this.state ={
            lat:'',
            lng:''
        }
    }


  static defaultProps = {
    center: {
      lat: 6.9271,
      lng: 79.8612
    },
    zoom: 11
  };
 
  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '200px', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyA4T1ksh0QG00chsk8WVAYkdGnsCjWLjPY' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          {/* <AnyReactComponent
            lat={6.9271}
            lng={79.8612}
            text="My Marker"
          /> */}
        </GoogleMapReact>
      </div>
    );
  }
}
 
export default GoogleMap;