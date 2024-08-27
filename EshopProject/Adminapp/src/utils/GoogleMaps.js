import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import RoomIcon from "@material-ui/icons/Room";

const AnyReactComponent = ({ text }) => (
  <RoomIcon fontSize="large" color="error" />
);

export default function GoogleMaps({ location }) {
  const [defaultProps, setState] = useState({
    center: {
      lat: 9.6615,
      lng: 80.0255,
    },
    zoom: 11,
  });

  useEffect(() => {
    
    if (location && location.coordinates &&   location.coordinates.length) {
      setState((prev) => ({
        ...prev,

        center: { lat: location.coordinates[1], lng: location.coordinates[0] },
      }));
    }
  }, [location]);

  // static defaultProps =;
  return (
    <div style={{ height: "200px", width: "100%" }}>
     
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_PLACES_KEY }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        options={
          {
            fullscreenControl: false,
            zoomControl:false
          }
        }
      >
        <AnyReactComponent
          lat={defaultProps.center.lat}
          lng={defaultProps.center.lng}
        />
      </GoogleMapReact>
    </div>
  );
}

// class GoogleMap extends Component {
//     constructor(props){
//         super(props)
//         this.state ={
//             lat:'',
//             lng:''
//         }
//     }

//   static defaultProps = {
//     center: {
//       lat: 6.9271,
//       lng: 79.8612
//     },
//     zoom: 11
//   };

//   render() {
//     return (
//       // Important! Always set the container height explicitly
//       <div style={{ height: '200px', width: '100%' }}>
//         <GoogleMapReact
//           bootstrapURLKeys={{ key: 'AIzaSyA4T1ksh0QG00chsk8WVAYkdGnsCjWLjPY' }}
//           defaultCenter={this.props.center}
//           defaultZoom={this.props.zoom}
//         >

//         </GoogleMapReact>
//       </div>
//     );
//   }
// }

// export default GoogleMap;
