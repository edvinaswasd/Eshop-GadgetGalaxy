import * as React from 'react';
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextField } from '@material-ui/core';
import './categories.css';
import * as Yup from "yup";

export default function FormDialog({ open, handleClose, data, onChange, handleFormSubmit }) {
  const { name, code, color } = data;

  let validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("name is required!"),
    code: Yup.string()
      .required("code is required!"),
    color: Yup.string()
      .required("color is required!"),
  });

  return (
    <div className="section">
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        validationSchema={validationSchema}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className="title" id="alert-dialog-title">Add Categories</DialogTitle>
        <DialogContent>
          <form>
            <TextField id="name" value={name} onChange={e => onChange(e)} placeholder="Enter Name" label="Name" variant="outlined" margin="dense" fullWidth />
          </form>
          <form>
            <TextField id="code" value={code} onChange={e => onChange(e)} placeholder="Enter Code" label="Code" variant="outlined" margin="dense" fullWidth />
          </form>
          <form>
            <TextField id="color" value={color} onChange={e => onChange(e)} placeholder="Enter Color" label="Color" variant="outlined" margin="dense" fullWidth />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined">Cancel</Button>
          <Button className="createbutton" onClick={(e) => handleFormSubmit(e)} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
