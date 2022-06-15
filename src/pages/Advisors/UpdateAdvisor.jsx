import "./UpdateAdvisor.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography, Link, Select, InputLabel, MenuItem, FormControl } from '@material-ui/core'
import { DeleteOutline } from "@material-ui/icons";
import axios from 'axios';

export default function UpdateCourse({ match }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [image, setImage] = useState("");
  const [img_address, setImg_address] = useState("");
  const [filename, setFilename] = useState("Choose Image");

  const { id } = match.params;

  useEffect(() => {
    const fetchAdvisor = async () => {
      const { data } = await axios.get(`${process.env.React_App_baseURL}/advisors/${id}`);
      setName(data.advisor.name);
      setDescription(data.advisor.description);
      setPhoneNo(data.advisor.phone_no);
      setLinkedin(data.advisor.linkedin_url);
      setImage(data.advisor.image);
      console.log(data.advisor);
    }
    fetchAdvisor();
  }, []);

  const fileSelectedHandler = async (e) => {
    if (e.target.value) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImg_address(reader.result);
        };
      }
      reader.readAsDataURL(e.target.files[0]);
      setFilename(e.target.files[0].name);

      const fd = new FormData();
      fd.append('image', e.target.files[0]);

      const config = { headers: { 'Content-Type': 'multipart/form-data' } }

      await axios
        .put(`${process.env.React_App_baseURL}/advisors/${id}/image`, fd, config)
        .then(({ data }) => toast.success(data.message))
        .catch((err) => {
          let message = err.response ? err.response.data.message : "Only image files are allowed!";
          toast.error(message)
        });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const advisor = {
      name,
      description,
      phone_no: phoneNo,
      linkedin_url: linkedin
    };

    try {
      await axios
        .put(`${process.env.React_App_baseURL}/advisors/${id}`, advisor)
        .then(({ data }) => {
          console.log(data);
          data.success && toast.success(data.message);
        }).catch((err) => {
          let message = err.response ? err.response.data.message : "Something went wrong!";
          toast.error(message)
        });
    } catch (error) {
      toast.error("Advisor is not updated, please try again", error);
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
                  <h2>Edit Profile of Career Advisor</h2>
                </Grid>
                <br />
                <TextField className="addProductItem" label='Course Name' placeholder='Enter Course Name' fullWidth name="name" value={name} onChange={(e) => setName(e.target.value)} />
                <br />
                <TextField className="addProductItem" label='Description' placeholder="Description" fullWidth multiline maxRows={5} name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <br />
                <TextField className="addProductItem" label='Phone No' placeholder="Phone No" fullWidth name="phoneNo" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
                <br />
                <TextField className="addProductItem" label='LinkedIn URL' placeholder="LinkedIn URL" fullWidth multiline name="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                <br /><br />

                <div className="addProductItem">
                  <Button variant="contained" component="label" >Choose Image
                    <input type="file" name="image" hidden onChange={fileSelectedHandler} accept="image/*" />
                  </Button>
                  <div><small>Only jpg, png, gif, svg images are allowed with max size of 10 MB</small></div>
                </div>
                <Button onClick={handleSubmit} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Update Profile</Button>
                <br /><br />
                <Typography >
                  <Link href="/advisors" >
                    Back to List of Career Advisors
                  </Link>
                </Typography>
              </Paper>
            </Grid>
            <ToastContainer position="top-right" />
          </div>
          <div className="ProductImage" style={{ width: '300px', margin: "50px 20px", alignContent: 'center', border: '3px dashed grey', display: 'flex', height: '300px', alignItems: 'center', flexDirection: 'column' }}>
            {(img_address) ? (<img className="img-object-fit" src={img_address} style={{ margin: "0 auto", borderRadius: '50px', height: '300px', width: '300px' }}></img>) :
              (<img className="img-object-fit" src={`${process.env.React_App_uploadURL}/${image}`} style={{ margin: "0 auto", borderRadius: '50px', height: '300px', width: '290px' }}></img>)}
          </div >
          <br />
        </div >
      </div >
      <ToastContainer position="top-right" />
    </div >
  );

}
