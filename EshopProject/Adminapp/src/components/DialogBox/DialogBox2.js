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
  const url = process.env.REACT_APP_BE_URL;
  const [componentType, setComponentType] = useState("create");
  const [callingBackend, setCallingBackend] = useState(false);
  const { open, handleClose, loadData } = props;
  const [finsihed, setFinished] = useState(false);
  const [finalValues, setFinalValues] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [check, setCheck] = useState(false);

  const [initialValues, setInitialValues] = useState({
    name: "",
    category: "",
    price: "",
    description: "",

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


  const submit = async (values) => {
    try {
      const res = await axios.post(`${url}/admin/addproduct`, { name: initialValues.name, price: initialValues.price, description: initialValues.description, category: initialValues.category });
      if (res.status === 201) {
        props.loadData()
        props.handleClose();
        props.setSuccesMessage(true);
      }
    } catch (err) {
      console.log(err)
    }
  };








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
                  Add a Project
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
                      Add
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
