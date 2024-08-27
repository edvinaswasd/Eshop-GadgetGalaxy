import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { Button, Grid } from '@material-ui/core';
import HeaderAndLayout from '../layouts/HeaderAndLayout';
import FormDialog from './dialog';
import './categories.css';
import axios from "axios";
import BeatLoader from 'react-spinners/BeatLoader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Categories() {

    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = useState({ name: "", code: "", color: "" });
    const [tableData, setTableData] = useState([]);
    const [callingBackend, setCallingBackend] = useState(false);
    const [succesMessage, setSuccesMessage] = useState(false);
    const [failMessage, setFailMessage] = useState(false);
    const [productMessage, setProductMessage] = useState(false);
    const [categoryCodeMessage, setcategoryCodeMessage] = useState(false);

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
    }) : productMessage ? toast.warn('Please delete the listings first', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    })  : categoryCodeMessage ? toast.warn('Cannot update the code when it is used in listings', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }) : null

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
                else {
                    if (categoryCodeMessage) {
                        notify();
                        setcategoryCodeMessage(false);
                    }
                }
            }
        }
        // eslint-disable-next-line
    }, [succesMessage, failMessage, productMessage, categoryCodeMessage]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    // eslint-disable-next-line
    const [alert, setAlert] = useState({
        showAlert: false,
        severity: "success",
        message: "",
    });

    const handleFormSubmit = async (e) => {

        try {
            const newData = await axios.post("/category", formData);
            setTableData(...tableData
                , newData)
            setOpen(false);
            loadData();
            setSuccesMessage(true)
            e.preventDefault();
        }
        catch (error) {
            setFailMessage(true);
        }

    };

    const handleUpdate = (oldRow, newRow) => {
        return new Promise((resolve, reject) => {
            axios.put(`/category/${oldRow._id}`, {
                name: newRow.name,
                code: newRow.code,
                color: newRow.color
            }).then(res => {
                resolve(res)
                setSuccesMessage(true)
            }).catch(err => {
                setFailMessage(true)
                reject(err)
            }).finally(() => {
                loadData();
            })
        })
    }
    const handleDelete = (oldRow) => {
        return new Promise((resolve, reject) => {
            axios.delete(`/category/${oldRow._id}`).then(res =>
                resolve(res),
                setSuccesMessage(true)
            ).catch(err => {
                setFailMessage(true)
                reject(err)
            }).finally(() => {
                loadData();
            })
        })
    }
    const productCategoryById = (oldRow) => {
        return new Promise((resolve, reject) => {
            axios.get(`/listing/all/,/,?categories=${oldRow.code}`).then(res =>
                resolve(res)
            ).catch(err =>
                reject(err),
            ).finally(() => {
                loadData();
            })
        })
    }

    const loadData = async () => {
        try {
            setCallingBackend(true);
            const { data } = await axios.get("/category");
            setTableData(data);
            setCallingBackend(false);
        } catch (error) {
            setAlert({
                showAlert: true,
                severity: "error",
                message: "Data loading failed!",
            });
        }
    };

    const columns = [
        { title: "Name", field: "name" },
        { title: "Code", field: "code" },
        { title: "Color", field: "color" },
    ]
    const onChange = (e) => {
        setFormData((pre) => ({
            ...pre,
            [e.target.id]: e.target.value
        }));
    }
    useEffect(() => {
        loadData();
    }, [])

    return (
        <div className="container" style={{ marginTop: "2rem" }}>
            <HeaderAndLayout activeItem={"categories"} />
            <Grid align="right" >
                <Button
                    // className="createbutton" 
                    style={{ backgroundColor: "#009E60", color:"#ffff" }}
                    variant="contained" 
                    onClick={handleClickOpen}>+ Create Category</Button>
            </Grid>
            {callingBackend ? <BeatLoader /> :
                <MaterialTable columns={columns} data={tableData}
                    title="Categories"
                    options={{ search: false, filtering: false, paging: true, paginationType: "stepped", exportButton: true, exportAllData: true, actionsColumnIndex: -1, addRowPosition: "first" }}
                    editable={{
                        onRowDelete: oldRow => new Promise((resolve, reject) => {
                            productCategoryById(oldRow).then(res => {
                                const check = res.data.length;
                                if (check === 0) {
                                    handleDelete(oldRow).then(res => {
                                        const index = oldRow.tableData._id;
                                        const updatedRows = [...tableData]
                                        updatedRows.splice(index, 1)
                                        setTimeout(() => {
                                            setFormData(updatedRows)
                                            resolve()
                                        }, 2000)
                                    }).catch(err => reject())
                                } else {
                                    setProductMessage(true)
                                    reject("Please delete the listings first")
                                }
                            }).catch(err => reject(err))
                        }),
                        onRowUpdate: (updatedRow, oldRow) => new Promise((resolve, reject) => {
                            productCategoryById(oldRow).then(res => {
                                const check = res.data.length;
                                if ((check != 0 && updatedRow.code === oldRow.code) || check === 0) {
                                handleUpdate(oldRow, updatedRow).then(res => {
                                        const index = oldRow.tableData._id;
                                        const updatedRows = [...tableData]
                                        updatedRows[index] = updatedRow
                                        setTimeout(() => {
                                            setFormData(updatedRows)
                                            resolve()
                                        }, 2000)
                                }).catch(err => reject())
                            }
                            else {
                                setcategoryCodeMessage(true)
                                reject("Cannot update the code when it is used in listings")
                            }}).catch(err => reject(err))
                        })
                    }}
                />}
            <FormDialog open={open} handleClose={handleClose} data={formData} onChange={onChange} handleFormSubmit={handleFormSubmit} />
            <ToastContainer position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHove />
        </div>
    )
}

export default Categories
