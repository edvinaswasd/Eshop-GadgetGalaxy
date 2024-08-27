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
import BeatLoader from 'react-spinners/BeatLoader';
import DropFileInput from '../components/drop-file-input/DropFileInput'
import '../../styles/styles.css'
import DeleteIcon from '@material-ui/icons/Delete';

export default function ResponsiveDialog(props) {
  const [componentType, setComponentType] = useState("create");
  const [callingBackend, setCallingBackend] = useState(false);
  const { open, handleClose, loadData } = props;
  const [finsihed, setFinished] = useState(false);
  const [finalValues, setFinalValues] = useState(null);
  const [check, setCheck] = useState(false);

  const [initialValues, setInitialValues] = useState({
    name: props.initialValues?.name || "",
    category: props.initialValues?.category || "",
    price: props.initialValues?.price || "",
    description: props.initialValues?.description || "",

  });
  let validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required!")
      .max(35, "Max length for the name is 35")
      .min(2, "Min length for the name is 2"),
    category: Yup.string()
      .required("Category is required!"),
    price: Yup.number()
      .required("Price is required!"),
    description: Yup.string()
      .required("Description is required!"),
  });

  useEffect(() => {
    if (props.initialValues) {
      setComponentType("update")
      setValues()
    }
  }, [props.initialValues]);

  const setValues = () => {
    setInitialValues({
      name: props.initialValues?.name || "",
      category: props.initialValues?.category || "",
      price: props.initialValues?.price || "",
      description: props.initialValues?.description || "",

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

  const publishProduct = async () => {

    setCheck(true)
    let payload = {}

    payload = {
      id: props.item.id,
      name: finalValues?.name,
      category: finalValues?.category,
      price: finalValues?.price,
      description: finalValues?.description,

    }

    axios.post(`/admin/updateproductitem`, payload,).then((res) => {
      setInitialValues({ "name": "", "category": "", "unasspriceignedUnits": "", "description": "" })
      setFinalValues(null)
      setCallingBackend(false);
      handleClose();
      loadData();
      props.setSuccesMessage(true);
      if (res.status === 201) {
        setCheck(false)
      }
    })
      .catch((error) => {
        props.setFailMessage(true);
        setCheck(false)
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
        {({ errors, isValid, dirty, handleChange, values, setFieldValue, getFieldProps }) => {
          return (
            <Form>
              <Dialog
                fullWidth
                maxWidth="sm"
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogTitle id="responsive-dialog-title">
                  Edit a Project
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={2} >
                    <Grid item md={12}>
                      <Grid>
                        <Field
                          {...getFieldProps('name')}
                          onChange={handleInput}
                          name="name"
                          label="Name"
                          component={TextField}
                          variant="outlined"
                          fullWidth
                          multiline
                        ></Field>
                      </Grid>
                      <Grid style={{ marginTop: "1rem" }}>
                        <Field
                          {...getFieldProps('category')}
                          onChange={handleInput}
                          name="category"
                          label="Category"
                          component={TextField}
                          variant="outlined"
                          fullWidth
                          multiline
                        ></Field>
                      </Grid>
                      <Grid style={{ marginTop: "1rem" }}>
                        <Field
                          onChange={handleInput}
                          name="price"
                          label="Price"
                          component={TextField}
                          variant="outlined"
                          fullWidth
                        ></Field>
                      </Grid>
                      <Grid style={{ marginTop: "1rem" }}>
                        <Field
                          onChange={handleInput}
                          name="description"
                          label="Description"
                          component={TextField}
                          variant="outlined"
                          fullWidth
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
                      color="primary"
                      type="submit"
                      disabled={!isValid || check}
                    >
                      Update
                    </Button>
                    <Button
                      onClick={handleClose}
                      autoFocus
                      color="secondary"
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

    </div>
  );
}
