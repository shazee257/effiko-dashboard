import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link, Typography } from "@material-ui/core";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SubscriptionAcceptance = ({ match }) => {

    const [groubBuy, setGroubBuy] = useState({});
    const { groupBuyId } = match.params;

    const updateGroupBuy = () => {
        axios.put(`${process.env.React_App_baseURL}/group-buy/update/${groupBuyId}`)
            .then(res => {

                // if (!res.data.success) return;

                toast.success(res.data.message);
                console.log(res.data.groupBuy);
                setGroubBuy(res.data.groupBuy);

            })
    }

    useEffect(async () => {
        updateGroupBuy();
    }, []);

    return (
        <div>
            <div style={{ margin: '0', position: 'absolute', top: '20%', left: '50%', transform: 'translateY(-50%)', transform: 'translateX(-50%)' }}>
                <div>
                    <Typography align="center" variant="h3" > Request for GB Date Subscription is Accepted!</Typography>
                    <br />
                </div>

                <Typography align="center" variant="h4" >
                    <Link href="/login" >
                        Click to Login
                    </Link>
                </Typography>

            </div>
            <ToastContainer position="top-right" />
        </div>
    )
}

export default SubscriptionAcceptance
