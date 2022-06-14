import React, { useState } from "react";
import axios from "axios";
import './Signup.css';
import { FaUserCircle, FaRegArrowAltCircleRight } from "react-icons/fa";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [userType, setUserType] = useState("host");
    const [error, setError] = useState("");

    const onChangeUsername = (e) => {
        setUsername(e.target.value);
    };

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const onChangeUserType = (e) => {
        setUserType(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        setError("");


        if (!username) setUsernameError("Empty Username is not allowed!");

        if (!email) setEmailError("Empty email is not allowed!");

        if (!password) return setPasswordError("Empty Password is not allowed!");
        else if (password.length < 4) return setPasswordError("Password is not valid!");


        const user = {
            username: username,
            usertype: userType,
            email: email,
            password: password,
        };

        try {
            await axios
                .post("https://digitalthumbs-api.techup.sg/auth/register", user)
                .then(({ data }) => {
                    console.log(data);
                    if (data.status === 200) {
                        setError("User Registration successful, Sign In now!");
                        setUsername("");
                        setEmail("");
                        setPassword("");
                    } else {
                        setError("Registration failed!, please try again");
                    }
                });

        } catch (error) {
            setError(error);
        }
    };



    return (
        <div className="container login">
            <div className="row" style={{ marginBottom: '40px' }}>
                <div className="col-sm-5"></div>
                <div className="col-sm-4"><label>
                    <h3><FaUserCircle size={40} /> &nbsp; Registration </h3></label></div>
                <div className="col-sm-4"></div>

            </div>

            <form onSubmit={handleSubmit}>

                {/* username */}
                <div className="row">
                    <div className="col-sm-3"></div>
                    <div className="col-sm-1"><label>Username</label></div>
                    <div className="col-sm-4">
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={username}
                            onChange={onChangeUsername}
                        />
                        <strong className="text-danger">{usernameError}</strong>
                    </div>
                    <div className="col-sm-4"></div>
                </div>

                {/* userType */}
                <div className="row">
                    <div className="col-sm-3"></div>
                    <div className="col-sm-1"><label>User-Type</label></div>
                    <div className="col-sm-4">
                        <select name={userType} onChange={onChangeUserType} defaultValue="host" className="form-control">
                            <option value="host">Host</option>
                            <option value="merchant">Merchant</option>
                        </select>
                    </div>
                    <div className="col-sm-4"></div>
                </div>

                {/* email */}
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
                        <strong className="text-danger">{emailError}</strong>
                    </div>
                    <div className="col-sm-4"></div>
                </div>

                {/* password */}
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
                        <strong className="text-danger">{passwordError}</strong>
                    </div>
                    <div className="col-sm-4"></div>
                </div>

                {/* submit button */}
                <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4"><button type='submit' className="btn btn-primary form-control" ><FaRegArrowAltCircleRight size={25} />&nbsp; Register</button>
                    </div>
                    <div className="col-sm-4"></div>
                </div>

                <div className="row" style={{ marginTop: '40px' }}>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-2">

                    </div>
                    <div className="col-sm-2">
                        <a href="/" className="btn btn-success form-control">Sign In</a>
                    </div>
                    <div className="col-sm-4"></div>
                </div>

                <div className="row" style={{ marginTop: '40px' }}>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                        {(error !== "") ? (<strong style={{ backgroundColor: 'yellow' }} className="form-control text-success">{error}&nbsp;<a href='/'> Sign In</a></strong>) : ""}
                    </div>
                    <div className="col-sm-4"></div>
                </div>

            </form>
        </div>
    )
}

export default Signup
