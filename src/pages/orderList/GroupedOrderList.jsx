import "./orderList.css";
import { DataGrid } from "@material-ui/data-grid";
import { orderRows } from "../../dummyData";
import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import LoadingPanel from "../../components/loader/loader";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import DatePicker, { Calendar } from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon"
import moment from "moment";

export default function GroupedOrderList() {
  // const [data, setData] = useState(orderRows);
  const [loading, setLoading] = useState(true);
  const datePickerRef = useRef(null);
  const [isPanelOpen, setPanel] = useState(false);
  const [selectedPackaging, setPackaging] = useState(false);
  const [data, setData] = useState([]);
  const [visibleData, setVisibleData] = useState([]); // Visible data after applying filters
  const [filterDate, setFilterDate] = useState(null); // Visible data after applying filters

  const [multipleIds, setMultipleIds] = useState([]);

  const history = useHistory();


  const formatDate = (value) => {
    return moment(value).format('DD-MMM-YYYY');
  }

  let token = localStorage.getItem("token");
  axios.defaults.headers.common['Authorization'] = token;
  let user = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : {};

  useEffect(async () => {
    if (token) {
      getOrders();
    } else {
      toast.error("Authorization failed");
      history.push("/login");
    }
  }, []);

  const getOrders = () => {
    axios.get(`${process.env.React_App_baseURL}/orders`).then(({ data }) => {
      data.orders.forEach(y => {
        let total = 0
        y.products.forEach(x => {
          let price = x.productId.price * x.quantity;
          total += price;
        })
        y.total = total;
        y.group_buy_date = moment(y.group_buy_date).format('YYYY-MM-DD');
      })
      setData(data.orders);
      console.log(data.orders);
      // setVisibleData(data.orders);
      formatData(data.orders);
      setLoading(false);
    });
  }

  // Function responsible to merge all the related data.
  const formatData = (ordersList) => {
    let results = {};
    ordersList.forEach(element => {
      const hostId = element.host_id._id;
      const merchantId = element.merchant_id._id;
      const standardDate = moment(element.group_buy_date).format('YYYY-MM-DD');
      let key = `${hostId}_${standardDate}`;
      if (user.role == 'merchant') key = `${merchantId}_${standardDate}`;

      if (results[key]) {
        results[key].total_amount += element.total_amount
        results[key].data.push(element);
      } else {
        results[key] = {};
        results[key].id = element.id;
        results[key].total_amount = element.total_amount;
        results[key].group_buy_date = standardDate;
        results[key].data = [];

        if (user.role == 'merchant') results[key].user_profile = element.merchant_profile;
        else results[key].user_profile = element.host_profile;

        results[key].data.push(element);
      }
    });

    let resultArray = [];
    Object.keys(results).map(x => {
      resultArray.push({ ...results[x] });
    })

    setData(resultArray);
    setVisibleData(resultArray);
  }

  const filterByDate = (selectedDates) => {
    setFilterDate(selectedDates);
    if (selectedDates.length > 0) {

      let fromDate = new Date().getTime();
      let toDate = null;
      let scope = 'single';
      if (selectedDates.length > 1) { // Range Selected
        fromDate = selectedDates[0].format('YYYY-MM-DD');
        toDate = selectedDates[1].format('YYYY-MM-DD');
        scope = 'range';
      } else {
        toDate = selectedDates[0].format('YYYY-MM-DD');
      }

      const filteredData = data.filter(x => {
        const groupBuyTimestamp = x.group_buy_date ? moment(x.group_buy_date).format('x') : 0;
        const groupBuyDate = x.group_buy_date ? moment(x.group_buy_date).format('YYYY-MM-DD') : '2000-01-01';

        switch (scope) {
          case 'range':
            let fromStamp = moment(fromDate).format('x');
            let toStamp = moment(toDate).format('x');
            if (groupBuyTimestamp >= fromStamp && groupBuyTimestamp <= toStamp) return x;
            break;
          case 'single':
            if (groupBuyDate == toDate) return x;
            break;
        }

      });

      setVisibleData([...filteredData]);
    } else {
      setVisibleData([...data]);
    }

  }

  const onDataRowClick = (param, b, c) => {
    const userId = user.role == 'merchant' ? param.row.data[0].merchant_id.id : param.row.data[0].host_id.id;
    const gbDate = param.row.group_buy_date;
    history.push(`/orders/${userId}/${gbDate}`)
  }



  // Create our number formatter.
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SGD',
  });


  const columns = [
    {
      field: "data.group_buy_date", headerName: "GB Date", width: 150,
      valueFormatter: (params) => formatDate(params.row.data[0].group_buy_date),
      renderCell: (params) => formatDate(params.row.data[0].group_buy_date)
    },
    {
      field: "host_name", headerName: "Host Name", width: 180,
      renderCell: (params) => params.row.user_profile ? params.row.user_profile.username : params.row.data[0].host_id.username,
    },
    {
      field: "host_phone", headerName: "Host Phone", width: 200,
      renderCell: (params) => params.row.user_profile ? params.row.user_profile.phone_no : "N/A"
    },
    {
      field: "host_address", headerName: "Host Address", width: 200,
      renderCell: (params) => params.row.user_profile ? params.row.user_profile.address : "N/A"
    },
    {
      field: "total_amount", headerName: "Total Amount", type: "number", width: 180,
      valueFormatter: ({ value }) => formatter.format(value)
    },
  ];

  return (
    <div>
      <Topbar />
      <div className="container">
        <Sidebar />
        <div style={{ padding: 15 }} className="orderList">
          {(loading) ? <LoadingPanel /> : (
            <div>

              <Grid container spacing={2} style={{ marginBottom: 10 }} alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="h4">
                    List of Orders
                  </Typography>
                </Grid>

                <Grid item justifyContent="flex-end">
                  <DatePicker
                    ref={datePickerRef}
                    value={filterDate}
                    editable={true}
                    required={false}
                    onChange={filterByDate}
                    format="DD-MM-YYYY"
                    range
                    render={<InputIcon />}
                    placeholder="Select Date"
                  >
                    <button onClick={() => { filterByDate([]); datePickerRef.current.closeCalendar() }}> Clear </button>
                  </DatePicker>
                </Grid>
              </Grid>

              <DataGrid
                className="clickable-row"
                rows={visibleData}
                disableSelectionOnClick
                disableColumnSelector={true}
                columns={columns}
                rowHeight={40}
                pageSize={15}
                autoHeight
                onRowClick={onDataRowClick}
              />
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" />

    </div>

  );
}