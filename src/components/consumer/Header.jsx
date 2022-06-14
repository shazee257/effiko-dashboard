import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingBasketOutlined } from "@material-ui/icons";
import Badge from "@material-ui/core/Badge";
import CheckoutLogic, { dataService } from "./CheckoutLogic";

let cart = { products: [] };

dataService.getData().subscribe((res) => {
  cart = res;
})

const ConsumerHeader = (props) => {


  return (
    <React.Fragment>
      <header className="top-header">
        <span className="app-title">Digital Thumbs</span>

        <ul>
          <li>
            {/* <NavLink to="/checkout"> */}
            <Badge color="secondary" badgeContent={cart.products.length}>
              <ShoppingBasketOutlined />
            </Badge>
            {/* </NavLink> */}
          </li>
        </ul>
      </header>
    </React.Fragment>
  )
}

export default ConsumerHeader
