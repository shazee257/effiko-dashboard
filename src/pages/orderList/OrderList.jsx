import "./orderList.css";
import { DataGrid } from "@material-ui/data-grid";
import { orderRows } from "../../dummyData";
import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import LoadingPanel from "../../components/loader/loader";
import { useHistory, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import DatePicker, { Calendar } from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon"
import moment from "moment";

export default function OrderList() {
  // const [data, setData] = useState(orderRows);
  const [loading, setLoading] = useState(true);
  const datePickerRef = useRef(null);
  const [data, setData] = useState([]);
  // const [userData, setUserData] = useState(null);
  const [visibleData, setVisibleData] = useState([]); // Visible data after applying filters
  const [filterDate, setFilterDate] = useState(null); // Visible data after applying filters

  const [multipleIds, setMultipleIds] = useState([]);

  const history = useHistory();
  const routeParams = useParams();
  const paramUserId = routeParams.userId;
  const paramGBDate = routeParams.groupBuyDate;


  const formatDate = (value) => {
    return moment(value).format('DD-MMM-YYYY');
  }

  let token = localStorage.getItem("token");
  let user;

  const userData = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : {};

  useEffect(async () => {
    if (userData.id) {
      await axios.get(`${process.env.React_App_baseURL}/orders`)
        .then(({ data }) => {
          console.log(data);
          data.orders.forEach(y => {
            //   let total = 0
            //   y.products.forEach(x => {
            //     total += x.productId.addons.reduce((a, b) => a + b.price, 0)
            //     let price = x.productId.price * x.quantity;
            //     total += price;
            //   })
            y.group_buy_date = moment(y.group_buy_date).format('YYYY-MM-DD');
            //   y.total = total;
          })
          let filteredOrders = data.orders;
          if (paramUserId && paramGBDate) {
            filteredOrders = data.orders.filter(x => {
              if (userData.role === 'merchant') {
                return x.merchant_id.id === paramUserId && x.group_buy_date === paramGBDate;
              } else {
                return x.host_id.id === paramUserId && x.group_buy_date === paramGBDate;
              }
            })
          }
          setData(filteredOrders);
          setVisibleData(filteredOrders);
          setLoading(false);
        });
    } else {
      history.push("/login");
    }
  }, []);

  const markPaidUnPaid = (id, status) => {
    try {
      let rq = { status: status == "paid" ? "unpaid" : "paid" };
      axios.put(`${process.env.React_App_baseURL}/order/update-status/${id}`, rq)
        .then(({ data }) => {
          window.location.reload();
        })
    } catch (error) {
      toast.error(error);

    }
  };

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

  const manyMarkPaid = async () => {
    await axios.put(`${process.env.React_App_baseURL}/order/update-many`, { multipleIds })
      .then(({ data }) => {
        window.location.reload();
      })
  }



  // Create our number formatter.
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SGD',
  });


  const columns = [
    { field: "order_no", headerName: "Order #", width: 130 },
    {
      field: "group_buy_date", headerName: "Group Buy Date", width: 170,
      valueFormatter: (params) => formatDate(params.value)
    },
    {
      field: "host_name", headerName: "Host", width: 130, renderCell: (params) => {
        return (
          <>
            {params.row.host_profile ? params.row.host_profile.username : params.row.host_id.username}
          </>
        );
      },
    },
    {
      field: "merchant_name", headerName: "Merchant", width: 150, renderCell: (params) => {
        return (
          <>
            {params.row.merchant_profile ? params.row.merchant_profile.username : params.row.merchant_id.username}
          </>
        );
      },
    },
    { field: "billing_name", headerName: "Customer", width: 150 },
    { field: "billing_phone", headerName: "Phone #", width: 130 },
    {
      field: "total_amount", headerName: "Amount", type: "number", width: 130,
      valueFormatter: ({ value }) => formatter.format(value)
    },

    {
      field: "createdAt", headerName: "Order Date", width: 150,
      valueFormatter: (params) => formatDate(params.value)
    },
  ];

  if (userData && userData.role == 'merchant') {
    columns.push({
      field: "action",
      headerName: "Action",
      sortable: false,
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/order/" + params.row.id}>
              <button className="orderListEdit">View</button>
            </Link>
          </>
        );
      },
    })
  } else {
    columns.push({
      field: "action",
      headerName: "Action",
      sortable: false,
      width: 180,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/order/" + params.row.id}>
              <button className="orderListEdit">View</button>
            </Link>
            <div>
              {multipleIds.length > 1 ? (
                <button onClick={manyMarkPaid} className="orderListEdit">Mark as Paid</button>
              ) : (
                <button onClick={() => markPaidUnPaid(params.row.id, params.row.status)} className="orderListEdit">Mark as Paid</button>
              )}
            </div>
          </>
        );
      },
    },
      {
        field: "status",
        headerName: "Status",
        sortable: false,
        width: 100,
        renderCell: (params) => {
          return (
            <>
              {params.row.status == "paid" && (
                <button class="widgetLgButton Approved">Paid</button>
              )}
              {params.row.status == "unpaid" && (
                <button class="widgetLgButton Declined">Un-Paid</button>
              )}
            </>
          );
        },
      })
  }

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
                    List of Orders - {moment(paramGBDate).format('Do MMMM YYYY')}
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
                rows={visibleData}
                disableSelectionOnClick
                disableColumnSelector={true}
                columns={columns}
                rowHeight={40}
                pageSize={15}
                autoHeight
                checkboxSelection={userData && userData.role == 'host' ? true : false}
                onSelectionModelChange={(ids) => {
                  setMultipleIds(ids);
                  // console.log(ids);
                }}
              />
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>

  );
}