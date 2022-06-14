import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, Avatar, TextField, Button, Typography, Link } from '@material-ui/core'
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import { useHistory } from "react-router-dom";



const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userType, setUserType] = useState("host");
    const history = useHistory();

    const onChangeUsername = (e) => {
        setUsername(e.target.value);
    };

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const onChangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };

    const onChangeUserType = (e) => {
        setUserType(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !email || !password || !confirmPassword) return toast.error("Blank field is not allowed!");

        if (password.length < 4) return toast.error("Password length does not meet the minimum requirement!");

        if (password !== confirmPassword) return toast.error("Password does not match!");

        const user = {
            username: username,
            role: userType,
            email: email,
            password: password,
        };

        console.log(user);
        try {
            document.querySelector('.dgt-app-loader').classList.add('is--loading');
            await axios
                .post(`${process.env.React_App_baseURL}/auth/register`, user)
                .then(({ data }) => {
                    document.querySelector('.dgt-app-loader').classList.remove('is--loading');
                    console.log(data);
                    if (data.status === 200) {
                        toast.success("Registration successful, Sign In now!");
                        setTimeout(() => {
                            history.push("/login");
                        }, 2000);
                    } else {
                        toast.error("Registration failed!, please try again");
                    }
                });

        } catch (error) {
            document.querySelector('.dgt-app-loader').classList.remove('is--loading');
            let message = error?.response?.data?.message || "Registration failed!, please try again";
            console.log(error, error.response);
            toast.error(message);
        }
    };

    const paperStyle = { padding: 20, width: 280, margin: "200px auto" }
    const avatarStyle = { backgroundColor: '#1bbd7e' }
    const btnstyle = { margin: '8px 0' }

    return (
        <div className="signup">
            <Grid>
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><HowToRegIcon /></Avatar>
                        <h2>Registeration</h2>
                    </Grid>

                    <TextField label='Username' placeholder='Enter username' fullWidth required name="username" value={username} onChange={onChangeUsername} />

                    <Select name="usertype" value={userType} onChange={onChangeUserType}
                        input={<Input name="usertype" id="age-auto-width" />}
                        fullWidth style={{ marginTop: '10px' }}
                    >
                        <MenuItem value="merchant">Merchant</MenuItem>
                        <MenuItem value="host" selected>Host</MenuItem>
                        {/* <MenuItem value="consumer">Consumer</MenuItem> */}
                    </Select>

                    <TextField label='Email' placeholder='Enter email' fullWidth required name="email" value={email} onChange={onChangeEmail} />
                    <TextField label='Password' placeholder='Enter password' type='password' fullWidth required name="password" value={password} onChange={onChangePassword} />
                    <TextField label='Confirm Password' placeholder='Enter retype password' type='password' fullWidth required name="confirmpassword" value={confirmPassword} onChange={onChangeConfirmPassword} />

                    <Button onClick={handleSubmit} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Register</Button>
                    <Typography >
                        <Link href="/forgotpassword" >
                            Forgot password ?
                        </Link>
                    </Typography>
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

export default Signup
