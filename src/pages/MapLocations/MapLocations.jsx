// import "./home.css";
import { DataGrid } from "@material-ui/data-grid";
import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import axios from 'axios';
import { DeleteOutline } from "@material-ui/icons";
import { Button, Hidden, Link } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingPanel from "../../components/loader/loader";
import moment from "moment";
import SimpleMap from "./SimpleMap";

export default function MapLocations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  return (
    <div>
      <Topbar />
      <div className="container">
        <Sidebar />
        <div className="productList">
          <div className="productTitleContainer">
            <h2 className="productTitle">Dashboard Section</h2>
            <Link href="/newcourse">
              <Button variant="contained" color="primary" hidden component="label" >Create New</Button>
            </Link>

          </div>
          <div style={{ display: 'flex' }}>
            <SimpleMap />
            <SimpleMap />
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>

  );
}