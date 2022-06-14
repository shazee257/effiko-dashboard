import { DeleteOutline } from "@material-ui/icons";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import React, { useEffect, useState } from "react";
import '../settings/settings.css';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useHistory } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { Typography, Grid, Button, Paper, RadioGroup, Radio, FormControlLabel } from '@material-ui/core';
import moment from 'moment';
import LoadingPanel from "../../components/loader/loader";
import { Calendar } from "react-multi-date-picker";
import { showNotification } from "../../utils/helper";
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';

const HostCalendar = () => {
    const [data, setData] = useState([]);

    const [groupBuyData, setGroupBuyData] = useState([]);
    const [leadTime, setLeadTime] = useState(0);
    const [timeslots, setTimeslots] = useState([]);
    const [selectedTimeslot, setSelectedTimeslot] = useState(null);
    const [gbDates, setGbDates] = useState([]);
    const [merchantId, setMerchantId] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [blockOffDates, setBlockOffDates] = useState([]);
    const [merchantName, setMerchantName] = useState("");
    const history = useHistory();

    let currentClickDate;
    let token = localStorage.getItem("token");

    const disabledDate = (dateObj) => {
        if (blockOffDates.indexOf(dateObj.date.format('YYYY-MM-DD')) != -1) {
            return {
                disabled: true,
            }
        }
        if (groupBuyData.find(x => moment(x.group_buy_date).format('YYYY-MM-DD') === dateObj.date.format('YYYY-MM-DD'))) {
            return {
                disabled: true,
            }
        }
    }

    const getUserAccount = () => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            axios.get(`${process.env.React_App_baseURL}/user/account`)
                .then(({ data }) => data.session.user_id).catch(showNotification);
        } else {
            toast.error("Authorization failed");
            history.push("/login");
        }
    }

    const getAllMerchants = async () => {
        axios.defaults.headers.common['Authorization'] = token;
        await axios.get(`${process.env.React_App_baseURL}/merchants`)
            .then(({ data }) => {
                setData(data.users);
            }).catch(showNotification);
    }

    useEffect(() => {
        getUserAccount();
        getAllMerchants();
        getAllGroupBuys();
        setLoading(false);
    }, []);

    const getMerchant = async (merchantId) => {
        axios.defaults.headers.common['Authorization'] = token;
        await axios.get(`${process.env.React_App_baseURL}/merchant/${merchantId}`)
            .then(({ data }) => {
                setMerchantId(data.merchant.id);
                setLeadTime(data.merchant.lead_time);
                setTimeslots(data.merchant.available_timeslots);
                setMerchantName(data.merchant.username);
                const formattedDates = data.merchant.unavailable_dates ? data.merchant.unavailable_dates.map(x => moment(x).format('YYYY-MM-DD')) : [];
                setBlockOffDates(formattedDates);
            });
    }

    const handleMerchantClick = (id) => {
        getMerchant(id);
        setIsOpen(true);
        // const calendar = document.querySelector('.host-calendar');
        // calendar.style.display = '';
    }

    const columns = [
        { field: "id", headerName: "ID", width: 250, hide: true },
        { field: "username", headerName: "Merchant Name", width: 230 },
        { field: "email", headerName: "Email", width: 280 },
        { field: "host_allowed", headerName: "Host Allowed", width: 220 },
        { field: "lead_time", headerName: "Lead Time (days)", width: 220 },
        {
            field: "action", filterable: false, sortable: false, headerName: "Action", width: 200,
            renderCell: (params) => {
                return (
                    <Button color="primary" variant="contained" fullWidth onClick={() => handleMerchantClick(params.row.id)} >
                        Check Availability
                    </Button>
                );
            }
        }

    ];

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure? Do you want to delete this group-buy?")) {
            await axios.delete(`${process.env.React_App_baseURL}/group-buy/delete/${id}`)
                .then(({ data }) => {
                    toast.success(data.message);
                });
            getAllGroupBuys();
            setData(data.filter((item) => item._id !== id));
        }
    }

    const getAllGroupBuys = () => {
        axios.get(`${process.env.React_App_baseURL}/group-buys`)
            .then(({ data }) => {
                setGroupBuyData(data.getAllGroupBuys)
            });
    }

    const groupBuyDate = async (date) => {
        if (timeslots.length > 0 && !selectedTimeslot) return toast.warning("Please select a timeslot");

        let groupBuyData;

        const timeslotData = timeslots.length ? timeslots.find(x => x._id == selectedTimeslot) : 0;

        if (timeslotData) {
            groupBuyData = {
                merchantId: merchantId,
                leadTime: leadTime,
                group_buy_date: date,
                timeslot: {
                    from: timeslotData.from,
                    to: timeslotData.to,
                }
            }
        } else {
            groupBuyData = {
                merchantId: merchantId,
                leadTime: leadTime,
                group_buy_date: date,
            }
        }

        axios.defaults.headers.common['Authorization'] = token;
        await axios.post(`${process.env.React_App_baseURL}/group-buy/create`, groupBuyData)
            .then(({ data }) => {
                if (data.success) {
                    toast.success("Group-Buy Date is assigned!");
                    setGbDates([]);
                    getAllGroupBuys();
                }
            }).catch(showNotification);
    }

    const datePickerClick = (e) => {
        currentClickDate = new Date(e[e.length - 1]);
        if (window.confirm("Are you sure, you want to Group-Buy date?")) {
            setSelectedTimeslot(null);
            groupBuyDate(currentClickDate);
            getAllGroupBuys();
        } else {
            return;
        }
    }

    const GBcolumns = [
        { field: "id", headerName: "ID", width: 230, hide: true },
        {
            field: "group_buy_date", headerName: "GB Date", width: 130,
            valueFormatter: (params) => moment(params.value).format("YYYY-MM-DD")
        },
        {
            field: "username", headerName: "Merchant", width: 210,
            valueFormatter: (params) => params.row.merchant_id.username
        },
        {
            field: "email", headerName: "Merchant Email", width: 250,
            valueFormatter: (params) => params.row.merchant_id.email
        },
        { field: "lead_time", headerName: "Lead Time (days)", width: 180 },
        {
            field: "timeslot", headerName: "Timeslot", width: 150,
            renderCell: (params) => {
                return params.value && params.value.from ? `${moment(params.value.from, 'HH:mm').format('hh:mm A')} - ${moment(params.value.to, 'HH:mm').format('hh:mm A')}` : "-"
            },
        },
        {
            field: "is_accepted", headerName: "Accepted", width: 140,
            renderCell: (params) => {
                return (
                    <>
                        {params.value ? (
                            <div style={{ color: 'darkgreen' }}>Accepted</div>
                        ) : (
                            <div style={{ color: 'red' }}>Pending</div>
                        )}

                    </>
                );
            },
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <>
                        <DeleteOutline
                            className="productListDelete"
                            onClick={() => handleDelete(params.row.id)}
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
                {(loading) ? <LoadingPanel /> : (
                    <div className="orderList" id="orderList">
                        <br />
                        <div className="date-picker">
                            <Typography variant="h4">
                                List of Merchants
                            </Typography>
                            <DataGrid
                                rows={data}
                                disableSelectionOnClick
                                columns={columns}
                                pageSize={15}
                                rowHeight={40}
                                // checkboxSelection
                                autoHeight
                            />
                        </div>
                        <br />
                        <br />
                        <div className="date-picker">
                            <Typography variant="h4">
                                Group-Buy Dates
                            </Typography>

                            <DataGrid
                                rows={groupBuyData}
                                disableSelectionOnClick
                                columns={GBcolumns}
                                pageSize={15}
                                rowHeight={40}
                                // checkboxSelection
                                autoHeight
                            />
                        </div>

                    </div>
                )
                }
            </div >
            <Modal
                className="modal dgt-modal"
                open={isOpen}
                onClose={() => { setIsOpen(false) }}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Fade in={isOpen}>
                    <div className="modal-content">
                        <Typography variant="h5" align='center' color="textSecondary" >
                            Availability Calendar for
                        </Typography>
                        <Typography variant="h4" align='center'>
                            {merchantName.toUpperCase()}
                        </Typography>
                        {timeslots.length > 0 && (
                            <div style={{ marginTop: 20 }}>
                                Timeslots:
                                <RadioGroup aria-label="selectedTime" name="selectedTime" onChange={(e) => setSelectedTimeslot(e.target.value)}>
                                    {timeslots.map(x => (
                                        <FormControlLabel value={x._id} control={<Radio centerRipple color="primary" />} label={`${moment(x.from, 'HH:mm').format('hh:mm A')} - ${moment(x.to, 'HH:mm').format('hh:mm A')}`} />
                                    ))}
                                </RadioGroup>
                            </div>
                        )}
                        <br />
                        <br />
                        <div style={{ marginLeft: '48px', marginTop: '30px', transform: 'scale(1.3)' }}>
                            <Calendar
                                minDate={moment().add(leadTime || 0, 'days').format('YYYY-MM-DD')}
                                onChange={datePickerClick}
                                multiple
                                value={gbDates}
                                mapDays={(date) => disabledDate(date)}
                            />


                        </div>

                        <br />
                        <br />
                    </div>
                </Fade>
            </Modal>
            <ToastContainer position="top-right" />
        </div >
    )
}

export default HostCalendar

