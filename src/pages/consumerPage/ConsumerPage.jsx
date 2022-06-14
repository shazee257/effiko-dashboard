
import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
// import './ConsumerPage.css';
import ProductList from '../../components/consumer/ProductCardsList';
import GroupBuyDatesList from '../../components/consumer/GroupBuyDatesList';
import ConsumerHeader from '../../components/consumer/Header';
import { useHistory, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import axios from 'axios'
import { LoadingPanel } from '../../components/Loading'

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="https://digitalthumbs-web.techup.sg">
                Digital Thumbs
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

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
        height: "475px",
        width: "300px"
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
}));


const ConsumerPage = () => {
    const [wrapperType, setWrapperType] = useState('loading');
    const [groupBuyDates, setGroupBuyDates] = useState([]);
    const history = useHistory();
    const routeParams = useParams();

    const token = localStorage.getItem("token");

    useEffect(async () => {
        verifyGroupBuy();
    }, []);
    const classes = useStyles();

    // First verify group buy from Host Slug
    const verifyGroupBuy = () => {
        axios.get(`${process.env.React_App_baseURL}/user/${routeParams.hostSlug}`)
            .then(({ data }) => {
                localStorage.setItem('hostInfo', JSON.stringify({ hostSlug: routeParams.hostSlug, hostId: data.hostUser._id }));
                getGroupBuys(data.hostUser._id);
                setWrapperType(null)
            }).catch(err => {
                setWrapperType('error')
            });
    }

    const getGroupBuys = async (hostId) => {
        const params = { host_id: hostId }; // would get this ID by param
        const groupBuyDates = await axios.get(`${process.env.React_App_baseURL}/groupbuys`, { params })
            .then(({ data }) => {
                console.log(data.group_buys);
                return data.group_buys;
            });

        setGroupBuyDates(groupBuyDates);
    }

    return (
        <React.Fragment>
            <div className="page--consumer">
                {wrapperType == 'loading' && (
                    <div className="dgt-message-wrapper">
                        <LoadingPanel />
                    </div>
                )}
                {wrapperType == 'error' && (
                    <div className="dgt-message-wrapper">
                        <h3>Uh Oh!</h3>
                        <p>The URL doesn't seems to be correct</p>
                    </div>
                )}

                <div className="container">
                    <ConsumerHeader />
                    <div className="orderList">

                        {/* Hero unit */}
                        <div className={classes.heroContent}>
                            <Container maxWidth="sm">
                                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                                    SHOP ONLINE
                                </Typography>
                                <Typography variant="h5" align="center" color="textSecondary" paragraph >
                                    Select your favourite items and order here!
                                </Typography>
                            </Container>
                        </div>
                        <Container className={classes.cardGrid} maxWidth="xl">
                            {/* End hero unit */}
                            {/* <ProductList data={data} /> */}
                            <GroupBuyDatesList groupBuys={groupBuyDates} />
                        </Container>
                        {/* Footer */}
                        <footer className={classes.footer}>
                            <Typography variant="h6" align="center" gutterBottom>
                                Footer
                            </Typography>
                            <Typography variant="subtitle1" align="center" color="textSecondary" component="p" >
                                Footer Content
                            </Typography>
                            <Copyright />
                        </footer>
                        {/* End footer */}

                    </div>
                </div>
                <ToastContainer position="top-right" />
            </div>
        </React.Fragment>
    )
}

export default ConsumerPage
