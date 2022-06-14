import React from "react";
import "./topbar.css";
import { NotificationsNone, Language, Settings } from "@material-ui/icons";
import { Typography } from "@material-ui/core";


export default function Topbar() {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("profileInfo");
  }

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <Typography component="h1" variant="h4" align="center" color="textSecondary" gutterBottom style={{ marginTop: '15px' }}>
            effiko
          </Typography>
        </div>
        <div className="topCenter" style={{ display: 'flex' }}>

          <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom style={{ marginTop: '15px' }}>
            Dashboard - Admin Panel
          </Typography>
        </div>
        <div className="topRight">
          <div className="userRol">

          </div>
          <div onClick={handleLogout} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <img src="https://www.bastiaanmulder.nl/wp-content/uploads/2013/11/dummy-image-square.jpg" className="topAvatar" />
            Logout
          </div>
        </div>
      </div>
    </div>
  );
}
