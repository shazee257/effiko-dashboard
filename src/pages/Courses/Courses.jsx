import "./Courses.css";
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

export default function Courses() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await axios.get(`${process.env.React_App_baseURL}/courses`);
      setData(response.data.courses);
      console.log(response.data.courses);
      setLoading(false);
    }
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`${process.env.React_App_baseURL}/courses/${id}`)
      .then(({ data }) => toast.success(data.message));
    setData(data.filter((item) => item._id !== id));
  }

  const columns = [
    { field: "id", headerName: "ID", width: 330, hide: true },
    {
      field: "title", headerName: "Title", width: 320,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={`${process.env.React_App_uploadURL}/${params.row.image}`} />
            {params.row.title}
          </div>
        );
      },
    },
    { field: "description", headerName: "Description", width: 500 },
    {
      field: "createdAt", headerName: "Published on", width: 160,
      valueFormatter: (params) => moment(params.value).format('DD-MMM-YYYY'),
    },
    {
      field: "action", filterable: false, sortable: false,
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <Link href={"/courses/update/" + params.row.id}>
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
            <h2 className="productTitle">All Courses</h2>
            <Link href="/newcourse">
              <Button variant="contained" color="primary" component="label" >Create New</Button>
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
              // rowsPerPageOptions={[15, 30, 45, 60]}
              style={{ height: '550px' }}
            />
          )}
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>

  );
}