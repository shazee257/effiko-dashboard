import React, { useState } from "react";
import axios from "axios";
import './Login.css';
import { FaUserCircle, FaRegArrowAltCircleRight } from "react-icons/fa";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [error, setError] = useState("");

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorEmail("");
        setErrorPassword("");
        setError("");

        if (!email) {
            setErrorEmail("Empty email is not allowed!");
        }
        if (!password) return setErrorPassword("Empty Password is not allowed!");
        else if (password.length < 4) return setErrorPassword("Password is not valid!");


        const user = {
            email: email,
            password: password,
        };

        try {
            await axios
                .post("https://digitalthumbs-api.techup.sg/auth/login", user)
                .then(({ data }) => {
                    if (data.status === 200) {
                        localStorage.setItem('userId', data.sessions.user_id);
                        localStorage.setItem('token', data.sessions.token);
                        alert("User logged in successful!");
                    } else {
                        setError("Logged in failed!, please try again");
                    }
                });

        } catch (error) {
            setError('Check email & password, please try again!');
        }
    };

    return (
        <div className="container login">
            <div className="row" style={{ marginBottom: '40px' }}>
                <div className="col-sm-5"></div>
                <div className="col-sm-4"><label>
                    <h3><FaUserCircle size={45} /> &nbsp; Sign In </h3></label></div>
                <div className="col-sm-4"></div>

            </div>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-sm-3"></div>
                    <div className="col-sm-1"><label>Email</label></div>
                    <div className="col-sm-4">
                        <input
                            type="email"
                            name="email"

                            className="form-control"
                            value={email}
                            onChange={onChangeEmail}
                        />
                        <strong className="text-danger">{errorEmail}</strong>
                    </div>

                    <div className="col-sm-4"></div>
                </div>

                <div className="row">
                    <div className="col-sm-3"></div>
                    <div className="col-sm-1"><label>Password</label></div>
                    <div className="col-sm-4">
                        <input
                            type="password"
                            name="password"

                            className="form-control"
                            value={password}
                            onChange={onChangePassword}
                        />
                        <strong className="text-danger">{errorPassword}</strong>
                    </div>
                    <div className="col-sm-4"></div>
                </div>

                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4"><button type='submit' className="btn btn-primary form-control" ><FaRegArrowAltCircleRight size={25} />&nbsp; Submit</button>
                        {/* <input type="submit" value="Submit" className="btn btn-primary form-control" /> */}
                    </div>
                    <div className="col-sm-4"></div>
                </div>

                <div className="row" style={{ marginTop: '40px' }}>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-2">
                        <a href="#">Forgot password?</a>
                    </div>
                    <div className="col-sm-2">
                        <a href="/signup" className="btn btn-success form-control">Sign Up</a>
                    </div>
                    <div className="col-sm-4"></div>
                </div>

                <div className="row" style={{ marginTop: '40px' }}>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        {(error !== "") ? (<strong style={{ backgroundColor: 'yellow' }} className="form-control text-danger">{error}</strong>) : ""}

                    </div>
                    <div className="col-sm-4"></div>
                </div>

            </form>
        </div>
    )
}

export default Login

