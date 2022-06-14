import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Close from '@material-ui/icons/Close';
import { Button } from '@material-ui/core';
import moment from "moment";

export default function PackagingDetail(props) {
  const packageData = props.package.data ? props.package : {data: []};
  const [tableData, setTableData] = useState({customers: [], products: [], addons: []});
  const [quantityBunch, setQuantityBunch] = useState({orders: [], products: [], addons: [], total: 0});

  console.log(packageData);

  useEffect(() => {
    formatData();
  }, [props.package.data])

  const history = useHistory();

  const formatData = () => {
    const customers = packageData.data;
    
    let productsList = packageData.data.map(x => x.products);
    productsList = productsList.flatMap(x => x);
    // productsList = [...new Set(productsList.map(item => item._id))];
    productsList = [
      ...new Map(productsList.map((item) => [item.productId['_id'], item])).values(),
    ];

    let addonsList = productsList.map(x => x.productId.addons);
    addonsList = addonsList.flatMap(x => x);
    addonsList = [
      ...new Map(addonsList.map((item) => [item["_id"], item])).values(),
    ];
    console.log(addonsList, productsList, customers)
    const value = {products: productsList, addons: addonsList, customers: customers};
    setTableData({...value});

    calculateQuantities();
  }

  const calculateQuantities = () => {
    const orders = packageData.data;
    const aggregatedQuantities = {
      products: {},
      addons: {},
      orders: {},
      total: 0
    }
    
    if(orders.length > 0) {
      
      orders.forEach(element => {
        const orderId = element._id;
  
        // Calculate Quantity by Customer
        let prodQuantities = element.products.map(x => x.quantity);
        prodQuantities = prodQuantities.reduce((a,b) => a+b);
        
        let addonQuantities = element.products.map(x => x.selected_addons.length);
        addonQuantities = addonQuantities.reduce((a,b) => a+b);
  
        if (aggregatedQuantities.orders[orderId]) {
          aggregatedQuantities.orders[orderId] += prodQuantities + addonQuantities;
        } else {
          aggregatedQuantities.orders[orderId] = prodQuantities + addonQuantities;
        }


        // Calculate Quantity by Addon
        element.products.forEach(productData => {
          productData.selected_addons.forEach(addonObj => {
            if (typeof aggregatedQuantities.addons[addonObj._id] !== 'undefined') {
              aggregatedQuantities.addons[addonObj._id] += addonObj.quantity;
            } else {
              aggregatedQuantities.addons[addonObj._id] = addonObj.quantity;
            }
          })
        });


        // Calculate Quantity by Product
      element.products.forEach(productData => {
        if (typeof aggregatedQuantities.products[productData.productId._id] !== 'undefined') {
          aggregatedQuantities.products[productData.productId._id] += productData.quantity;
        } else {
          aggregatedQuantities.products[productData.productId._id] = productData.quantity;
        }
      });

      });

      let countTotal = Object.keys(aggregatedQuantities.orders).map(x => aggregatedQuantities.orders[x]);
      aggregatedQuantities.total = countTotal.length > 0 ? countTotal.reduce((a,b) => a+b) : 0;
    }

    console.log(aggregatedQuantities);
    setQuantityBunch({...aggregatedQuantities})
  }

  const formatDate = (value) => {
    return moment(value).format('DD-MMM-YYYY');
  }

  const findData = (scope, id, data) => {
    let result = "N/A";
    switch (scope) {
      case 'product_quantity':
        let foundProduct = data.products.find(x => x.productId._id === id);
        result = foundProduct ? foundProduct.quantity : 0 ;
        break;
      case 'addon_quantity':
        let foundAddonQuantity = 0;
        let addonData;
        data.products.find(x => {
          addonData = x.selected_addons.find(y => y._id == id);
          foundAddonQuantity = addonData?.quantity || 0;
        });
        console.log(foundAddonQuantity, data.billing_name, addonData)
        result = foundAddonQuantity;
        break;
    }

    return result;
  }

  // Create our number formatter.
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SGD',
  });


  return (
    <div className={`dgt-mega-panel ${props.isPanelOpen ? 'is--opened' : ''}`}>
        <div className="dgt-panel-header">
          <h2>Host Name: 
            {packageData.data.length && packageData.data[0].host_id.username && (
              <span className="light">{packageData.data.length ? packageData.data[0].host_profile.username || packageData.data[0].host_id.username : "N/A"}</span>
            )}
          </h2>
          <h2>Group Buy Date: 
            <span className="light">{packageData.data.length ? formatDate(packageData.data[0].group_buy_date) : "N/A"}</span>
          </h2>
        </div>
        <div className="dgt-panel-header">
          <h2>Host Phone: 
            <span className="light">{packageData.data.length && packageData.data[0].host_profile.phone_no ? packageData.data[0].host_profile.phone_no : "N/A"}</span>
          </h2>
          <h2>Host Address: 
          <span className="light">{packageData.data.length && packageData.data[0].host_profile.address ? packageData.data[0].host_profile.address : "N/A"}</span>
          </h2>
        </div>
        <span onClick={props.closePanel} className="dgt-toggler"><Close /></span>

        <div style={{textAlign: 'right'}} className="table-actions">
          <Button onClick={() => {window.print()}} variant="contained" color="primary" component="label" >Export</Button>
        </div>

        <div className="dgt-panel-body">
          <table>
            <thead>
              <tr>
                <th></th>
                <th className="product-highlight" colSpan={tableData.products.length}>Products</th>
                <th className="addon-highlight" colSpan={tableData.addons.length}>Addons</th>
                <th></th>
              </tr>
              <tr>
              <th>Customers</th>
                {tableData.products.length && tableData.products.map(x => (
                  <th>{x.productId.product_name}</th>
                ))}
                {tableData.addons.length && tableData.addons.map(x => (
                  <th>{x.addon_name}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {tableData.customers.length && tableData.customers.map(order => (
                <tr>
                  <td>{order.billing_name}</td>
                  {tableData.products.length && tableData.products.map(x => (
                    <td>{findData('product_quantity', x.productId._id, order)}</td>
                  ))}
                  {tableData.addons.length && tableData.addons.map(x => (
                    <td>{findData('addon_quantity', x._id, order)}</td>
                  ))}
                  <td>{quantityBunch['orders'][order._id] || 0}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td>Total</td>
                {tableData.products.length && tableData.products.map(x => (
                  <td>{quantityBunch['products'][x.productId._id] || 0}</td>
                  // <td>{x2._id}</td>
                ))}
                {tableData.addons.length && tableData.addons.map(x => (
                  <td>{quantityBunch['addons'][x._id] || 0}</td>
                ))}
                <td>{quantityBunch['total']}</td>
              </tr>
            </tbody>
          </table>
        </div>
    </div>
  );
}