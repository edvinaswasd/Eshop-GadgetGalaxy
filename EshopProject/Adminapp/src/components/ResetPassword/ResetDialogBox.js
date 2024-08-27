import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Box, Grid, Modal, Snackbar } from "@material-ui/core";
import { FormControl, InputLabel, Select, MenuItem, InputAdornment, IconButton } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { TextField } from "formik-material-ui";
import { makeStyles } from "@material-ui/core/styles";
import ImageUploading from 'react-images-uploading';
import BeatLoader from 'react-spinners/BeatLoader';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Alert } from "@material-ui/lab";

let initialValues = {
    email: "",
};

let changePasswordSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is required!"),
});

const TitleStyles = {
    backgroundColor: "#fff",
    color: "#000",
    fontWeight: "800",
    display: "flex",
    fontSize: "2rem",
    marginBottom: "1rem",
    width: 350,
};
const TitleStyles2 = {
    backgroundColor: "#fff",
    color: "#0066B2",
    fontWeight: "600",
    display: "flex",
    fontSize: "1rem",
    marginTop: "0.5rem",
    marginBottom: "1.5rem",
    width: 350,
};

const fieldStyles = {
    marginBottom: "10px",
    width: "340px",
};

const formStyles = {
    display: "flex",
    flexDirection: "column",
};

const style = {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#fff",
    boxShadow: 20,
    p: 4,
    borderRadius: "8px",
    padding: "30px",
    border: "0px",
};

function ChangePassword({ open, handleClose }) {

    const [callBack, setCallBack] = useState(false);

    function handleClose2() {
        setAlert({
            ...alert,
            showAlert: false,
            severity: "",
            message: "",
        });
    }

    const [alert, setAlert] = useState({
        showAlert: false,
        severity: "success",
        message: "",
    });

    const sendResetLink = async (values) => {

        try {
            setCallBack(true);
            // eslint-disable-next-line
            const { data, status } = await axios.post('user/sendPasswordToken', values);
            handleClose();
            if (status === 200) {
                setAlert({
                    showAlert: true,
                    severity: "success",
                    message: "Please check your mail inbox,Password reset link has been sent!",
                });
                setTimeout(() => {
                    setAlert({
                        showAlert: false,
                        severity: "success",
                        message: "",
                    });
                }, 3000);
            }
            setCallBack(false);
        } catch (error) {
            setCallBack(false);
            handleClose();

            setAlert({
                showAlert: true,
                severity: "error",
                message: `${error?.data
                    ? error.data
                    : error.data?.message ? error.data?.message : error.response.data ? error.response.data : "Action Failed!"}`,
            });

            setTimeout(() => {
                setAlert({
                    showAlert: false,
                    severity: "success",
                    message: "",
                });
            }, 3000);
        }
    }


    return (
        <>
            <Snackbar
                sx={{ mt: "8vh" }}
                open={alert.showAlert}
                autoHideDuration={3000}
                onClose={handleClose2}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleClose2}
                    severity={alert.severity}
                    sx={{
                        fontSize: "16px",
                    }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Grid container justifyContent="center">
                        <Grid container item direction="column" alignItems="center">
                            <Grid
                                container
                                item
                                direction="column"
                                alignItems="flex-start"
                            >
                                <Grid item style={TitleStyles}>
                                    Reset Password
                                </Grid>
                                <Grid item style={TitleStyles2}>
                                    Enter the email to reset your password
                                </Grid>
                                <Formik
                                    initialValues={initialValues}
                                    onSubmit={sendResetLink}
                                    validationSchema={changePasswordSchema}
                                >
                                    {({ errors, isValid, touched, dirty }) => (
                                        <Form style={formStyles}>
                                            <Grid item>
                                                <Field
                                                    style={fieldStyles}
                                                    name="email"
                                                    label="Email"
                                                    component={TextField}
                                                    variant="outlined"
                                                    required
                                                    size="small"
                                                    margin="dense"
                                                    error={Boolean(errors.email) && Boolean(touched.email)}
                                                    helperText={Boolean(touched.email) && errors.email}
                                                ></Field>
                                            </Grid>

                                            <Grid item>
                                                <Button
                                                    sx={{
                                                        borderRadius: "8px",
                                                        fontSize: "1rem",
                                                        fontWeight: "700",
                                                        height: "2.5rem",
                                                        marginTop: "1rem",
                                                        minWidth: "340px",
                                                    }}
                                                    color="primary"
                                                    variant="contained"
                                                    disabled={!dirty || !isValid || callBack}
                                                    type="submit"
                                                    size="large"
                                                >
                                                    Reset Password
                                                </Button>
                                            </Grid>
                                        </Form>
                                    )}
                                </Formik>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
    );
}

export default ChangePassword;
