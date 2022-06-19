import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography, Link, Select, MenuItem, InputLabel } from '@material-ui/core'
import axios from 'axios';
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import "react-quill/dist/quill.snow.css";
import './styles.css';

export default function AddAndUpdateArticle() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [categories, setcategories] = useState([]);

  const params = useParams();

  useEffect(() => {
    params.id && getArticle();
    getCategories();
  }, [params.id]);

  const getArticle = async () => {
    await axios
      .get(`${process.env.React_App_baseURL}/articles/${params.id}`)
      .then(({ data }) => {
        if (data.success) {
          setTitle(data.article.title);
          setBody(data.article.body);
          setCategoryId(data.article.category_id.id);
          setCategoryName(data.article.category_id.name);
          setIsEditMode(true);
        }
      });
  }

  const getCategories = async () => {
    await axios
      .get(`${process.env.React_App_baseURL}/categories`)
      .then(({ data }) => setcategories(data.categories));
  }

  const clearForm = () => {
    setTitle("");
    setBody("");
    setCategoryId("");
    setCategoryName("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const article = { title, body, category_id: categoryId };

    try {
      if (isEditMode) {
        await axios
          .put(`${process.env.React_App_baseURL}/articles/${params.id}`, article)
          .then(({ data }) => {
            if (data.success) {
              toast.success(data.message)
            }
          }).catch((err) => toast.error(err.message));
      } else {
        await axios
          .post(`${process.env.React_App_baseURL}/articles`, article)
          .then(({ data }) => {
            if (data.success) {
              toast.success("Article added successfully!");
              clearForm();
            }
          }).catch((err) => toast.error(err.message));
      }

    } catch (error) {
      toast.error(error);
    }
  };

  const handleSelect = (e) => {
    setCategoryId(e.target.value);
    // console.log(e.target.options[e.target.selectedIndex].text);
  }

  const paperStyle = { padding: 20, margin: "" }
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
                  <h2>{isEditMode ? "Update Article" : "New Article"}</h2>
                </Grid>
                <br />
                <form>
                  <TextField className="addProductItem" label='Title' placeholder='Enter Title' fullWidth name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <br /><br /><br />
                  {/* <TextField className="addProductItem" label='Article Body' placeholder="Body" fullWidth multiline minRows={2} maxRows={5} name="body" value={body} onChange={(e) => setBody(e.target.value)} />
                  <br /> */}
                  <EditorToolbar />
                  <ReactQuill
                    theme="snow"
                    value={body}
                    onChange={(e) => setBody(e)}
                    placeholder={"Write something awesome..."}
                    modules={modules}
                    formats={formats}
                  />
                  <br />

                  <InputLabel id="demo-simple-select-label">Category</InputLabel>
                  <Select label="Category" fullWidth onChange={handleSelect} value={categoryId}>
                    {categories.map((category) => (
                      <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>
                    ))}
                  </Select>
                  <br /><br />
                  <Button onClick={handleSubmit} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>
                    {isEditMode ? "Update Article" : "Publish Article"}</Button>
                </form>
                <br />
                <Typography >
                  <Link href="/articles" >
                    Back to Articles
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
