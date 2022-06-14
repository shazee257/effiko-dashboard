import "./settings.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography, Link } from '@material-ui/core'
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { DeleteOutline } from "@material-ui/icons";
import moment from "moment";

export default function Settings() {
  const [hostAllowed, setHostAllowed] = useState(2);
  const [leadTime, setLeadTime] = useState(2);
  const [slug, setSlug] = useState("")
  const [role, setRole] = useState("");
  const [timeslots, setTimeslots] = useState([]);
  const textInput = useRef(null);

  const history = useHistory();

  const token = localStorage.getItem("token");

  useEffect(async () => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      // get user to verify
      await axios.get(`${process.env.React_App_baseURL}/user/account`)
        .then(({ data }) => {
          setRole(data.session.user_id.role);
          setSlug(data.session.user_id.host_slug)
          setTimeslots(data.session.user_id.available_timeslots)
          if (data.session.user_id.host_allowed == undefined) {
            setHostAllowed(0);
          } else {
            setHostAllowed(data.session.user_id.host_allowed);
          }
          if (data.session.user_id.lead_time == undefined) {
            setLeadTime(0);
          } else {
            setLeadTime(data.session.user_id.lead_time);
          }
          console.log(data.session);
        })
    } else history.push("/login");
  }, []);

  const deleteTimeslot = (index) => {
    timeslots.splice(index, 1);
    setTimeslots([...timeslots]);
  }

  const addTimeslot = () => {
    timeslots.push({ from: "00:00", to: "00:00" });
    setTimeslots([...timeslots]);
  }

  const updateTimeslot = (key, index, value) => {
    if (timeslots[index][key] !== value) {
      timeslots[index][key] = value;
      setTimeslots([...timeslots])
    }
  }

  const updateSettings = async () => {
    axios.defaults.headers.common['Authorization'] = token;

    const settingsData = {
      host_allowed: hostAllowed,
      lead_time: leadTime,
      host_slug: slug,
      available_timeslots: timeslots,
    }

    try {
      await axios
        .put(`${process.env.React_App_baseURL}/user/updatesettings`, settingsData)
        .then(({ data }) => {
          console.log(data);
          if (data.status === 200) {
            return toast.success(data.message);
          } else {
            toast.error("Settings are not saved!, please try again");
          }
        });

    } catch (error) {
      toast.error("Settings are not updated, please try again", error);
    }
  }

  const validateTimeSlots = () => {
    if (timeslots.length === 0) {
      return updateSettings();
    }
    else {
      const isValid = timeslots.every(timeslot => {
        if (timeslot.from && timeslot.to) {
          return moment(timeslot.from, "HH:mm").isValid() && moment(timeslot.to, "HH:mm").isValid();
        }
      })
      // if timeslots are valid
      if (isValid) {
        for (let i = 0; i < timeslots.length; i++) {
          let from = moment(timeslots[i].from, "HH:mm A").unix();
          let to = moment(timeslots[i].to, "HH:mm A").unix();

          if (from < to) {
            // from is less then to
            for (let j = i + 1; j < timeslots.length; j++) {
              let nextFrom = moment(timeslots[j].from, "HH:mm A").unix();
              let nextTo = moment(timeslots[j].to, "HH:mm A").unix();
              // from is greater than or equal to nextFrom and from is less than nextTo
              if (from >= nextFrom && from < nextTo) {
                return toast.warning(`Invalid time slot at position ${i + 1}`);
              }
              // to is greater than nextFrom and to is less than or equal to nextTo
              if (to > nextFrom && to <= nextTo) {
                return toast.warning(`Invalid time slot at position ${i + 1}`);
              }
              // from is less than or equal to nextFrom and from is less than nextTo and to is greater than nextFrom and to is greater than or equal to nextTo
              if (from <= nextFrom && from < nextTo && to > nextFrom && to >= nextTo) {
                return toast.warning(`Invalid time slot at position ${i + 1}`);
              }
            }
          } else {
            // from is greater then to
            return toast.warning(`Invalid time slot at position ${i + 1}`);
          }
        }
      }
    }
    updateSettings();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === "merchant") {
      if (!hostAllowed || !leadTime) return toast.error("Blank field is not allowed!");
    }
    if (role === "host") {
      if (!slug) return toast.error("Blank field is not allowed!");
    }

    // validate timeslots and update settings
    validateTimeSlots();

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
                  <h2>{(role === 'merchant') ? ("Merchant Settings") : ("Host Settings")}</h2>
                </Grid>
                <br />

                {(role === 'merchant') ?
                  (<div><TextField className="addProductItem" type="number" label='Hosts Allowed' placeholder='Enter No. of Hosts' fullWidth name="host_allowed" value={hostAllowed} onChange={(e) => setHostAllowed(e.target.value)} />
                    <br />
                    <br />
                    <TextField className="addProductItem" type="number" label='Lead Time' placeholder="Lead Time" fullWidth name="lead_time" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} />
                    <br />
                    <br />
                  </div>) :
                  (<div>
                    <TextField className="addProductItem" type="text" label='Host Slug' placeholder='Enter Slug for Host URL' fullWidth name="host_slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
                    <small><a target="_blank" href={`${window.location.origin}/shop/${slug}`}>{`${window.location.origin}/shop/${slug}`}</a></small>
                    <br />
                    <br />
                  </div>)}

                {role === 'merchant' && (
                  <div className="addon-wrapper">
                    <Button variant="contained" component="label" onClick={addTimeslot} >Add Timeslot</Button>

                    <div className="addon-list">
                      {timeslots.map((x, i) => (
                        <div className="addon-item">
                          <input className="addon-name" type="time" key={`from${i}`} value={timeslots[i].from} onChange={(e) => updateTimeslot('from', i, e.target.value)} />
                          <input className="addon-name" type="time" key={`to_${i}`} value={timeslots[i].to} onChange={(e) => updateTimeslot('to', i, e.target.value)} />
                          <div className="addon-actions">
                            <DeleteOutline onClick={() => deleteTimeslot(i)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Button onClick={handleSubmit} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Save Settings</Button>
                <br /><br />
                <Typography >
                  <Link href="/" >
                    Back to Home
                  </Link>
                </Typography>
              </Paper>
            </Grid>

          </div>
          <br />
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div >
  );

}
