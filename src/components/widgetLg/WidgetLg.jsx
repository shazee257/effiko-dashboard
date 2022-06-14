import "./widgetLg.css";
import moment from 'moment';

export default function WidgetLg({ latestOrders }) {
  // const [latestOrders, setLatestOrders] = useState([]);

  // const token = localStorage.getItem("token");

  // const getLatestOrders = async () => {
  //   if (token) {
  //     axios.defaults.headers.common['Authorization'] = token;
  //     await axios.get(`${process.env.React_App_baseURL}/latest-orders`)
  //       .then(({ data }) => {
  //         if (data.status === 200) {
  //           console.log(data.orders);
  //           setLatestOrders(data.orders);
  //         }
  //       })
  //   }
  // }


  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };
  return (
    <div className="widgetLg home-widget-lg">
      <h3 className="widgetLgTitle">Latest transactions</h3>
      <table className="widgetLgTable">
        <tr className="widgetLgTr">
          <th className="widgetLgTh">Order No.</th>
          <th className="widgetLgTh">Date</th>
          <th className="widgetLgTh">Amount</th>
          <th className="widgetLgTh">Status</th>
        </tr>
        {latestOrders.length > 0 && latestOrders.map((order, index) => (
          <tr className="widgetLgTr">
            <td className="">{order.order_no}</td>
            <td className="widgetLgDate">{moment(order.createdAt).format("YYYY-MM-DD")}</td>
            <td className="widgetLgAmount">SGD {order.total_amount}</td>
            <td className="widgetLgStatus">
              <Button type={order.status == "unpaid" ? "Unpaid" : "Paid"} />
            </td>
          </tr>
        ))
        }
      </table >
      {latestOrders.length == 0 && (
        <div>
          <br />
          <br />
          <h2 h2 style={{ textAlign: 'center' }}>No Orders Available</h2>
        </div>
      )}
    </div >
  );
}
