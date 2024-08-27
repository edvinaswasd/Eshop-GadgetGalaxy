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
import { makeStyles } from "@material-ui/core/styles";
import BeatLoader from 'react-spinners/BeatLoader';

export default function ResponsiveDialog(props) {
    const [componentType, setComponentType] = useState("create");
    const [callingBackend, setCallingBackend] = useState(false);
    const { open, handleClose, loadData } = props;
    const [finished, setFinished] = useState(false);
    const [finalValues, setFinalValues] = useState(null);
    const [check, setCheck] = useState(true);

    const [initialValues, setInitialValues] = useState({
        title: props.initialValues?.title || "",
        description: props.initialValues?.description || "",
        units: props.initialValues?.units || "",
        jobType: props.initialValues?.jobType || "",
        timeAvailability: props.initialValues?.timeAvailability || ""
    });
    let validationSchema = Yup.object().shape({
        title: Yup.string()
            // .required("Job Title is required")
            .min(3, "Too short")
            .max(20, "Too long"),
        description: Yup.string()
            // .required("Description is required")
            .min(100, "Too short")
            .max(200, "Too long"),
        units: Yup.number().required("Units are  required"),
        jobType: Yup.string()
            // .required("Job Type is required")
            .min(3, "Too short")
            .max(20, "Too long"),
    });
    
    useEffect(() => {
        if (props.initialValues) {
            setComponentType("update")
            setValues()
        }
    }, [props.initialValues]);

    const setValues = () => {
        setInitialValues({
            title: props.initialValues?.title || "",
            description: props.initialValues?.description || "",
            units: props.initialValues?.units || "",
            jobType: props.initialValues?.jobType || "",
            timeAvailability: props.initialValues?.timeAvailability || ""
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

    const publishJob = async () => {

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        };

        setCheck(false)

        try {
            let payload = {
                title: finalValues?.title,
                description: finalValues?.description,
                units: finalValues?.units,
                jobType: finalValues?.jobType,
                timeAvailability: finalValues?.timeAvailability
            };


            const res = await axios.put(`/job/admin/${props.initialValues._id}`, payload, config)

            if (res.status === 200) {
                setInitialValues({ "title": "", "description": "", "units": "", "jobType": "", "timeAvailability": "" })
                setFinalValues(null)
                setCallingBackend(false);
                handleClose();
                loadData();
                props.setSuccessMessage(true);
                setCheck(true)

            }

        } catch (error) {
            props.setFailMessage(true);
            setCheck(true)
        }
    }



    const submit = async (cb) => {
        setFinalValues({ ...initialValues })
    };

    useEffect(() => {
        if (finalValues) {
            setCallingBackend(false);
            setFinished(true);
        }
    }, [finalValues]);


    useEffect(() => {
        if (finished)
            publishJob()
        setFinished(false)

    }, [finished]);

    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={submit}
                validationSchema={validationSchema}
                enableReinitialize
            >
                {({ errors, isValid, dirty, handleChange, values, setFieldValue, getFieldProps }) => {
                    return (
                        <Form>
                            <Dialog
                                fullWidth="100%"
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="responsive-dialog-title"
                            >
                                <DialogTitle id="responsive-dialog-title">
                                    {componentType === "create" && (
                                        "Add a new Job"
                                    )}
                                    {componentType === "update" && (
                                        "Edit Job"
                                    )}
                                </DialogTitle>
                                <DialogContent>
                                    <Grid container spacing={2} >
                                        <Grid item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <Grid>
                                                <Field
                                                    {...getFieldProps('title')}
                                                    onChange={handleInput}
                                                    name="title"
                                                    label="Job Title"
                                                    component={TextField}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline

                                                ></Field>
                                            </Grid>
                                            <Grid style={{ marginTop: "1rem" }}>
                                                <Field
                                                    {...getFieldProps('description')}
                                                    onChange={handleInput}
                                                    name="description"
                                                    label="Description"
                                                    component={TextField}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                ></Field>
                                            </Grid>
                                            <Grid style={{ marginTop: "1rem" }}>
                                                <Field
                                                    onChange={handleInput}
                                                    name="units"
                                                    label="Units"
                                                    component={TextField}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                ></Field>
                                            </Grid>
                                            <Grid style={{ marginTop: "1rem" }}>
                                                <Field
                                                    onChange={handleInput}
                                                    name="jobType"
                                                    label="Job Type"
                                                    component={TextField}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                ></Field>
                                            </Grid>
                                            <Grid style={{ marginTop: "1rem" }}>
                                                <FormControl fullWidth variant="outlined">
                                                    <InputLabel id="demo-simple-select-label">
                                                        Time Availability
                                                    </InputLabel>
                                                    <Select
                                                        onChange={handleInput}
                                                        value={initialValues.timeAvailability ? initialValues.timeAvailability : ""}
                                                        labelId="demo-simple-select-outlined-label"
                                                        id="demo-simple-select-outlined"
                                                        label="Time Availability"
                                                        name="timeAvailability"
                                                    >
                                                        <MenuItem value={"full-time"}>Full Time</MenuItem>
                                                        <MenuItem value={"part-time"}>Part Time</MenuItem>
                                                    </Select>
                                                </FormControl>
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
                                            {componentType === "create" && (
                                                "Submit"
                                            )}
                                            {componentType === "update" && (
                                                "Update"
                                            )}

                                        </Button>
                                        <Button
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
