import "./Advisors.css";
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

export default function Advisors() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const fetchAdvisors = async () => {
      const { data } = await axios.get(`${process.env.React_App_baseURL}/advisors`);
      setData(data.advisors);
      console.log(data.advisors);
      setLoading(false);
    }
    fetchAdvisors();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`${process.env.React_App_baseURL}/advisors/${id}`)
      .then(({ data }) => toast.success(data.message));
    setData(data.filter((item) => item._id !== id));
  }

  const columns = [
    { field: "id", headerName: "ID", width: 330, hide: true },
    {
      field: "advisor", headerName: "Career Advisors", width: 250,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={`${process.env.React_App_uploadURL}/${params.row.image}`} />
            {params.row.name}
          </div>
        );
      },
    },
    { field: "description", headerName: "Description", width: 450 },
    { field: "phone_no", headerName: "Contact No", width: 150 },
    { field: "linkedin_url", headerName: "LinkedIn Profile", width: 350 },
    {
      field: "createdAt", headerName: "Added on", width: 200,
      valueFormatter: (params) => moment(params.value).format('DD-MMM-YYYY hh:mm a'),
    },
    {
      field: "action", filterable: false, sortable: false,
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <Link href={"/advisors/update/" + params.row.id}>
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
            <h2 className="productTitle">Career Advisors</h2>
            <Link href="/newadvisor">
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