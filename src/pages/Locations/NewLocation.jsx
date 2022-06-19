import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography, Link } from '@material-ui/core'
import axios from 'axios';

export default function NewLocation() {
  const [lng, setLng] = useState();
  const [lat, setLat] = useState();

  // function to clear form fields
  const clearForm = () => {
    setLng("");
    setLat("");
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    const coordinates = { lng: Number(lng), lat: Number(lat) };

    try {
      await axios
        .post(`${process.env.React_App_baseURL}/locations`, coordinates)
        .then(({ data }) => {
          data.success && toast.success("Location Coordinates added successfully!") && clearForm();
        });
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
                  <h2>Add New Coordinates of Location</h2>
                </Grid>
                <br />
                <form>
                  <TextField className="addProductItem" label='Latitude' placeholder='Enter Latitude' fullWidth name="lat" value={lat} onChange={(e) => setLat(e.target.value)} />
                  <br />
                  <TextField className="addProductItem" label='Longitude' placeholder="Enter Longitude" fullWidth name="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} />
                  <br /><br />
                  <Button onClick={handleSubmit} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Add Coordinates</Button>
                </form>
                <br />
                <Typography >
                  <Link href="/locations" >
                    Back to Location List
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
