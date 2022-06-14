import { DataGrid } from "@material-ui/data-grid";
import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import axios from 'axios';
import { DeleteOutline } from "@material-ui/icons";
import { Button, Hidden, Link } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";
import LoadingPanel from "../../components/loader/loader";
import moment from "moment";

const GroupBuyList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    const formatDate = (value) => {
        return moment(value).format('DD-MMM-YYYY');
    }

    const token = localStorage.getItem("token");

    const getAllGroupBuys = () => {
        axios.defaults.headers.common['Authorization'] = token;
        axios.get(`${process.env.React_App_baseURL}/group-buys`)
            .then(({ data }) => {
                console.log(data.getAllGroupBuys);
                setData(data.getAllGroupBuys);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(async () => {
        if (token) {
            getAllGroupBuys();
        } else {
            history.push("/login");
        }
    }, []);

    const updateGroupBuy = (id) => {
        axios.put(`${process.env.React_App_baseURL}/group-buy/update/${id}`)
            .then(({ data }) => {
                getAllGroupBuys();
                document.querySelector('.dgt-app-loader').classList.remove('is--loading');
                toast.success(data.message);
            })
    }

    const handleUpdateGroupBuy = (id) => {
        document.querySelector('.dgt-app-loader').classList.add('is--loading');
        updateGroupBuy(id);
    }

    const columns = [
        { field: "id", headerName: "ID", width: 230, hide: true },
        {
            field: "group_buy_date", headerName: "GB Date", width: 150,
            valueFormatter: (params) => formatDate(params.value)
        },
        {
            field: "host_id", headerName: "Host", width: 180,
            valueFormatter: (params) => params.row.host_id.username
        },
        {
            field: "host_email", headerName: "Host Email", width: 220,
            valueFormatter: (params) => params.row.host_id.email
        },
        {
            field: "lead_time", headerName: "Lead Time", width: 150
        },
        {
            field: "timeslot", headerName: "Timeslot", width: 150,
            renderCell: (params) => {
                return params.value && params.value.from ? `${moment(params.value.from, 'HH:mm').format('hh:mm A')} - ${moment(params.value.to, 'HH:mm').format('hh:mm A')}` : "-"
            },
        },
        {
            field: "is_accepted", headerName: "Status", width: 150,
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
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        {params.row.is_accepted ? "" : (
                            <button className="productListEdit" onClick={() => handleUpdateGroupBuy(params.row.id)}>
                                Accept Request
                            </button>
                        )}
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
                <div className="productList">
                    <div className="productTitleContainer">
                        <h2 className="productTitle">List of Group-Buy Dates</h2>
                    </div>
                    {(loading) ? <LoadingPanel /> : (
                        <DataGrid
                            rows={data}
                            disableSelectionOnClick
                            columns={columns}
                            pageSize={15}
                            rowHeight={40}
                            style={{ height: '800px' }}
                        />
                    )}
                </div>
            </div>
            <ToastContainer position="top-right" />
        </div>
    )
}

export default GroupBuyList
