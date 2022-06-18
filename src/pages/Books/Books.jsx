import "./Books.css";
import { DataGrid } from "@material-ui/data-grid";
import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import axios from 'axios';
import { DeleteOutline, CloudUploadRounded } from "@material-ui/icons";
import { Button, Hidden, Link } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingPanel from "../../components/loader/loader";
const { formatDate } = require("../../utils/utils");

export default function Books() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdf, setPdf] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const { data } = await axios.get(`${process.env.React_App_baseURL}/books`);
    setData(data.books);
    console.log(data.books);
    setLoading(false);
  }

  const handleDelete = async (id) => {
    await axios.delete(`${process.env.React_App_baseURL}/books/${id}`)
      .then(({ data }) => toast.success(data.message));
    setData(data.filter((item) => item._id !== id));
  }

  const handleUpload = async (e, id) => {
    e.preventDefault();

    if (!pdf.name) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append('pdf', pdf);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    await axios.post(`${process.env.React_App_baseURL}/books/${id}/upload`, formData, config)
      .then(({ data }) => {
        if (data.success) {
          toast.success && toast.success(data.message);
          // history.push("/books");
        } else {
          toast.error("Book is not added!, please try again");
        }
      }).catch(error => {
        let message = error.response ? error.response.data.message : "Only image files are allowed!";
        toast.error(message);
      });

    fetchBooks();
    setPdf("");
  }

  const columns = [
    { field: "id", headerName: "ID", width: 330, hide: true },
    {
      field: "title", headerName: "Title", width: 210,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={`${process.env.React_App_uploadURL}/${params.row.image}`} />
            {params.row.title}
          </div>
        );
      },
    },
    { field: "author", headerName: "Author", width: 190 },
    {
      field: "createdAt", headerName: "Added on", width: 140,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "pdf", filterable: false, sortable: false, headerName: "Books", width: 120,
      renderCell: (params) => {
        return (
          <>
            <Link target="_blank" rel="noopener noreferrer" href={`${process.env.React_App_uploadURL}/` + params.row.pdf}>
              {params.row.pdf ? (
                <button className="productListEdit">
                  Read Book
                </button>
              ) : (
                <button className="bookNA">
                  Not Available
                </button>
              )}

            </Link>
          </>
        );
      },
    },
    {
      field: "upload", filterable: false, sortable: false, headerName: "Upload Book", width: 320,
      renderCell: (params) => {
        return (
          <>
            <form encType='multipart/form-data'>
              <input type="file" id="pdf" name="pdf" accept="application/pdf" onChange={(e) => setPdf(e.target.files[0])} />
              <Button onClick={(e) => handleUpload(e, params.row.id)} size="small"
                variant="contained" color="primary">Publish</Button>
            </form>
          </>
        );
      },
    },
    {
      field: "action", filterable: false, sortable: false,
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <Link href={"/books/update/" + params.row.id}>
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
            <h2 className="productTitle">All Books</h2>
            <Link href="/newbook">
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