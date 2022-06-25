import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography, Link } from '@material-ui/core'
import axios from 'axios';
import { useParams } from "react-router-dom";

export default function AddAndUpdateInterview() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const params = useParams();

  useEffect(() => {
    getInterviewById();
  }, [params.id]);

  const getInterviewById = async () => {
    await axios.get(`${process.env.React_App_baseURL}/interviews/${params.id}`)
      .then(({ data }) => {
        if (data.success) {
          setTitle(data.interview.title);
          setDescription(data.interview.description);
          setUrl(data.interview.url);
          setIsEditMode(true);
        }
      });
  }

  // function to clear form fields
  const clearForm = () => {
    setTitle("");
    setDescription("");
    setUrl("");
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    const interview = { title, description, url };

    try {
      if (isEditMode) {
        await axios
          .put(`${process.env.React_App_baseURL}/interviews/${params.id}`, interview)
          .then(({ data }) => data.success && toast.success(data.message));
      } else {
        await axios
          .post(`${process.env.React_App_baseURL}/interviews`, interview)
          .then(({ data }) => {
            data.success && toast.success(data.message);
            clearForm();
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
                  <h2>{isEditMode ? "Update Interview" : "New Interview"}</h2>
                </Grid>
                <br />
                <form>
                  <TextField className="addProductItem" label='Title' placeholder='Enter Interview Title' fullWidth multiline minRows={2} maxRows={5} name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <br />
                  <TextField className="addProductItem" label='Description' placeholder="Description" fullWidth multiline minRows={2} maxRows={5} name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                  <br />
                  <TextField className="addProductItem" label='Interview URL' placeholder="Interview URL" fullWidth multiline minRows={2} maxRows={5} name="url" value={url} onChange={(e) => setUrl(e.target.value)} />
                  <br />
                  <Button onClick={handleSubmit} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>{isEditMode ? "Update an Interview" : "Add New Interview"}</Button>
                </form>
                <br />
                <Typography >
                  <Link href="/interviews" >
                    Back to Interviews
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
