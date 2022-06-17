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
import { useHistory } from "react-router-dom";
import LoadingPanel from "../../components/loader/loader";
import moment from "moment";

export default function Books() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pdf = document.querySelector("#pdf");

    console.log("Value is : ", pdf.file.length);


    return;
    // const formData = new FormData(e.target);
    // const config = {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // }

    // return console.log(e.target, id);
    // await axios.post(`${process.env.React_App_baseURL}/books/${e}/upload`, formData, config)
    //   .then(({ data }) => {
    //     if (data.success) {
    //       toast.success && toast.success(data.message);
    //       history.push("/books");
    //     } else {
    //       toast.error("Book is not added!, please try again");
    //     }
    //   }).catch(error => {
    //     let message = error.response ? error.response.data.message : "Only image files are allowed!";
    //     toast.error(message);
    //   });
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
    { field: "author", headerName: "Author", width: 240 },
    {
      field: "createdAt", headerName: "Published on", width: 200,
      valueFormatter: (params) => moment(params.value).format('DD-MMM-YYYY hh:mm a'),
    },
    {
      field: "pdf", filterable: false, sortable: false, headerName: "Books (PDF)", width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link target="_blank" rel="noopener noreferrer" href={`${process.env.React_App_uploadURL}/` + params.row.pdf}>
              <button className="productListEdit">Click to Read Book</button>
            </Link>
            <Button className="productListEdit" onClick={() => handleDelete(params.row.id)}>
              <CloudUploadRounded style={{ height: '15px' }} />
            </Button>
          </>
        );
      },
    },
    {
      field: "upload", filterable: false, sortable: false, headerName: "Upload Book", width: 490,
      renderCell: (params) => {
        return (
          <>
            <form encType='multipart/form-data'>
              <Button variant="contained" component="label">
                <input type="file" id="pdf" name="pdf" accept="application/pdf" />
              </Button>
              <Button onClick={handleSubmit} type='submit' color='secondary' variant="contained">Publish</Button>
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
              pageSize={15}
              rowHeight={40}
              checkboxSelection
              rowsPerPageOptions={[15, 30, 45, 60]}
              style={{ height: '800px' }}
            />
          )}
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>

  );
}