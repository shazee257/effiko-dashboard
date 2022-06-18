import "./Locations.css";
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
const { formatDate } = require("../../utils/utils");

export default function Locations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      const { data } = await axios.get(`${process.env.React_App_baseURL}/locations`);
      setData(data.locations);
      console.log(data.locations);
      setLoading(false);
    }
    fetchLocations();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`${process.env.React_App_baseURL}/locations/${id}`)
      .then(({ data }) => toast.success(data.message));
    setData(data.filter((item) => item._id !== id));
  }

  const columns = [
    { field: "id", headerName: "ID", width: 330 },
    {
      field: "coordinates", headerName: "Locations", width: 300,
      valueFormatter: (params) => {
        return `Latitude: ${params.value.lat}, Longitude: ${params.value.lng}`;
      }
    },
    {
      field: "createdAt", headerName: "Created on", width: 200,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "action", filterable: false, sortable: false,
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <DeleteOutline
            className="productListDelete"
            onClick={() => handleDelete(params.row.id)}
          />
        );
      },
    },
  ];

  return (
    <div>
      <Topbar />
      <div className="container">
        <Sidebar />
        <div className="productList">
          <div className="productTitleContainer">
            <h2 className="productTitle">Our Offices Locations</h2>
            <Link href="/newlocation">
              <Button variant="contained" color="primary" component="label"  >Create New</Button>
            </Link>
          </div>
          {(loading) ? <LoadingPanel /> : (
            <DataGrid
              rows={data}
              disableSelectionOnClick
              columns={columns}
              pageSize={10}
              rowHeight={40}
              checkboxSelection
              style={{ height: '550px' }}
            />
          )}
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>

  );
}