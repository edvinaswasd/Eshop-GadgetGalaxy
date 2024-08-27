import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Grid } from "@material-ui/core";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { TextField } from "formik-material-ui";
import ImageUploading from 'react-images-uploading';
import BeatLoader from 'react-spinners/BeatLoader';

export default function ResponsiveDialog(props) {
    // eslint-disable-next-line
    const [componentType, setComponentType] = useState("create");
    const [callingBackend, setCallingBackend] = useState(false);
    const { open, handleClose, loadData } = props;
    let [image, setImage] = useState([]);
    const [finsihed, setFinished] = useState(false);
    const [finalValues, setFinalValues] = useState(null);
    const [check, setCheck] = useState(true);

    const [initialValues, setInitialValues] = useState({
        fname: props.initialValues?.fname || "",
        lname: props.initialValues?.lname || "",
        email: props.initialValues?.email || "",
        isAdmin: props.initialValues?.isAdmin || "",
    });
    let validationSchema = Yup.object().shape({
        fname: Yup.string()
            .required("firstName is required!")
            .max(35, "Max length for the name is 35")
            .min(2, "Min length for the name is 2"),
        lname: Yup.string()
            .required("lastName is required!")
            .max(35, "Max length for the name is 35")
            .min(2, "Min length for the name is 2"),
        email: Yup.string()
            .email('Invalid email format')
            .required("userName is required!"),
        isAdmin: Yup.number().oneOf([0, 1]).required('This field is required.'),
    });

    useEffect(() => {
        if (props.initialValues) {
            setComponentType("update")
            setValues()
        }
        // eslint-disable-next-line
    }, [props.initialValues]);

    const setValues = () => {
        setInitialValues({
            fname: props.initialValues?.fname || "",
            lname: props.initialValues?.lname || "",
            email: props.initialValues?.email || "",
            isAdmin: props.initialValues?.isAdmin || "",
        });
    }

    const [alert, setAlert] = useState({
        showAlert: false,
        severity: "success",
        message: "",
    });

    const handleInput = (e) => {
        setInitialValues((pre) => ({
            ...pre,
            [e.target.name]: e.target.value
        }));
    };

    const publishProduct = () => {

        setCheck(false)
        let payload = {}

        payload = {
            email: finalValues?.email,
            fname: finalValues?.fname,
            lname: finalValues?.lname,
            isAdmin: parseInt(finalValues?.isAdmin),

        }

        axios.post(`/admin/updateuser`, payload).then((res) => {
            setInitialValues({ "fname": "", "email": "", "lname": "", 'isAdmin': "" })
            setFinalValues(null)
            setCallingBackend(false);
            handleClose();
            loadData();
            props.setSuccesMessage(true);
            if (res.status === 201) {
                setCheck(true)
            }
        }).catch((error) => {
            props.setFailMessage(true);
            setCheck(true)
        })
    }

    const submit = async () => {
        setFinalValues({ ...initialValues })
    };

    useEffect(() => {
        if (finalValues) {
            setCallingBackend(false);
            setFinished(true);
        }
    }, [finalValues]);

    useEffect(() => {
        if (finsihed) {
            publishProduct()
            setFinished(false)
        }

    }, [finsihed]);


    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={submit}
                validationSchema={validationSchema}
                enableReinitialize
            >
                {({ isValid, getFieldProps }) => {
                    return (
                        <Form>
                            <Dialog
                                fullWidth="100%"
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="responsive-dialog-title"
                            >
                                <DialogTitle id="responsive-dialog-title">
                                    Edit a User
                                </DialogTitle>
                                <DialogContent>
                                    <Grid container spacing={2} >
                                        <Grid item md={6}>
                                            <Grid>
                                                <Field
                                                    {...getFieldProps('fname')}
                                                    onChange={handleInput}
                                                    name="fname"
                                                    label="First Name"
                                                    component={TextField}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline

                                                ></Field>
                                            </Grid>
                                            <Grid style={{ marginTop: "1rem" }}>
                                                <Field
                                                    {...getFieldProps('lname')}
                                                    onChange={handleInput}
                                                    name="lname"
                                                    label="Last Name"
                                                    component={TextField}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                ></Field>
                                            </Grid>
                                            <Grid style={{ marginTop: "1rem" }}>
                                                <Field
                                                    onChange={handleInput}
                                                    name="email"
                                                    label="Email"
                                                    component={TextField}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                ></Field>
                                            </Grid>
                                            <Grid style={{ marginTop: "1rem" }}>
                                                <Field
                                                    type="number"
                                                    onChange={handleInput}
                                                    name="isAdmin"
                                                    label="isAdmin"
                                                    component={TextField}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                ></Field>
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                </DialogContent>
                                {callingBackend ? <BeatLoader /> :
                                    <DialogActions>
                                        <Button
                                            onClick={submit}
                                            variant="contained"
                                            type="submit"
                                            disabled={!check || !isValid}
                                            color="primary"
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            color="secondary"
                                            onClick={handleClose}
                                            autoFocus
                                        >
                                            cancel
                                        </Button>
                                    </DialogActions>
                                }

                            </Dialog>
                        </Form>
                    );
                }}
            </Formik>

        </div >
    );
}
