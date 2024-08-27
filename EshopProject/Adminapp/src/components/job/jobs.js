import React, { useState, useEffect } from "react";
// import { makeStyles } from '@material-ui/core/styles';
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
import Dialog from "./dialogBox";
import BeatLoader from 'react-spinners/BeatLoader'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CsvBuilder } from 'filefy';
import { Chip } from "@material-ui/core";
import Pagination from '@material-ui/lab/Pagination';

// const useStyles = makeStyles({
//     table: {
//         minWidth: 250,
//     },
//     button: {
//         textAlign: "center",
//         backgroundColor: "#4094F7",
//         color: "#FFFFFF",
//         borderRadius: "0.5rem",
//         marginLeft: "29.8rem",
//         marginBottom: "1rem"
//     },
// });

export default function DenseTable() {
    // const classes = useStyles();
    const url = process.env.REACT_APP_BE_URL;
    const [job, setJob] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [initialValues, setInitialValues] = useState({});
    const [callingBackend, setCallingBackend] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [failMessage, setFailMessage] = useState(false);
    const [item, setItem] = useState([]);
    const [categoryId, setCategoryId] = useState();
    const [filteredItems, setFilteredItems] = useState([]);
    const [exportData, setExportData] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [count, setCount] = useState(10);
    const [cartList, setCartList] = useState([])

    const handlePageChange = (event, value) => {
        setPageNumber(value);
    };

    const notify = () => successMessage ? toast.success('Action successful!', {
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
    }) : null

    const handleClickOpen = (row) => {
        setItem(row);
        setOpen(true);
        setInitialValues(row);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (pageNumber) {
            // document.getElementById('clearme').value = "";
            getCartlist();
        }
    }, [pageNumber]);

    const loadData = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")
                    }`,
            },
        };
        try {
            setCallingBackend(true);
            const { data } = await axios.get(`/job/jobs/${pageNumber}`, config);
            setJob(data?.data);
            setFilteredItems(data?.data);
            setCount(data?.allPageCount)
            setCallingBackend(false);
        } catch (error) {
            setFailMessage(true);
        }
    };


    const getCartlist = async () => {
        try {
            const res = await axios.get(`${url}/admin/getcartlist`);
            if (res.status === 201) {
                setCartList(res?.data?.cartList)
            }
        } catch (err) {
            console.log(err)
        }

    }
    const deleteData = async (row) => {
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")
                    }`,
            },
        };
        try {
            const result = await axios.delete(`/job/admin/${row._id}`, config);
            if (result.status === 200) {
                setSuccessMessage(true);
                getCartlist();
            }
            else
                setFailMessage(true);
        } catch (error) {
            setFailMessage(true);
        }
    };

    const activeData = async (row) => {
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")
                    }`,
            },
        };
        try {
            const result = await axios.put(`/job/admin/${row._id}`, {
                status: "active"
            }, config);
            if (result.status === 200) {
                setSuccessMessage(true);
                getCartlist();
            }
            else
                setFailMessage(true);
        } catch (error) {
            setFailMessage(true);
        }
    };
    useEffect(() => {
        if (successMessage) {
            notify();
            setSuccessMessage(false);
        } else {
            if (failMessage) {
                notify();
                setFailMessage(false);
            }
        }
    }, [successMessage, failMessage]);

    const onSearch = (e) => {
        const text = String(e.target.value).toLowerCase();
        if (text) {
            const result = job.filter((item) => {
                const str = JSON.stringify(item.title).toLowerCase();

                if (str.search(text) >= 0) return item;
            });
            setFilteredItems(result);
        } else {
            setFilteredItems(job);
        }
    };


    useEffect(() => {
        if (filteredItems) {
            let data = [];
            for (let i = 0; i < filteredItems.length; i++) {
                let arrays = [`${filteredItems[i].title}`, `${filteredItems[i].description}`, filteredItems[i].projectID, `${filteredItems[i].units}`, `${filteredItems[i].jobType}`, `${filteredItems[i].timeAvailability}`, `${filteredItems[i].status}`]
                data.push(arrays);
            }
            if (data.length === filteredItems.length) {
                setExportData(data);
            }
        }
    }, [categoryId, filteredItems]);

    const csvBuilder = () => {
        new CsvBuilder("job_list.csv")
            .setColumns(["title", "description", "projectID", "units", "jobType", "timeAvailability", "status"])
            .addRows(exportData)
            .exportFile();
    }



    return (
        <Grid style={{ marginLeft: "11rem", marginTop: "1.5rem" }}>
            <HeaderAndLayout activeItem={"jobs"} />
            <Grid item xs={6} md={6}>
                <h1 style={{ marginBottom: "1rem" }}> Jobs</h1>
            </Grid>
            <form className="search">
                <div className="input-group" style={{ flexBasis: "100%", paddingBottom: "1rem" }}>
                    {/* <input
                        id="clearme"
                        name="search"
                        type="text"
                        className="form-control"
                        placeholder="Filter by job title.."
                        onChange={onSearch}
                        required
                        style={{ fontSize: "1rem", padding: "0.3rem" }}
                    />
                    <label className="visually-hidden" htmlFor="search"></label>
                    <Button onClick={csvBuilder} style={{ marginLeft: "1rem", backgroundColor: "#009E60", color: "#ffff" }}>
                        Export to CSV
                    </Button> */}
                </div>
            </form>
            <Grid item xs={12} md={12}>
                <TableContainer component={Paper}>
                    <Table style={{ minWidth: 250 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Product ID</TableCell>
                                <TableCell align="center">Product Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="center">Product Price</TableCell>
                                <TableCell align="center">Category</TableCell>
                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="center">User Email</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            // callingBackend ? <BeatLoader /> :
                            <TableBody>
                                {cartList?.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell component="th" scope="row">{`${row.productId}`} </TableCell>
                                        <TableCell align="center">{row.productName}</TableCell>
                                        <TableCell style={{ wordBreak: "break-all", width: "20rem" }}>
                                            {row.description}
                                        </TableCell>
                                        <TableCell align="center"> {row.productPrice} </TableCell>
                                        <TableCell align="center">{row.productCategory}</TableCell>
                                        <TableCell align="center">{row.quantity}</TableCell>
                                        <TableCell align="center">{row.userEmail}</TableCell>

                                    </TableRow>
                                ))}
                                <Dialog
                                    handleClickOpen={handleClickOpen}
                                    open={open}
                                    handleClose={handleClose}
                                    loadData={getCartlist}
                                    initialValues={initialValues}
                                    item={item}
                                    setSuccessMessage={setSuccessMessage}
                                    setFailMessage={setFailMessage}
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
