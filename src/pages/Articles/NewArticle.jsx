import "./NewArticle.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography, Link, Select, InputLabel, MenuItem, FormControl } from '@material-ui/core'
import axios from 'axios';
import { DeleteOutline } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

export default function NewArticle() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [filename, setFilename] = useState("Choose Image");
  const [selectedFile, setSelectedFile] = useState("");

  const history = useHistory();

  const fileSelectedHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) setImage(reader.result);
    }
    reader.readAsDataURL(e.target.files[0]);
    setSelectedFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  }

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    await axios
      .get(`${process.env.React_App_baseURL}/categories`)
      .then(({ data }) => setCategories(data.categories));
  }

  const clearForm = () => {
    setTitle("");
    setBody("");
    setCategoryId("");
    setImage("");
    setSelectedFile("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    fd.append('image', selectedFile);
    fd.append('category_id', categoryId);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    try {
      await axios
        .post(`${process.env.React_App_baseURL}/articles`, fd, config)
        .then(({ data }) => {
          if (data.success) {
            toast.success(data.message);
            clearForm();
          } else {
            toast.error("Article is not added!, please try again");
          }
        });

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
                  <h2>New Article</h2>
                </Grid>
                <br />
                <form encType='multipart/form-data'>
                  <TextField className="addProductItem" label='Title' placeholder='Enter Article Title' fullWidth name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <br />
                  <TextField className="addProductItem" label='Body' placeholder="Article Body" fullWidth multiline maxRows={5} name="body" value={body} onChange={(e) => setBody(e.target.value)} />
                  <br /><br />

                  <InputLabel id="demo-simple-select-label">Category</InputLabel>
                  <Select label="Category" fullWidth onChange={(e) => setCategoryId(e.target.value)} value={categoryId}>
                    {categories.map((category) => (
                      <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>
                    ))}
                  </Select>
                  <br /><br />

                  <div className="addProductItem">
                    <Button variant="contained" component="label" >Choose Image
                      <input type="file" name="image" hidden onChange={fileSelectedHandler} accept="image/*" />
                    </Button>
                    <div><small>Only jpg, png, gif, svg images are allowed with max size of 5 MB</small></div>
                  </div>

                  <Button onClick={handleSubmit} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Add Article</Button>
                </form>
                <br />
                <Typography >
                  <Link href="/articles" >
                    Back to Articles
                  </Link>
                </Typography>
              </Paper>
            </Grid>
            <ToastContainer position="top-right" />
          </div>
          <div className="ProductImage" style={{ width: '300px', margin: "80px 20px", alignContent: 'center', border: '3px dashed grey', display: 'flex', height: '300px', alignItems: 'center' }}>
            {selectedFile && (<img src={image} style={{ margin: "0 auto", borderRadius: '50px', height: '300px', width: '300px' }}></img>)}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div >
  );
}
