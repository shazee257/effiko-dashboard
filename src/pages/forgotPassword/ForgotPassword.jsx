import React, { useState, useEffect } from 'react';
import { Button, Grid, Paper, Avatar, TextField, Typography, Link } from '@material-ui/core';
// import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import axios from 'axios';
import { useHistory } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const history = useHistory();


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) return toast.error("Blank field is not allowed!");
        if (!email.includes('@')) {
            return toast.error("Please enter valid email!");
        }

        console.log(email);

        try {
            await axios
                .post(`${process.env.React_App_baseURL}/forgot/password`, { email })
                .then(({ data }) => {
                    console.log(data)
                    if (data.status === 200) {
                        toast.success(data.message);
                        setTimeout(() => history.push("/login"), 2000);
                    } else {
                        toast.error("Enter valid email again!");
                    }
                });
        } catch (error) {
            toast.error(error);
        }

        // toast.success("Reset Password Email sent successfully!")
        // setEmail("");
    }

    const paperStyle = { padding: 20, width: 280, margin: "220px auto" }
    const avatarStyle = { backgroundColor: '#1bbd7e' }
    const btnstyle = { margin: '20px 0' }

    return (
        <div className="login">
            <Grid>
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                        <h2>Forgot Password ?</h2>
                    </Grid>
                    <TextField label='Email' placeholder='Enter email' fullWidth required name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Button onClick={handleSubmit} color='primary' variant="contained" style={btnstyle} fullWidth >Submit</Button>
                </Paper>
            </Grid>
            <ToastContainer position="top-right" />
        </div>
    )
}

export default ForgotPassword
