import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography, Link } from '@material-ui/core'
import axios from 'axios';
import { useHistory, useParams } from "react-router-dom";

export default function AddUpdateCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const history = useHistory();
  const params = useParams();
  const token = localStorage.getItem("token");
  axios.defaults.headers.common['Authorization'] = token;

  useEffect(() => {
    getCategoryById();
  }, [params.id]);

  const getCategoryById = async () => {
    await axios
        .get(`${process.env.React_App_baseURL}/category/${params.id}`)
        .then(({ data }) => {
          if (data.status === 200) {
            setCategoryName(data.category.category_name);
            setDescription(data.category.description);
            setIsEditMode(true);
          }
        });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = token;

    try {
      if (isEditMode) {
        await axios
          .put(`${process.env.React_App_baseURL}/category/update/${params.id}`, {category_name: categoryName, description})
          .then(({ data }) => {
            if (data.status === 200) {
              // toast.success("Product add successfully!");
              history.push("/categories");
            }
          });
      } else {

        await axios
          .post(`${process.env.React_App_baseURL}/category/create`, {category_name: categoryName, description})
          .then(({ data }) => {
            if (data.status === 200) {
              // toast.success("Product add successfully!");
              history.push("/categories");
            }
          });
      }

    } catch (error) {
      let message = error.response ? error.response.data.message : "Only image files are allowed!";
      toast.error(message);
    }
  };

  const paperStyle = { padding: 20, width: 400, margin: "" }
  const btnstyle = { margin: '8px 0' }

  return (
    <div>
      <Topbar />
      <div className="container">
        <Sidebar />
        <div className="newProduct" style={{ display: 'flex' }}>
          <div >
            <Grid>
              <Paper elevation={0} style={paperStyle}>
                <Grid align='left'>
                  <h2>{isEditMode ? "Update Category" : "New Category"}</h2>
                </Grid>
                <br />
                <form>
                  <TextField className="addProductItem" label='Category Name' placeholder='Enter Category Name' fullWidth name="category_name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                  <br />
                  <TextField className="addProductItem" label='Description' placeholder="Description" fullWidth multiline minRows={2} maxRows={5} name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                  
                  <Button onClick={handleSubmit} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>{isEditMode ? "Update Category" : "Create Category"}</Button>
                </form>
                <br />
                <Typography >
                  <Link href="/products" >
                    Back to Category List
                  </Link>
                </Typography>
              </Paper>
            </Grid>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div >
  );

}
