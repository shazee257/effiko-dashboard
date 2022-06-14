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
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import { ToastContainer, toast } from 'react-toastify';
import { EcoTwoTone } from "@material-ui/icons";



const ProductList = (props) => {
    const [data, setData] = useState([]);
    const [addonModal, setAddonModal] = useState(false);
    const [addonsSelected, setAddonsSelected] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [countSelectedAddons, setCountSelectedAddons] = useState();
    const [isMaxAddons, setIsMaxAddons] = useState(false);
    const [selectedAddonsQty, setselectedAddonsQty] = useState(0)

    useEffect(async () => {
        setData(props.data);
    }, [props.data]);

    const useStyles = makeStyles((theme) => ({
        icon: {
            marginRight: theme.spacing(2),
        },
        heroContent: {
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(8, 0, 6),
        },
        heroButtons: {
            marginTop: theme.spacing(4),
        },
        cardGrid: {
            paddingTop: theme.spacing(8),
            paddingBottom: theme.spacing(8),
        },
        card: {
            display: "flex",
            flexDirection: "column",
        },
        cardMedia: {
            paddingTop: "30px", //"56.25%", // 16:9
            height: "300px",
            minHeight: "300px",
        },
        cardContent: {
            flexGrow: 1,
        },
        footer: {
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(6),
        },
        textDanger: {
            color: "red",
        },
    }));
    const classes = useStyles();


    var formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SGD' });

    function addProuctToCart(product) {
        const request = { ...product };
        if (product.addons.length > 0) {
            setAddonModal(true);
            setAddonsSelected([...product.addons]);
        } else {
            product.selected_addons = [];
            const request = { ...product };
            props.onAdd(request);
        }
        setSelectedProduct({ ...product });
    }

    function addProduct() {
        if (isValidProductUnits()) {
            return toast.warning("You can't select more or less than " + selectedProduct.product_units + " units");
        } else {

            selectedProduct.selected_addons = addonsSelected.filter(x => x.selected === true);
            setAddonsSelected(addonsSelected.map(x => {
                x.selected = false;
                return x;
            }));
            const request = { ...selectedProduct };
            props.onAdd(request);
            setAddonModal(false)
            setSelectedProduct({ ...selectedProduct });
            setCountSelectedAddons(0);
            setIsMaxAddons(false);
        }
    }

    function proceedWithoutAddons() {
        selectedProduct.selected_addons = [];
        const request = { ...selectedProduct };
        props.onAdd(request);
        setAddonModal(false)
        setSelectedProduct({ ...selectedProduct });
        setCountSelectedAddons(0);
        setIsMaxAddons(false);
    }

    function updateSelection() {
        updateTotalQuantities();

        let selectedAddons = addonsSelected.filter(x => x.selected === true);
        if (selectedAddons.length === selectedProduct.max_addons) setIsMaxAddons(true);
        else if (selectedAddons.length < selectedProduct.max_addons) setIsMaxAddons(false);
    }

    function updateTotalQuantities() {
        setAddonsSelected([...addonsSelected]);
        setCountSelectedAddons(addonsSelected.filter(x => x.selected === true).length);

        let selectedAddons = addonsSelected.filter(x => x.selected === true);
        let selectedQty = selectedAddons.map(x => parseInt(x.quantity)).reduce((a, b) => parseInt(a + b), 0);
        setselectedAddonsQty(selectedQty);
    }

    function isValidProductUnits() {
        if (selectedProduct.product_type === 'bundle' && selectedAddonsQty !== selectedProduct.product_units) {
            return true;
        } else {
            return false;
        }
    }


    return (
        <React.Fragment>
            <Modal
                className="modal dgt-modal"
                open={addonModal}
                onClose={() => {
                    setAddonsSelected(addonsSelected.map(x => {
                        x.selected = false;
                        x.quantity = 1;
                        return { ...x };
                    }));
                    setCountSelectedAddons(0);
                    setIsMaxAddons(false);
                    setAddonModal(false);
                }}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Fade in={addonModal}>
                    <div className="modal-content">
                        <Typography align="center" variant="h4">Addons</Typography>
                        <br />
                        {selectedProduct.is_addons_mandatory && (countSelectedAddons === 0) && <Typography variant='body2' align="left">Please select at least one addon</Typography>}
                        <div className="addon-wrapper">
                            <div className="addon-list">
                                {addonsSelected.map((x, i) => (
                                    <div className="addon-item">
                                        <input type="checkbox" disabled={(selectedProduct.product_type === 'bundle' && isMaxAddons && !x.selected)} key={`addon_${i}`} value={x.selected} onChange={(e) => {
                                            x.selected = e.target.checked;
                                            updateSelection();
                                        }} />
                                        <span style={{ width: '130px' }} className="addon_name">{x.addon_name}</span>
                                        <Typography variant='body2' align="left">Qty:</Typography>
                                        <input disabled={(selectedProduct.product_type === 'bundle' && isMaxAddons && !x.selected)} style={{ width: '60px' }} type="number" value={x.quantity} min={1}
                                            onChange={(e) => {
                                                x.quantity = e.target.value;
                                                updateTotalQuantities();
                                            }
                                            } />
                                        <span className="addon_price">SGD ${x.price * x.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            {(countSelectedAddons > 0 && selectedProduct.product_type === 'bundle') &&
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography className={`${selectedAddonsQty > selectedProduct.product_units ? classes.textDanger : ''}`} variant='body2' align="right">{`Qty: ${selectedAddonsQty} of ${selectedProduct.product_units} selected`}</Typography>
                                    <Typography variant='body2' align="right">Selected Addons :{` ${countSelectedAddons} of ${selectedProduct.max_addons}`}</Typography>
                                </div>}
                            {(countSelectedAddons > 0 && selectedProduct.product_type === 'single') && <Typography variant='body2' align="right">Selected Addons :{` ${countSelectedAddons}`}</Typography>}
                        </div>
                        <br />

                        <Button disabled={countSelectedAddons === 0} onClick={addProduct} variant="contained" color="secondary" fullWidth>
                            Addons
                        </Button>

                        <br /><br />
                        <Button disabled={selectedProduct.is_addons_mandatory} variant="contained" color="primary" fullWidth onClick={proceedWithoutAddons}>
                            No Thanks
                        </Button>
                    </div>
                </Fade>
            </Modal>
            <Grid container spacing={4}>
                {data.map((p) => (
                    <Grid item key={p._id} xs={12} sm={6} md={4}>
                        <Card className={classes.card}>
                            <CardMedia className={classes.cardMedia}
                                image={`${process.env.React_App_baseURL}/uploads/${p.img_url}`}
                                title={p.product_name}
                            />
                            <CardContent className={classes.cardContent}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        <strong>{formatter.format(p.price)}</strong>
                                    </Typography>
                                    <Typography variant="caption" display="block">{p.merchant_id.username}</Typography>
                                </div>
                                <Typography>{p.product_name}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button onClick={() => { addProuctToCart(p) }} variant="contained" color="primary" fullWidth>
                                    ADD to Cart
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <ToastContainer position="top-right" />
        </React.Fragment >
    )
}

export default ProductList
