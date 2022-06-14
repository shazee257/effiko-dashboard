import { Link } from '@material-ui/core';
import "./order.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import moment from "moment";
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

export default function Order(props) {
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState({});
    // const [total, setTotal] = useState(0);

    const history = useHistory();

    let token = localStorage.getItem("token")
    let user;

    useEffect(async () => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            try {
                await axios.get(`${process.env.React_App_baseURL}/order/${props.match.params.orderId}`)
                    .then(({ data }) => {
                        setOrder(data.order);
                        console.log(data.order);
                        setLoading(false);
                    });
            } catch (error) {
                toast.error(error);

            }
        } else {
            history.push("/login");
        }
    }, []);

    return (
        <div>
            <Topbar />
            <div className="container">
                <Sidebar />
                <div className="newProduct" style={{ padding: 40 }}>
                    <h1 className="addProductTitle">Order</h1>
                    <form className="addProductForm">
                        <div className="addProductItem">
                            <label>Order #</label>
                            <p>{order.order_no}</p>
                        </div>
                        <div className="addProductItem">
                            <label>Customer Name</label>
                            <p>{order.billing_name}</p>
                        </div>
                        <div className="addProductItem">
                            <label>Customer Email</label>
                            <p>{order.billing_email}</p>
                        </div>
                        <div className="addProductItem">
                            <label>Customer Phone</label>
                            <p>{order.billing_phone}</p>
                        </div>
                        <div className="addProductItem">
                            <label>GB Date</label>
                            <p>{moment(order.group_buy_date).format("DD-MMM-YYYY")}</p>
                        </div>

                        <div className="addProductItem">
                            <label>Order Date</label>
                            <input type="text" value={order.createdAt ? moment(order.createdAt).format("DD-MMM-YYYY") : ""} disabled />
                        </div>
                        <div className="addProductItem">
                            <label>Address</label>
                            <textarea rows={2} cols={100} disabled value={order.billing_address}></textarea>
                        </div>
                        <div className="addProductItem">
                            <label>Amount</label>
                            <input type="text" value={`$ ${parseFloat(order.total_amount).toFixed(2)}`} disabled />
                        </div>
                        <div className="addProductItem">
                            <label>Status</label>
                            {order.status == "paid" && (
                                <button class="widgetLgButton Approved">Paid</button>
                            )}
                            {order.status == "unpaid" && (
                                <button class="widgetLgButton Declined">Un-Paid</button>
                            )}
                        </div>

                        <h3>Products</h3>
                        <div className="checkout-list" style={{ marginBottom: 20, maxWidth: 400 }}>
                            {order.products && order.products.map(productData => (
                                <div>
                                    <div className="checkout-item product--item" key={`cc_${productData.productId.id}`}>
                                        <span className="title">{productData.productId.product_name} x  <small>{productData.quantity}</small></span>
                                        <span className="price"><span className="currency">SGD $</span> {parseFloat(productData.quantity * productData.productId.price).toFixed(2)}</span>
                                    </div>
                                    {productData.selected_addons && productData.selected_addons.map(addonObj => {
                                        const addonData = productData.productId.addons.find(z => z._id.toString() === addonObj._id);
                                        console.log(addonData)
                                        return (
                                            <div className="checkout-item product--item checkout-subitem product--subitem" key={`cc_${addonObj.id}`}>
                                                <KeyboardReturn />
                                                <span className="title" style={{ fontSize: '13px' }}>{addonData.addon_name} x <small>{addonObj.quantity}</small></span>
                                                <span className="price"><span className="currency">SGD $</span> {parseFloat(addonData.price * addonObj.quantity).toFixed(2)}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                            <div className="checkout-item subtotal">
                                <span className="title">Total</span>
                                <span className="price"><span className="currency">SGD $</span> {parseFloat(order.total_amount || 0).toFixed(2)}</span>
                            </div>

                        </div>
                        <br />
                        <Link href="/orders">Back to Orders List</Link>
                        {/* <button className="productListEdit">Print Order</button> */}
                    </form>
                </div>
            </div>
            <ToastContainer position="top-right" />
        </div>
    );
}
