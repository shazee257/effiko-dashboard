import "./profile.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography, Link, Input, FormLabel, FormControlLabel, Checkbox } from '@material-ui/core'
import axios from 'axios';
import { useHistory } from "react-router-dom";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [payLeadTime, setPayLeadTime] = useState(0);
  const [phoneNo, setPhoneNo] = useState("");
  const [enableMarketing, setEnableMarketing] = useState(true);
  const [paynowUen, setPaynowUen] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [img_address, setImg_address] = useState("");
  // const [filename, setFilename] = useState("Choose Image");

  const [qrFile, setQrFile] = useState(null);
  const [qrImgAddress, setQrImgAddress] = useState("dummy-image-square.jpg");
  const [qrFilename, setQrFilename] = useState("dummy-image-square.jpg");

  const userData = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  const fileSelectedHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) setImg_address(reader.result);
    }
    reader.readAsDataURL(e.target.files[0]);
    setSelectedFile(e.target.files[0]);
    // setFilename(e.target.files[0].name);
    uploadImage(e.target.files[0]);
  }

  const QR_FileSelectedHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) setQrImgAddress(reader.result);
    }
    reader.readAsDataURL(e.target.files[0]);
    // console.log(e.target.files[0]);
    setQrFile(e.target.files[0]);
    setQrFilename(e.target.files[0].name);
    uploadQR(e.target.files[0]);
  }

  const uploadQR = async (file) => {
    const formData = new FormData();
    formData.append("paynow_qr_image", file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    await axios
      .put(`${process.env.React_App_baseURL}/profile/uploadQR`, formData, config)
      .then(({ data }) => {
        if (data.success === 200) {
          // Update profileInfo in localStorage
          localStorage.setItem("profileInfo", JSON.stringify(data.profile));
          setQrFile(null);
          setQrFilename(data.profile.paynow_qr_image);
          return toast.success("Image uploaded successfully!");
        } else {
          toast.error("Only image files are allowed!");
        }
      }).catch(error => {
        let message = error.response ? error.response.data.message : "Only image files are allowed!";
        toast.error(message);
      });
  }

  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append('profile_image', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    await axios
      .put(`${process.env.React_App_baseURL}/profile/upload`, fd, config)
      .then(({ data }) => {
        // console.log(data);
        if (data.success === 200) {
          // Update profileInfo in localStorage
          localStorage.setItem("profileInfo", JSON.stringify(data.profile));
          setSelectedFile(null);
          // setFilename("Choose Image");
          setProfileImage(data.profile.profile_image);
          return toast.success("Image uploaded successfully!");
        } else {
          toast.error('Only image files are allowed!');
        }
      }).catch(error => {
        let message = error.response ? error.response.data.message : "Only image files are allowed!";
        toast.error(message);
      });
  }

  const history = useHistory();

  const token = localStorage.getItem("token");

  const getProfile = async () => {
    await axios.get(`${process.env.React_App_baseURL}/profile`)
      .then(({ data }) => {
        setUsername(data.profile[0].username);
        setAddress(data.profile[0].address);
        if (data.profile[0].pay_lead_time == undefined) {
          setPayLeadTime(0);
        } else {
          setPayLeadTime(data.profile[0].pay_lead_time);
        }
        setPaynowUen(data.profile[0].paynow_uen);
        setPhoneNo(data.profile[0].phone_no);
        setEnableMarketing(data.profile[0].marketing_emails);
        (data.profile[0].profile_image == undefined) ? setProfileImage("dummy-image-square.jpg") : setProfileImage(data.profile[0].profile_image);
        (data.profile[0].paynow_qr_image == undefined) ? setQrFilename("dummy-image-square.jpg") : setQrFilename(data.profile[0].paynow_qr_image);
      })
  }

  useEffect(async () => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      getProfile();
    } else history.push("/login");
  }, []);

  const updateProfile = async (data) => {
    // try {
    await axios
      .put(`${process.env.React_App_baseURL}/profile/update`, data)
      .then(({ data }) => {
        if (data.success === 200) {
          localStorage.setItem("profileInfo", JSON.stringify(data.profile));
          setUsername(data.profile.username);
          setAddress(data.profile.address);
          setPayLeadTime(data.profile.pay_lead_time);
          setPhoneNo(data.profile.phone_no);
          setPaynowUen(data.profile.paynow_uen);
          setEnableMarketing(data.profile.marketing_emails);
          return toast.success(data.message);
        } else {
          toast.error("Profile is not saved!, please try again");
        }
      });
    // } catch (error) {
    //   toast.error("Profile is not updated, please try again", error);
    // }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios.defaults.headers.common['Authorization'] = token;
    const profiledata = {
      username: username,
      address: address,
      pay_lead_time: payLeadTime,
      phone_no: phoneNo,
      paynow_uen: paynowUen,
      marketing_emails: userData.role === "host" ? enableMarketing : false
    }


    updateProfile(profiledata);
  };

  const paperStyle = { padding: 20, width: 400, margin: "" }
  const btnstyle = { margin: '8px 0' }

  const handleChangePayLeadTime = (e) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
    setPayLeadTime(onlyNums);
  }

  const handleChangePhoneNo = (e) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
    setPhoneNo(onlyNums);
  }

  const handleChangePaynowUen = (e) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
    setPaynowUen(onlyNums);
  }



  
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
                  <h2>Profile</h2>
                </Grid>
                <br />

                <div>
                  <TextField className="addProductItem" type="text" label='Full Name' placeholder='Enter Full Name' fullWidth value={username} onChange={(e) => setUsername(e.target.value)} />
                  <br /><br />
                  <TextField className="addProductItem" multiline minRows={1} maxRows={4} type="text" label='Address' placeholder="Enter Address" fullWidth value={address} onChange={(e) => setAddress(e.target.value)} />
                  <br /><br />
                  <TextField className="addProductItem" type="text" label='Payment Lead Time' placeholder='Payment Lead Time' fullWidth value={payLeadTime} onChange={handleChangePayLeadTime} />
                  <br /><br />
                  <TextField className="addProductItem" label='PayNow Phone No.' placeholder='PayNow Phone No.' fullWidth value={phoneNo} onChange={handleChangePhoneNo} />
                  <br /><br />
                  <TextField className="addProductItem" label='PayNow UEN' placeholder='PayNow UEN' fullWidth value={paynowUen} onChange={handleChangePaynowUen} />
                  <br /><br />
                  {userData.role === "host" &&
                    <div>
                      <FormControlLabel
                        control={<Checkbox color="primary" checked={enableMarketing} onChange={(e) => setEnableMarketing(e.target.checked)} name="marketing" />}
                        label="Enable Marketing Emails"
                      />
                      <br /><br />
                    </div>
                  }

                  <div>
                    <FormLabel component="legend">PayNow QR Code</FormLabel>
                    <Button variant="contained" component="label" style={{ width: '180px' }}>Upload QR Code
                      <input type="file" hidden onChange={QR_FileSelectedHandler} accept="image/*" />
                    </Button>
                  </div>
                  <div><small>Only jpg, png, gif, svg images are allowed with max size of 5 MB</small></div>
                  <br />
                  {(qrFilename === undefined) ? "" : (
                    <div>
                      <img src={`${process.env.React_App_baseURL}/uploads/${qrFilename}`} className="img-object-fit" width="150px" height="150px" ></img>
                    </div>
                  )}

                  <br />
                  <Button onClick={handleSubmit} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Save</Button>
                </div>

                <br /><br />
                <Typography >
                  <Link href="/" >
                    Back to Home
                  </Link>
                </Typography>
              </Paper>
            </Grid>
            <ToastContainer position="top-right" />
          </div>
          <div style={{ width: '380px', marginTop: '50px' }} >
            <div className="ProductImage" style={{ width: '300px', margin: "auto", alignContent: 'center', border: '3px dashed grey', display: 'flex', height: '300px', alignItems: 'center', borderRadius: '200px' }}>
              {(!profileImage) ? ("") : (
                <img className="img-object-fit" src={`${process.env.React_App_baseURL}/uploads/${profileImage}`} style={{ margin: "auto", height: '290px', width: '290px', borderRadius: '200px' }}></img>
              )}
            </div>
            <br />
            <Button variant="contained" component="label" style={{ width: '180px', margin: 'auto', display: 'flex' }}>Choose Image
              <input type="file" hidden onChange={fileSelectedHandler} accept="image/*" />
            </Button>
          </div>
          <br />
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div >

  );

}
