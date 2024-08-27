import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TablePagination from '@material-ui/core/TablePagination';
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

export default function DenseTable() {
    const url = process.env.REACT_APP_BE_URL;
    const classes = useStyles();
    const [product, setProduct] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [initialValues, setInitialValues] = useState({});
    const [callingBackend, setCallingBackend] = useState(false);
    const [succesMessage, setSuccesMessage] = useState(false);
    const [failMessage, setFailMessage] = useState(false);
    const [item, setItem] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [exportData, setExportData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [dense, setDense] = useState(false);
    const [users, setUsers] = useState([])

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
    }) : null

    const handleClickOpen = (row) => {
        setItem(row);
        setOpen(true);
        setInitialValues(row);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredItems.length - page * rowsPerPage);

    const loadData = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")
                    }`,
            },
        };

        try {
            setCallingBackend(true);
            const { data } = await axios.get("/user", config);
            setProduct(data);
            setFilteredItems(data);
            setCallingBackend(false);
        } catch (error) {
            setFailMessage(true);
        }
    };


    const getUsers = async () => {
        try {
            const res = await axios.get(`${url}/admin/getallusers`);
            if (res.status === 201) {
                setUsers(res?.data?.userList)
            }
        } catch (err) {
            console.log(err)
        }


    }

    useEffect(() => {
        getUsers()
    }, [])



    useEffect(() => {
        if (succesMessage) {
            notify();
            setSuccesMessage(false);
        } else {
            if (failMessage) {
                notify();
                setFailMessage(false);
            }
        }
    }, [succesMessage, failMessage]);

    const onSearch = (e) => {
        const text = String(e.target.value).toLowerCase();
        if (text) {
            const result = product.filter((item) => {
                const str = JSON.stringify(item.firstName).toLowerCase();

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
                let arrays = [`${filteredItems[i].firstName}`, `${filteredItems[i].lastName}`, filteredItems[i].email, `${filteredItems[i].profilePic}`, `${filteredItems[i].userType}`, `${filteredItems[i].userStatus}`]
                data.push(arrays);
            }
            if (data.length === filteredItems.length) {
                setExportData(data);
            }
        }
    }, [filteredItems]);

    const csvBuilder = () => {
        new CsvBuilder("user_list.csv")
            .setColumns(["firstName", "lastName", "email", "profilePic", "userType", "userStatus"])
            .addRows(exportData)
            .exportFile();
    }

    return (
        <Grid style={{ marginLeft: "11rem", marginTop: "1.5rem" }}>
            <HeaderAndLayout activeItem={"users"} />
            <Grid item xs={6} md={6}>
                <h1 style={{ marginBottom: "1rem" }}> Users</h1>
            </Grid>
            <form className="search">
                <div className="input-group" style={{ flexBasis: "100%", paddingBottom: "1rem" }}>
                    {/* <input
                        id="search"
                        name="search"
                        type="text"
                        className="form-control"
                        placeholder="Filter by user name.."
                        onChange={onSearch}
                        required
                        style={{ fontSize: "1rem", padding: "0.3rem" }}
                    />
                    <label className="visually-hidden" htmlFor="search"></label> */}
                    {/* <Button onClick={csvBuilder} style={{ marginLeft: "1rem", backgroundColor: "#009E60", color: "#ffff" }}>
                        Export to CSV
                    </Button> */}
                </div>
            </form>
            <Grid item xs={12} md={12}>
                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell align="center">Email</TableCell>
                                <TableCell align="center">IsAdmin</TableCell>

                            </TableRow>
                        </TableHead>
                        {
                            //    callingBackend  ? <BeatLoader /> :
                            <TableBody>
                                {users?.
                                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    map((row, i) => {
                                        return (
                                            <TableRow key={i}>
                                                <TableCell component="th" scope="row">{`${row.fname}`} </TableCell>
                                                <TableCell align="center">{row.lname}</TableCell>
                                                <TableCell align="center">{row.email}</TableCell>
                                                <TableCell align="center">{row.isAdmin === 1 ? 'True' : "False"}</TableCell>


                                                <TableCell align="center">
                                                    <Button onClick={() => handleClickOpen(row)} variant="contained"
                                                        style={{ backgroundColor: "#0066B2", color: "#ffff" }}>Edit</Button>

                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                                <Dialog
                                    handleClickOpen={handleClickOpen}
                                    open={open}
                                    handleClose={handleClose}
                                    loadData={getUsers}
                                    initialValues={initialValues}
                                    item={item}
                                    setSuccesMessage={setSuccesMessage}
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
