import "./Linkedin.css";
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

export default function Linkedin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinkedin = async () => {
      const { data } = await axios.get(`${process.env.React_App_baseURL}/linkedin`);
      setData(data.linkedin);
      console.log(data.linkedin);
      setLoading(false);
    }
    fetchLinkedin();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`${process.env.React_App_baseURL}/linkedin/${id}`)
      .then(({ data }) => toast.success(data.message));
    setData(data.filter((item) => item._id !== id));
  }

  const columns = [
    { field: "id", headerName: "ID", width: 330, hide: true },
    { field: "user_name", headerName: "User Name", width: 300, },
    { field: "linkedin_email", headerName: "LinkedIn email", width: 300 },
    {
      field: "createdAt", headerName: "Created on", width: 200,
      valueFormatter: (params) => moment(params.value).format('DD-MMM-YYYY hh:mm a'),
    },
    {
      field: "action", filterable: false, sortable: false,
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Link target="_blank" rel="noopener noreferrer" href={`${process.env.React_App_uploadURL}/` + params.row.cv}>
              <button className="productListEdit">Click to open CV</button>
            </Link>
            <DeleteOutline
              className="productListDelete"
              onClick={() => handleDelete(params.row.id)}
            />
          </>
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
            <h2 className="productTitle">LinkedIn Optimization</h2>
            <Link href="/categories/create">
              <Button variant="contained" color="primary" component="label" hidden >Create New</Button>
            </Link>
          </div>
          {(loading) ? <LoadingPanel /> : (
            <DataGrid
              rows={data}
              disableSelectionOnClick
              columns={columns}
              pageSize={15}
              rowHeight={40}
              checkboxSelection
              style={{ height: '700px' }}
            />
          )}
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>

  );
}