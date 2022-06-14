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

export default function CategoryList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const token = localStorage.getItem("token");

  useEffect(async () => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      await axios.get(`${process.env.React_App_baseURL}/categories`).then(({ data }) => {
        setData(data.categories);
        console.log(data.categories);
        setLoading(false);
      });
    } else {
      history.push("/login");
    }
  }, []);

  const handleDelete = async (id) => {
    await axios.put(`${process.env.React_App_baseURL}/category/delete/${id}`)
      .then(({ data }) => toast.success(data.message));
    setData(data.filter((item) => item._id !== id));
  }

  const columns = [
    { field: "id", headerName: "ID", width: 230, hide: true },
    {
      field: "category_name", headerName: "Product", width: 300,
      renderCell: (params) => {
        return params.row.category_name;
      },
    },
    { field: "description", headerName: "Description", width: 500 },
    {
      field: "action", filterable: false, sortable: false,
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        // console.log(params);
        return (
          <>
            <Link href={"/category/update/" + params.row.id}>
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
            <h2 className="productTitle">All Categories</h2>
            <Link href="/category/create">
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