import React, { useState, useEffect } from 'react';
import { Button, Grid, Paper, Avatar, TextField, Typography, Link } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import axios from "axios";

const ResetPassword = ({ match }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userId, setUserId] = useState("");

    const { resetToken } = match.params;

    useEffect(async () => {
        await axios.get(`${process.env.React_App_baseURL}/reset/` + resetToken)
            .then(({ data }) => {
                setUserId(data.user._id);
                console.log(userId);
            });
    }, [resetToken])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) return toast.error("Blank field is not allowed!");
        if (password.length < 4) return toast.error("Password length does not meet the minimum requirement!");
        if (password !== confirmPassword) return toast.error("Password does not match!");

        const user = {
            userId: userId,
            newPassword: password,
            confirmPassword: confirmPassword,
            passwordToken: resetToken,
        };
        console.log(user);

        // axios request
        await axios.post(`${process.env.React_App_baseURL}/newPassword`, user)
            .then(({ data }) => {
                console.log(data)
                if (data.status === 200) {
                    setPassword("");
                    setConfirmPassword("");
                    setUserId("");
                    return toast.success("Password changed successfully!");
                } else {
                    toast.error("Please try again!");
                }
            });
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
                        <h2>Reset Your Password</h2>
                    </Grid>
                    <TextField label='New Password' type="password" placeholder='Enter New Password' fullWidth required name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <TextField label='Confirm Password' type="password" placeholder='Enter Password again' fullWidth required name="confirmpassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <Button onClick={handleSubmit} color='primary' variant="contained" style={btnstyle} fullWidth >Reset</Button>
                    <Typography > Do you have an account ?
                        <Link href="/login" >
                            Sign In
                        </Link>
                    </Typography>
                </Paper>
            </Grid>
            <ToastContainer position="top-right" />
        </div>
    )
}

export default ResetPassword
