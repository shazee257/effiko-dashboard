import React, { useState, useEffect } from "react";
import axios from "axios";
import './Login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Grid, Paper, Avatar, TextField, Typography, Link } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useHistory } from "react-router-dom";
import { showNotification } from "../../utils/helper";

const Login = () => {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    let token = localStorage.getItem("token");

    const userData = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : {};

    useEffect(() => {
        if (userData.id) {
            getProfileAndVerifyData();
        } else {
            history.push("/login");
        }
    }, [])

    // Get Profile Data & verify
    const getProfileAndVerifyData = () => {
        axios.get(`${process.env.React_App_baseURL}/profile`)
            .then(({ data }) => {
                document.querySelector('.dgt-app-loader').classList.remove('is--loading');
                setIsLoading(false);
                
                if (data.success === 200) {
                    localStorage.setItem("profileInfo", JSON.stringify(data.profile[0]));
                    console.log(verifyProfileData(data.profile[0]));
                    if (verifyProfileData(data.profile[0])) {
                        toast.success("Sign in successful!");
                        history.push('/');
                    } else {
                        toast.info("Update your profile information, please!");
                        history.push('/profile');
                    }
                }
            })
    }

    const verifyProfileData = (profile) => {
        if (!profile.username || !profile.address || !profile.pay_lead_time || !profile.phone_no) {
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !email) return toast.error("Blank field is not allowed!");
        if (password.length < 4) return toast.error("Password length does not meet the minimum requirement!");

        const user = { email: email, password: password };

        // try {
        setIsLoading(true);
        document.querySelector('.dgt-app-loader').classList.add('is--loading');
        await axios.post(`${process.env.React_App_baseURL}/auth/login`, user)
            .then(({ data }) => {
                if (data.status === 200) {
                    localStorage.setItem('token', data.sessions.token);
                    localStorage.setItem('userInfo', JSON.stringify(data.user));
                    axios.defaults.headers.common['Authorization'] = localStorage.getItem("token");
                    getProfileAndVerifyData();
                }
            }).catch((err) => {
                document.querySelector('.dgt-app-loader').classList.remove('is--loading');
                setIsLoading(false);
                showNotification(err);
            });

        // } catch (error) {
        //     let message = error?.response?.data?.message || "Sign in failed!, please try again";
        //     console.log(error, error.response);
        //     toast.error(message);
        // }
    };


    const paperStyle = { padding: 20, width: 280, margin: "200px auto" }
    const avatarStyle = { backgroundColor: '#1bbd7e' }
    const btnstyle = { margin: '8px 0' }

    return (
        <div className="login">
            <Grid>
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                        <h2>Sign In</h2>
                    </Grid>
                    <TextField label='Email' placeholder='Enter Email' fullWidth name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField label='Password' placeholder='Enter password' type='password' fullWidth name="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <FormControlLabel control={<Checkbox name="checkedB" color="primary" />} label="Remember me" />

                    {(isLoading) ?
                        (<Button color='primary' variant="contained" style={btnstyle} fullWidth >Loading...</Button>)
                        : (<Button onClick={handleSubmit} color='primary' variant="contained" style={btnstyle} fullWidth >Sign in</Button>)
                    }

                    <Typography >
                        <Link href="/forgotpassword" >
                            Forgot password ?
                        </Link>
                    </Typography>
                    <Typography > Do you have an account ?
                        <Link href="/signup" >
                            Sign Up
                        </Link>
                    </Typography>
                </Paper>
            </Grid>
            <ToastContainer position="top-right" />
        </div>
    )
}

export default Login