import React from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { useState, useEffect } from "react";
import moment from "moment";
import { useHistory } from "react-router";



const GroupBuyDatesList = (props) => {

  const groupBuys = props.groupBuys || [];
  const [formattedData, setFormattedData] = useState({});
  const history = useHistory();

  

  useEffect(() => {
    formatGroupBuys();
  }, [groupBuys])
    
  function formatGroupBuys() {
    let data = {};
    groupBuys.forEach(element => {
      const standardDate = moment(element.group_buy_date).format();

      if (data[standardDate]) { // already has data for this data then add
        data[standardDate].push({...element});
      } else {
        data[standardDate] = [];
        data[standardDate].push({...element});
      }
    });
    setFormattedData({...data});

    console.log(groupBuys, formattedData);
  }

  function getProducts(data, groupBuyDate) {

    const hostInfo = localStorage.getItem('hostInfo') ? JSON.parse(localStorage.getItem('hostInfo')) : {};
    localStorage.setItem('hostInfo', JSON.stringify({...hostInfo, groupBuyDate }));

    const merchantId = data.merchant_id._id;
    history.push('/checkout/'+merchantId);
  }

    return (
        <React.Fragment>
          <div className="event-grid-listing">
            {Object.keys(formattedData).map(key => (
              <div className="event-grid-wrapper">
                <h3 className="event-date-title">{ `${moment(key).format('DD-MMM-yyyy')} - ${moment(key).fromNow()}` }</h3>

                {formattedData[key].map(data => (
                  <div className="event-box-wrapper" onClick={() => getProducts(data, key)}>
                    <div className="box-infographic">
                      <span>Expires on</span>
                      <p>{moment(data.expires_on).format('DD-MMM-yyyy')}</p>
                      <small>{moment(data.expires_on).fromNow()}</small>
                    </div>
                    <div className="box-content">
                      <h4>{data.title}</h4>
                      <ul>
                        <li>
                          <strong>Merchant:</strong> {data.merchant_id?.username}
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
                
              </div>
            ))}
          </div>
        </React.Fragment>
    )
}

export default GroupBuyDatesList
