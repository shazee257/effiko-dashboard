import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Subject } from 'rxjs';
import { toast } from 'react-toastify';
import { CardMedia } from "@material-ui/core";

const subject = new Subject();

export const dataService = {
    getData: () => subject.asObservable()
};

const localStorageData = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : { products: [] };


// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });


const CheckoutLogic = () => {
    const [cart, setCart] = useState(localStorageData);
    const [isLoaded, setIsLoaded] = useState(false);

    onLoad();

    function onLoad() {
        if (!isLoaded) {
            updateCartData(cart);
            setIsLoaded(true)
        }
    }

    // Warn if overriding existing method
    function addProductInCart(data) {
        let match = false;
        let cartData = cart;

        // add product in cart when product type === bundle
        if (data.product_type === "bundle") {
            console.log("bundle : ", data);
            cartData.products.push({ ...data, quantity: 1 });
            updateCartData(cartData);
            return;
        }

        // empty cart
        if (cartData.products.length === 0) {
            cartData.products.push({ ...data, quantity: 1 });
        } else {
            // filter cartProducts whether exist or not
            const cartProducts = cartData.products ? cartData.products.filter(x => x.id === data.id) : null;
            // if cartProducts not exist
            if (cartProducts.length === 0) {
                cartData.products.push({ ...data, quantity: 1 });
            } else {
                // if cartProducts exist (verify addons match)
                for (let i = 0; i < cartProducts.length; i++) {
                    if (cartProducts[i].id === data.id) {
                        const addedAddons = cartProducts[i].selected_addons;
                        const addonsToPush = data.selected_addons;
                        if (addedAddons.equals(addonsToPush)) {
                            console.log('addonsToPush', addonsToPush);
                            console.log('addedAddons', addedAddons);
                            console.log('addons matched, product', data);
                            match = true;
                            cartProducts[i].quantity = parseInt(cartProducts[i].quantity) + 1;
                            cartProducts[i].selected_addons = addedAddons.map(prevAddon => {
                                addonsToPush.map(newAddon => {
                                    if (prevAddon.id === newAddon.id) {
                                        prevAddon.quantity = parseInt(prevAddon.quantity) + parseInt(newAddon.quantity);
                                    }
                                })
                                return prevAddon;
                            });

                            updateCartData(cartData);
                            return;
                        }
                        // if (addedAddons.equals(addonsToPush)) {
                        //     match = true;
                        //     cartProducts[i].quantity = parseInt(cartProducts[i].quantity) + 1;
                        //     updateCartData(cartData);
                        //     return;
                        // }
                    }
                }
                if (match === false) {
                    cartData.products.push({ ...data, quantity: 1 });
                }
            }
        }
        updateCartData(cartData);
    }

    function deleteProductFromCart(productIndex) {
        let cartData = cart;
        //const productIndex = cartData.products ? cartData.products.findIndex(x => x.id === id) : null;
        if (productIndex !== -1) {
            if (cartData.products[productIndex].selected_addons.length > 0) {
                cartData.products[productIndex].selected_addons.map(x => x.selected = false);
            }
            cartData.products.splice(productIndex, 1);
        }
        updateCartData(cartData);
    }

    function deleteAddon(productIndex, addonIndex) {
        let cartData = cart;
        const product = cartData.products ? cartData.products[productIndex] : null;
        if (product && addonIndex !== -1) {
            product.selected_addons[addonIndex].selected = false;
            product.selected_addons.splice(addonIndex, 1);
        }
        updateCartData(cartData);

        // let cartData = cart;
        // const product = cartData.products ? cartData.products.find(x => x.id === productId) : null;
        // if (product) {
        //     const addonIndex = product.selected_addons.findIndex(x => x._id === addonId);
        //     product.selected_addons[addonIndex].selected = false;
        //     product.selected_addons.splice(addonIndex, 1);
        // }
        // updateCartData(cartData);


    }

    function updateCartData(cartData) {
        if (!cartData) cartData = cart;
        setCart({ ...cartData });
        subject.next({ ...cartData });
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function flushCart() {
        localStorage.removeItem('cart');
        setCart({});
        subject.next({ products: [] });
    }

    function orderCheckout(requestBody) {
        return axios.post(`${process.env.React_App_baseURL}/order/create`, requestBody);
    }

    return { cart, addProductInCart, deleteProductFromCart, orderCheckout, flushCart, deleteAddon, updateCartData }
}

export default CheckoutLogic
