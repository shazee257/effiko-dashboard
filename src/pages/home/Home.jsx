import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./home.css";
import { userData } from "../../dummyData";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import WidgetLgMerchant from "../../components/widgetLg/WidgetLgMerchant";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

export default function Home() {


  return (
    <div>
      <Topbar />
      <div className="container">
        <Sidebar />
        <div className="home">
          {/* <FeaturedInfo /> */}
          {/* <Chart data={latestOrders} title="Order Analytics" grid dataKey="Active Orders" /> */}
          <div className="homeWidgets">
            <WidgetLg />
            <WidgetLgMerchant />
          </div>
        </div>
      </div>
    </div >
  );
}
