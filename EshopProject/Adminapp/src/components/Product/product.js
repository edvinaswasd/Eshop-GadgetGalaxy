import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from "axios";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HeaderAndLayout from '../layouts/HeaderAndLayout';
import Dialog from "../DialogBox/DialogBox";
import Dialog2 from '../DialogBox/DialogBox2';
import BeatLoader from 'react-spinners/BeatLoader'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CsvBuilder } from 'filefy';
import { Chip } from "@material-ui/core";
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles({
    table: {
        minWidth: 250,
    },
    button: {
        textAlign: "center",
        backgroundColor: "#4094F7",
        color: "#FFFFFF",
        borderRadius: "0.5rem",
        marginLeft: "29.8rem",
        marginBottom: "1rem"
    },
});

export default function Projects() {
    const url = process.env.REACT_APP_BE_URL;
    const classes = useStyles();
    const [product, setProduct] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [initialValues, setInitialValues] = useState({});
    const [callingBackend, setCallingBackend] = useState(false);
    const [succesMessage, setSuccesMessage] = useState(false);
    const [failMessage, setFailMessage] = useState(false);
    const [productMessage, setProductMessage] = useState(false);
    const [item, setItem] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [exportData, setExportData] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [count, setCount] = useState(10);

    const handlePageChange = (event, value) => {
        setPageNumber(value);
    };

    const notify = () => succesMessage ? toast.success('Action successful!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }) : failMessage ? toast.error('Action failed!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }) : productMessage ? toast.warn('Product already exists!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }) : null

    const handleClickOpen = (row) => {
        setItem(row);
        setOpen(true);
        setInitialValues(row);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const getProducts = async () => {
        try {
            const res = await axios.get(`${url}/admin/getallproducts`);
            if (res.status === 201) {
                setProduct(res?.data?.productList)
            }
        } catch (err) {
            console.log(err)
        }

    }


    useEffect(() => {

        getProducts();
    }, []);



    const deleteData = async (row) => {

        try {

            const result = await axios.post(`/admin/deleteproductitem`, { id: row.id });
            if (result.status === 201) {
                setSuccesMessage(true);
                getProducts();
            }
        } catch (error) {
            setFailMessage(true);
        }
    };

    useEffect(() => {
        if (succesMessage) {
            notify();
            setSuccesMessage(false);
        } else {
            if (failMessage) {
                notify();
                setFailMessage(false);
            } else {
                if (productMessage) {
                    notify();
                    setProductMessage(false);
                }
            }
        }
    }, [succesMessage, failMessage, productMessage]);

    const onSearch = (e) => {
        const text = String(e.target.value).toLowerCase();
        if (text) {
            const result = product.filter((item) => {
                const str = JSON.stringify(item.name).toLowerCase();

                if (str.search(text) >= 0) return item;
            });
            setFilteredItems(result);
        } else {
            setFilteredItems(product);
        }
    };



    useEffect(() => {

        if (filteredItems) {
            let data = [];
            for (let i = 0; i < filteredItems.length; i++) {
                let arrays = [`${filteredItems[i].name}`, filteredItems[i].industry, filteredItems[i].iPSensitiveDetails.map((item) => item.url), `${filteredItems[i].funding}`, `${filteredItems[i].unassignedUnits}`, `${filteredItems[i].status}`]
                data.push(arrays);
            }
            if (data.length === filteredItems.length) {
                setExportData(data);
            }
        }
    }, [filteredItems]);

    const csvBuilder = () => {
        new CsvBuilder("Projects.csv")
            .setColumns(["Name", "Industry", "IP sensitive Details", "Funding", "Unassigned Units", "Status"])
            .addRows(exportData)
            .exportFile();
    }

    return (
        <Grid style={{ marginLeft: "11rem", marginTop: "1.5rem" }}>
            <HeaderAndLayout activeItem={"projects"} />
            <Grid item xs={6} md={6}>
                <h1 style={{ marginBottom: "1rem" }}> Products</h1>
            </Grid>
            <Button onClick={() => setOpen2(true)} variant="contained"
                style={{ backgroundColor: "green", color: "#ffff", margin: '10px' }}
            >Add a product</Button>
            <Grid item xs={12} md={12}>
                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell >Name</TableCell>
                                <TableCell >Category</TableCell>
                                <TableCell >Price</TableCell>
                                <TableCell >Description</TableCell>
                                <TableCell >Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            // callingBackend ? <BeatLoader /> :
                            <TableBody>
                                {product?.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">{row.id}</TableCell>
                                        <TableCell>
                                            {row.name}
                                        </TableCell>
                                        <TableCell >
                                            {row.category}
                                        </TableCell>
                                        <TableCell >{row.price}</TableCell>
                                        <TableCell>{row.description}</TableCell>
                                        <TableCell >
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <Button onClick={() => handleClickOpen(row)} variant="contained"
                                                    style={{ backgroundColor: "#0066B2", color: "#ffff" }}
                                                >Edit</Button>
                                                <Button onClick={() => deleteData(row)} variant="contained"
                                                    style={{ backgroundColor: "darkred", color: "#ffff", marginLeft: '10px' }}
                                                >Delete</Button>
                                            </div>

                                        </TableCell>
                                    </TableRow>
                                ))}
                                <Dialog
                                    handleClickOpen={handleClickOpen}
                                    open={open}
                                    handleClose={handleClose}
                                    loadData={getProducts}
                                    initialValues={initialValues}
                                    item={item}
                                    setSuccesMessage={setSuccesMessage}
                                    setFailMessage={setFailMessage}
                                    setProductMessage={setProductMessage}
                                />

                                <Dialog2
                                    handleClickOpen={() => setOpen2(true)}
                                    open={open2}
                                    handleClose={() => setOpen2(false)}
                                    loadData={getProducts}
                                    setSuccesMessage={setSuccesMessage}
                                    setFailMessage={setFailMessage}
                                    setProductMessage={setProductMessage}
                                />

                            </TableBody>
                        }
                    </Table>
                </TableContainer>
            </Grid>

            <ToastContainer position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHove />
        </Grid>
    );
}