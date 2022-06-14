import "./widgetLg.css";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment';

export default function WidgetLgMerchant() {
  const [latestOrders, setLatestOrders] = useState([]);

  const token = localStorage.getItem("token");

  const getLatestOrders = async () => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      await axios.get(`${process.env.React_App_baseURL}/orders`)
        .then(({ data }) => {
          if (data.status === 200) {
            console.log(data.orders);
            formatData(data.orders);
          }
        })
    }
  }

  const formatData = (ordersList) => {
    let results = {};
    ordersList.forEach(element => {
      const hostId = element.host_id._id;
      const merchantId = element.merchant_id._id;
      const standardDate = moment(element.group_buy_date).format('YYYY-MM-DD');
      let key = `${hostId}_${standardDate}`;
      if (results[key]) {
        results[key].total_amount += element.total_amount
        results[key].data.push(element);
      } else {
        results[key] = {};
        results[key].id = element.id;
        results[key].total_amount = element.total_amount;
        results[key].group_buy_date = standardDate;
        results[key].data = [];
        
        results[key].user_profile = element.merchant_profile

        results[key].data.push(element);
      }
    });

    let resultArray = [];
    Object.keys(results).map(x => {
      resultArray.push({...results[x]});
    })

    setLatestOrders(resultArray);
    console.log(resultArray);
  }

  useEffect(() => {
    getLatestOrders();
  }, []);

  const isAllPaid = (data) => {
    return data.filter(x => x.status == 'paid').length == data.length;
  }


  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };
  return (
    <div className="widgetLg home-widget-lg">
      <h3 className="widgetLgTitle">Latest transactions</h3>
      <table className="widgetLgTable">
        <tr className="widgetLgTr">
          <th className="widgetLgTh">GB Date</th>
          <th className="widgetLgTh">Host Name</th>
          <th className="widgetLgTh">Host Email</th>
          <th className="widgetLgTh">Host Phone</th>
          <th className="widgetLgTh">Total Amount</th>
          <th className="widgetLgTh">Status</th>
        </tr>
        {latestOrders.length > 0 && latestOrders.map((data, index) => (
          <tr className="widgetLgTr">
            <td className="widgetLgDate">{moment(data.group_buy_date).format("DD-MMM-YYYY")}</td>
            <td className="widgetLgTd">{data.data[0].host_profile?.username || data.data[0].host_id.username}</td>
            <td className="widgetLgTd">{data.data[0].host_id.email}</td>
            <td className="widgetLgTd">{data.data[0].host_profile?.phone_no}</td>
            <td className="widgetLgAmount">SGD {data.total_amount}</td>
            <td className="widgetLgStatus">
              <Button type={isAllPaid(data.data) ? 'Paid' : 'Unpaid' } />
            </td>
          </tr>
        ))}
      </table >
      {latestOrders.length == 0 && (
        <div>
          <br /><br />
          <h2 h2 style={{ textAlign: 'center' }}>No Orders Available</h2>
        </div>
      )}
    </div >
  );
}
