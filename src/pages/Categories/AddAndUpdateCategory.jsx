import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography, Link } from '@material-ui/core'
import axios from 'axios';
import { useParams } from "react-router-dom";

export default function AddAndUpdateCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const params = useParams();

  useEffect(() => {
    getCategoryById();
  }, [params.id]);

  const getCategoryById = async () => {
    await axios
      .get(`${process.env.React_App_baseURL}/categories/${params.id}`)
      .then(({ data }) => {
        console.log(data);
        if (data.success) {
          setName(data.category.name);
          setDescription(data.category.description);
          setIsEditMode(true);
        }
      });
  }

  // function to clear form fields
  const clearForm = () => {
    setName("");
    setDescription("");
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    const category = { name, description };

    try {
      if (isEditMode) {
        await axios
          .put(`${process.env.React_App_baseURL}/categories/${params.id}`, category)
          .then(({ data }) => {
            if (data.success) {
              toast.success("Category updated successfully!");
              // history.push("/categories");
            }
          });
      } else {
        await axios
          .post(`${process.env.React_App_baseURL}/categories`, category)
          .then(({ data }) => {
            if (data.success) {
              toast.success("Category added successfully!");
              clearForm();
              // history.push("/categories");
            }
          });
      }

    } catch (error) {
      toast.error(error);
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
                  <h2>{isEditMode ? "Update Article Category" : "New Article Category"}</h2>
                </Grid>
                <br />
                <form>
                  <TextField className="addProductItem" label='Category Name' placeholder='Enter Category Name' fullWidth name="name" value={name} onChange={(e) => setName(e.target.value)} />
                  <br />
                  <TextField className="addProductItem" label='Description' placeholder="Description" fullWidth multiline minRows={2} maxRows={5} name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                  <br /><br />
                  <Button onClick={handleSubmit} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>{isEditMode ? "Update Category" : "Create Category"}</Button>
                </form>
                <br />
                <Typography >
                  <Link href="/categories" >
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
