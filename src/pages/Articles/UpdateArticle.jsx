import "./UpdateArticle.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography, Link, Select, InputLabel, MenuItem, FormControl } from '@material-ui/core'
import axios from 'axios';

export default function UpdateArticle({ match }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [img_address, setImg_address] = useState("");

  const { id } = match.params;

  useEffect(() => {
    fetchArticle();
    getCategories();
  }, [id]);

  const fetchArticle = async () => {
    const { data } = await axios.get(`${process.env.React_App_baseURL}/articles/${id}`);
    setTitle(data.article.title);
    setBody(data.article.body);
    setImage(data.article.image);
    setCategoryId(data.article.category_id._id);
  }

  const getCategories = async () => {
    await axios
      .get(`${process.env.React_App_baseURL}/categories`)
      .then(({ data }) => setCategories(data.categories));
  }

  const fileSelectedHandler = async (e) => {
    if (e.target.value) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImg_address(reader.result);
        };
      }
      reader.readAsDataURL(e.target.files[0]);

      const fd = new FormData();
      fd.append('image', e.target.files[0]);

      const config = { headers: { 'Content-Type': 'multipart/form-data' } }

      await axios
        .put(`${process.env.React_App_baseURL}/articles/${id}/image`, fd, config)
        .then(({ data }) => toast.success(data.message))
        .catch((err) => {
          let message = err.response ? err.response.data.message : "Only image files are allowed!";
          toast.error(message)
        });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const article = {
      title,
      body,
      category_id: categoryId
    };

    try {
      await axios
        .put(`${process.env.React_App_baseURL}/articles/${id}`, article)
        .then(({ data }) => {
          if (data.success) {
            return toast.success(data.message);
          } else {
            toast.error("Article is not updated!, please try again");
          }
        });

    } catch (error) {
      toast.error("Article is not updated, please try again", error);
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
                  <h2>Update Article</h2>
                </Grid>
                <br />
                <TextField className="addProductItem" label='Course Title' placeholder='Enter Course Title' fullWidth name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <br />
                <TextField className="addProductItem" label='Description' placeholder="Description" fullWidth multiline maxRows={5} name="body" value={body} onChange={(e) => setBody(e.target.value)} />
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
                  <div><small>Only jpg, png, gif, svg images are allowed with max size of 10 MB</small></div>
                </div>
                <Button onClick={handleSubmit} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Update Course</Button>
                <br /><br />
                <Typography >
                  <Link href="/articles" >
                    Back to Articles
                  </Link>
                </Typography>
              </Paper>
            </Grid>
            <ToastContainer position="top-right" />
          </div>
          <div className="ProductImage" style={{ width: '300px', margin: "50px 20px", alignContent: 'center', border: '3px dashed grey', display: 'flex', height: '300px', alignItems: 'center', flexDirection: 'column' }}>
            {(img_address) ? (<img alt="Course" className="img-object-fit" src={img_address} style={{ margin: "0 auto", borderRadius: '50px', height: '300px', width: '300px' }}></img>) :
              (<img alt="Course " className="img-object-fit" src={`${process.env.React_App_uploadURL}/${image}`} style={{ margin: "0 auto", borderRadius: '50px', height: '300px', width: '290px' }}></img>)}
          </div >
          <br />
        </div >
      </div >
      <ToastContainer position="top-right" />
    </div >
  );

}
