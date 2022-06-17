import "./Interviews.css";
import { DataGrid } from "@material-ui/data-grid";
import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import axios from 'axios';
import { DeleteOutline } from "@material-ui/icons";
import { Button, Hidden, Link } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";
import LoadingPanel from "../../components/loader/loader";
import moment from "moment";

export default function Interviews() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      const { data } = await axios.get(`${process.env.React_App_baseURL}/interviews`);
      setData(data.interviews);
      console.log(data.interviews);
      setLoading(false);
    }
    fetchInterviews();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`${process.env.React_App_baseURL}/interviews/${id}`)
      .then(({ data }) => toast.success(data.message));
    setData(data.filter((item) => item._id !== id));
  }

  const columns = [
    { field: "id", headerName: "ID", width: 330, hide: true },
    { field: "title", headerName: "Title", width: 320, },
    { field: "description", headerName: "Description", width: 550 },
    {
      field: "url", headerName: "Youtube link", width: 180,
      renderCell: (params) => {
        return (
          <Link href={params.value} target="_blank">
            <button className="productListEdit">Watch Interview</button>
          </Link>
        );
      }
    },
    {
      field: "createdAt", headerName: "Posted on", width: 200,
      valueFormatter: (params) => moment(params.value).format('DD-MMM-YYYY hh:mm a'),
    },
    {
      field: "action", filterable: false, sortable: false,
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <Link href={"/interviews/update/" + params.row.id}>
              <button className="productListEdit">Edit</button>
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
            <h2 className="productTitle">Interviews</h2>
            <Link href="/interviews/create">
              <Button variant="contained" color="primary" component="label" >Create New</Button>
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
              style={{ height: '800px' }}
            />
          )}
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>

  );
}