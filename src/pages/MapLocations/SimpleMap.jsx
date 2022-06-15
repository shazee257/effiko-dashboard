import React from "react";
import GoogleMapReact from "google-map-react";
import pin from "./pin.png";
import { Link } from "react-router-dom";
const locations = require("./locations.json");

const SimpleMap = () => {
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          // key: "AIzaSyAV-Ytp-Bsw9I_fOw2NKxNqq4vMracossI"
          key: "AIzaSyA16d9FJFh__vK04jU1P64vnEpPc3jenec"
        }}
        defaultCenter={{
          lat: 24.888452222825606,
          lng: 67.09629977665645
        }}
        defaultZoom={12}
      >
        {locations.map(item => {
          if (item.address.length !== 0) {
            return item.address.map(i => {
              return (
                <Link to={"/" + item.name} key={i.id} lat={i.lat} lng={i.lng}>
                  <img style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translate(-50%, -100%)"
                  }} src={pin} alt="pin" />
                </Link>
              );
            });
          }
        })}
      </GoogleMapReact>
    </div>
  );
}

export default SimpleMap;
