import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import React, { useEffect, useState } from "react";
import { Calendar, DateObject } from "react-multi-date-picker";
import { DeleteOutline } from "@material-ui/icons";
import '../settings/settings.css';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useHistory } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { Typography, Grid, TextField, Button, Paper, Select, MenuItem } from '@material-ui/core';
import moment from 'moment';
import LoadingPanel from "../../components/loader/loader";

const CalendarEvents = () => {
    const [data, setData] = useState([]);
    const [merchantData, setMerchantData] = useState({});
    const [loading, setLoading] = useState(true);

    const [blockOffDates, setBlockOffDates] = useState([]);

    const history = useHistory();

    let currentClickDate;

    const disabledDate = (dateObj) => {
        if (blockOffDates.indexOf(dateObj.date.format('YYYY-MM-DD')) != -1) {
            return {
                disabled: true,
            }
        }
    }

    let token = localStorage.getItem("token");

    useEffect(() => {
        getUserAccount();
    }, []);

    // Get all dates with index
    const BlockOffDatesWithIndexes = (arr) => {
        let result = [], i;
        for (i = 0; i < arr.length; i++) {
            result.push({ id: i + 1, date: arr[i] });
        }
        return result;
    }

    const getUserAccount = () => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            axios.get(`${process.env.React_App_baseURL}/user/account`)
                .then(({ data }) => {
                    const formattedDates = data.session.user_id.unavailable_dates ? data.session.user_id.unavailable_dates.map(x => moment(x).format('YYYY-MM-DD')) : [];
                    setBlockOffDates(formattedDates);
                    setData(BlockOffDatesWithIndexes(formattedDates));
                    setMerchantData(data.session.user_id);
                    setLoading(false);
                    return data.session.user_id
                });
        } else {
            toast.error("Authorization failed");
            history.push("/login");
        }
    }

    const datePickerClick = (e) => {
        currentClickDate = new Date(e[0].format('YYYY-MM-DD'));
        const blockOffDateArr = [];
        blockOffDateArr.push(currentClickDate);
        if (window.confirm("Are you sure you want to block-off this date?")) {
            const requestBody = { unavailable_dates: blockOffDateArr }
            axios.put(`${process.env.React_App_baseURL}/merchant/updateUnavailability`, requestBody)
                .then(({ data }) => {
                    const formattedDates = data.user.unavailable_dates ? data.user.unavailable_dates.map(x => moment(x).format('YYYY-MM-DD')) : [];
                    setBlockOffDates(formattedDates);
                    setData(BlockOffDatesWithIndexes(formattedDates));
                });
        }
        else {
            return;
        }
    }

    const handleDeleteUnavailability = async (unavailable_date) => {
        const dateObj = new Date(unavailable_date);
        const blockOffDateArr = [];
        blockOffDateArr.push(dateObj);

        const requestBody = { unavailable_dates: blockOffDateArr }

        await axios.put(`${process.env.React_App_baseURL}/merchant/removeUnavailability`, requestBody)
            .then(({ data }) => {
                const formattedDates = data.user.unavailable_dates ? data.user.unavailable_dates.map(x => moment(x).format('YYYY-MM-DD')) : [];
                setBlockOffDates(formattedDates);
                setData(BlockOffDatesWithIndexes(formattedDates));
            });
    }

    const columns = [
        { field: "id", headerName: "ID", width: 230, hide: false },
        { field: "date", headerName: "Unavailable Date", width: 280 },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <>
                        <DeleteOutline
                            className="productListDelete"
                            // onClick={() => handleDelete(params.row.id)}
                            onClick={() => handleDeleteUnavailability(params.row.date)}
                        />
                    </>
                );
            },
        },
    ];

    return (
        <div>
            <Topbar />
            <div className="container">
                <Sidebar />
                <div className="orderList" id="orderList">
                    <br />
                    {(loading) ? <LoadingPanel /> : (
                        <div>
                            <div className="date-picker">
                                <Paper elevation={2} style={{ padding: '20px', margin: '20px' }}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} md={8} xl={4}>
                                            <div style={{ border: '3px solid grey' }}>
                                                <br />
                                                <br />
                                                <Typography variant="h5" align='center' color="textPrimary" paragraph >
                                                    Create Group-Buy Date
                                                </Typography>
                                                <br />
                                                <br />
                                                <div style={{ marginLeft: '145px', marginBottom: '30px', transform: 'scale(1.3)' }}>
                                                    <Calendar
                                                        minDate={moment().add(merchantData.lead_time || 0, 'days').format('YYYY-MM-DD')}
                                                        onChange={datePickerClick}
                                                        multiple
                                                        value={data.map((gb) => gb.group_buy_date)}
                                                        mapDays={(date) => disabledDate(date)}
                                                    />
                                                </div>

                                                <br />
                                                <br />
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </div>
                            <div className="date-picker">
                                <Typography variant="h4" align='center'>
                                    UnAvailability
                                </Typography>
                                <DataGrid
                                    rows={data}
                                    disableSelectionOnClick
                                    columns={columns}
                                    pageSize={15}
                                    rowHeight={40}
                                    // checkboxSelection
                                    autoHeight
                                // style={{ height: '700px' }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div >
            <ToastContainer position="top-right" />
        </div >
    )
}

export default CalendarEvents


