import "./NewAdvisor.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography, Link, Select, InputLabel, MenuItem, FormControl } from '@material-ui/core'
import axios from 'axios';
import { DeleteOutline } from "@material-ui/icons";

export default function NewCourse() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [filename, setFilename] = useState("Choose Image");
  const [selectedFile, setSelectedFile] = useState("");

  const fileSelectedHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) setImage(reader.result);
    }
    reader.readAsDataURL(e.target.files[0]);
    setSelectedFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  }

  const clearForm = () => {
    setName("");
    setDescription("");
    setImage("");
    setFilename("Choose Image");
    setSelectedFile("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('name', name);
    fd.append('description', description);
    fd.append('image', selectedFile);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    try {
      await axios
        .post(`${process.env.React_App_baseURL}/advisors`, fd, config)
        .then(({ data }) => {
          data.success && toast.success("New Advisor added successfully!");
          clearForm();
        }).catch(err => {
          toast.error(err);
        })
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
                  <h2>New Career Advisor</h2>
                </Grid>
                <br />
                <form encType='multipart/form-data'>
                  <TextField className="addProductItem" label='Advisor Name' placeholder='Enter Advisor Name' fullWidth name="name" value={name} onChange={(e) => setName(e.target.value)} />
                  <br />
                  <TextField className="addProductItem" label='Description' placeholder="Description" fullWidth multiline maxRows={5} name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                  <br /><br />

                  <div className="addProductItem">
                    <Button variant="contained" component="label" >Choose Image
                      <input type="file" name="image" hidden onChange={fileSelectedHandler} accept="image/*" />
                    </Button>
                    <div><small>Only jpg, png, gif, svg images are allowed with max size of 5 MB</small></div>
                  </div>

                  <Button onClick={handleSubmit} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Add Advisor</Button>
                </form>
                <br />
                <Typography >
                  <Link href="/advisors" >
                    Back to List of Career Advisors
                  </Link>
                </Typography>
              </Paper>
            </Grid>
            <ToastContainer position="top-right" />
          </div>
          <div className="ProductImage" style={{ width: '300px', margin: "80px 20px", alignContent: 'center', border: '3px dashed grey', display: 'flex', height: '300px', alignItems: 'center' }}>
            {(selectedFile) ? (
              <img src={image} style={{ margin: "0 auto", borderRadius: '50px', height: '300px', width: '300px' }}></img>
            ) : ""}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div >
  );
}
