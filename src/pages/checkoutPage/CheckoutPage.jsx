
import React from "react";
import ProductList from '../../components/consumer/ProductCardsList';
import ConsumerHeader from '../../components/consumer/Header';
import { useHistory, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import CheckoutLogic, { dataService } from "../../components/consumer/CheckoutLogic";
import Button from "@material-ui/core/Button";
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import { TextField, IconButton } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
import Typography from "@material-ui/core/Typography";

let cart = { products: [], total: 0 };
let total = 0;

dataService.getData().subscribe((res) => {
  cart = { ...res };
  total = 0
  console.log("=====================>", res);
  if (cart && cart.products && cart.products.length) {
    cart.products.forEach((x) => {
      // const addonPrice = x.selected_addons.length > 0 ? x.selected_addons.map(y => y.price).reduce((a, b) => a + b) : 0;
      const addonPrice = x.selected_addons.length > 0 ? x.selected_addons.map(y => y.price * y.quantity).reduce((a, b) => a + b) : 0;
      total += (x.price * x.quantity) + addonPrice;
    })
  }
})

const CheckoutPage = () => {
  const { addProductInCart, deleteProductFromCart, orderCheckout, flushCart, deleteAddon, updateCartData } = CheckoutLogic();
  const [products, setProducts] = useState([]);
  const [checkoutRequest, setCheckoutRequest] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const history = useHistory();
  const routeParams = useParams();

  const hostData = localStorage.getItem('hostInfo') ? JSON.parse(localStorage.getItem('hostInfo')) : null;

  useEffect(async () => {
    if (!hostData) {
      history.push('/');
    }
    // setIsSuccessOpen(true);
    getProducts();
  }, []);

  async function getProducts() {
    const params = { merchant_id: routeParams.merchantId };
    const products = await axios.get(`${process.env.React_App_baseURL}/merchantproducts`, { params }).then(({ data }) => data.products);
    const productsWithAddonsQty = products.map(product => {
      product.addons = product.addons.map(addon => {
        addon.quantity = 1;
        return addon;
      });
      return product;
    });
    setProducts(productsWithAddonsQty);
    return
  }

  function configOrderCheckout() {
    if (checkoutRequest.billing_name && checkoutRequest.billing_address && checkoutRequest.billing_phone) {
      let requestBody = checkoutRequest;
      requestBody.merchant_id = routeParams.merchantId;
      requestBody.host_id = hostData.hostId;
      requestBody.group_buy_date = hostData.groupBuyDate;
      requestBody.total_amount = total;
      requestBody.products = cart.products.map(x => { return { productId: x.id, quantity: x.quantity, selected_addons: x.selected_addons } });

      orderCheckout(requestBody)
        .then(({ data }) => {
          if (data.status === 200) {
            setIsOpen(false);
            setCheckoutRequest({});
            flushCart();
            toast.success(data.message);

            setTimeout(() => {
              setIsSuccessOpen(true);
            }, 500);
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          } else {
            toast.error("Order couldn't be created!");
          }
        });
    } else {
      toast.error("Please fill out all the details!");
    }
  }

  function backToMerchant() {
    if (window.confirm('By confirming, your current cart would be discarded. Do you agree?')) {
      flushCart();
      window.location.href = `${window.location.origin}/shop/${hostData.hostSlug}`;
    }
  }

  function deleteProduct(productIndex) {
    deleteProductFromCart(productIndex);
  }

  return (
    <React.Fragment>
      <div className="page--checkout">
        <div className="container" style={{ display: 'block' }}>
          <ConsumerHeader />

          <div style={{ marginTop: 90, paddingLeft: 40 }}>
            <IconButton
              aria-label="Back to Merchant Listing"
              onClick={() => { backToMerchant() }}
            >
              <ArrowBackIcon />
            </IconButton>
            Back to Merchant Listing
          </div>

          <div className="checkout-container">
            {/* products list */}
            <div className="products-list">
              <ProductList onAdd={addProductInCart} data={products} />
            </div>


            {/* checkout cart */}
            <div className="checkout-subtotal-wrapper">
              <div className="checkout-subtotal">
                <h3>Checkout</h3>

                <div className="checkout-list">
                  {cart.products.map((x, productIndex) => (
                    <div className="checkout-item product--item" key={`cc_${x.id}`}>

                      <CloseIcon className="delete-icon" onClick={() => { deleteProduct(productIndex) }} />

                      <span className="title">
                        <p className="overflow-title">{x.product_name}</p> x
                        <small>
                          {x.product_type === 'bundle' ? (
                            <Typography variant='body'>{x.quantity}</Typography>
                          ) : (
                            <input className="seamless-input" type="number" name="" min={1} max={10} value={x.quantity} onChange={(e) => {
                              x.quantity = e.target.value;
                              updateCartData();
                            }} />)}

                        </small>
                      </span>
                      <span className="price"><span className="currency">SGD $</span> {(x.quantity * x.price).toFixed(2)}</span>

                      {x.selected_addons.map((y, addonIndex) => (
                        <div className="checkout-subitem product--subitem">
                          {x.product_type === 'bundle' ? ("") : (
                            <CloseIcon className="delete-icon" onClick={() => { deleteAddon(productIndex, addonIndex) }} />
                          )}
                          <KeyboardReturn />
                          <span className="title">{y.addon_name} x
                            <small>
                              {x.product_type === 'bundle' ? (
                                <Typography variant='body'>{y.quantity}</Typography>
                              ) : (
                                <input disabled={x.product_type === 'bundle'} className="seamless-input" type="number" name="" min={1} max={10} value={y.quantity} onChange={(e) => {
                                  y.quantity = e.target.value;
                                  updateCartData();
                                }} />
                              )}
                            </small>
                          </span>
                          <span className="price"><span className="currency">SGD $</span> {(y.price * y.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="checkout-item subtotal">
                    <span className="title">Total</span>
                    <span className="price"><span className="currency">SGD $</span> {total.toFixed(2)}</span>
                  </div>

                </div>

                <Button disabled={cart.products.length == 0} onClick={() => { setIsOpen(true) }} variant="contained" color="secondary" fullWidth>
                  Checkout
                </Button>

              </div>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" />

        <Modal
          className="modal dgt-modal"
          open={isOpen}
          onClose={() => { setIsOpen(false) }}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <Fade in={isOpen}>
            <div className="modal-content">
              <h2>Billing Information</h2>

              <div className="form-group">
                <TextField label='Billing Name' placeholder='Enter Billing Name' fullWidth name="billing_name"
                  onChange={(e) => setCheckoutRequest({ ...checkoutRequest, billing_name: e.target.value })} />
              </div>
              <div className="form-group">
                <TextField label='Billing Email' placeholder='Enter Billing Email' fullWidth name="billing_email"
                  onChange={(e) => setCheckoutRequest({ ...checkoutRequest, billing_email: e.target.value })} />
              </div>
              <div className="form-group">
                <TextField label='Billing Address' placeholder='Enter Billing Address' fullWidth name="billing_address"
                  onChange={(e) => setCheckoutRequest({ ...checkoutRequest, billing_address: e.target.value })} />
              </div>
              <div className="form-group">
                <TextField label='Phone Number' value={checkoutRequest.billing_phone} placeholder='(65) 0000-0000' fullWidth name="billing_phone"
                  onChange={(e) => setCheckoutRequest({ ...checkoutRequest, billing_phone: e.target.value.replace('.', '') })}
                />
              </div>

              <Button onClick={configOrderCheckout} variant="contained" color="secondary" fullWidth>
                Checkout
              </Button>
            </div>

          </Fade>

        </Modal>

        <Modal
          className="modal dgt-modal"
          open={isSuccessOpen}
          onClose={() => { setIsSuccessOpen(false) }}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <Fade in={isSuccessOpen}>
            <div className="modal-content">

              <div class="payment">
                <svg class="payment__check" height="36" viewBox="0 0 48 36" width="48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M47.248 3.9L43.906.667a2.428 2.428 0 0 0-3.344 0l-23.63 23.09-9.554-9.338a2.432 2.432 0 0 0-3.345 0L.692 17.654a2.236 2.236 0 0 0 .002 3.233l14.567 14.175c.926.894 2.42.894 3.342.01L47.248 7.128c.922-.89.922-2.34 0-3.23"></path>
                </svg>
                <svg class="payment__background" height="115" viewBox="0 0 120 115" width="120" xmlns="http://www.w3.org/2000/svg">
                  <path d="M107.332 72.938c-1.798 5.557 4.564 15.334 1.21 19.96-3.387 4.674-14.646 1.605-19.298 5.003-4.61 3.368-5.163 15.074-10.695 16.878-5.344 1.743-12.628-7.35-18.545-7.35-5.922 0-13.206 9.088-18.543 7.345-5.538-1.804-6.09-13.515-10.696-16.877-4.657-3.398-15.91-.334-19.297-5.002-3.356-4.627 3.006-14.404 1.208-19.962C10.93 67.576 0 63.442 0 57.5c0-5.943 10.93-10.076 12.668-15.438 1.798-5.557-4.564-15.334-1.21-19.96 3.387-4.674 14.646-1.605 19.298-5.003C35.366 13.73 35.92 2.025 41.45.22c5.344-1.743 12.628 7.35 18.545 7.35 5.922 0 13.206-9.088 18.543-7.345 5.538 1.804 6.09 13.515 10.696 16.877 4.657 3.398 15.91.334 19.297 5.002 3.356 4.627-3.006 14.404-1.208 19.962C109.07 47.424 120 51.562 120 57.5c0 5.943-10.93 10.076-12.668 15.438z" ></path>
                </svg>
              </div>

              <div style={{ textAlign: 'center' }}>
                <h2>Thank you for your order!</h2>
                <p>We've sent you a summary of your order on your email address.</p>
              </div>

            </div>

          </Fade>

        </Modal>
      </div>
    </React.Fragment>
  )
}

export default CheckoutPage
