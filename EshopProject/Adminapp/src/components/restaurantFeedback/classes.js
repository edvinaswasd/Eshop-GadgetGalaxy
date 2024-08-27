import { makeStyles, withStyles } from "@material-ui/core/styles";
import { TextField } from "formik-material-ui";

export const useStyles = makeStyles((theme) => ({
  account: {
    width: "100%",
    marginTop: 20,
    marginLeft: 30,
    backgroundColor: "#FFFAF7",
    padding: 25,
    [theme.breakpoints.down("sm")]: {
      width: 755,
      maxWidth: 750,
      margin: 0,
      padding: 20,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      maxWidth: 345,
      overflow: "auto",
      marginLeft: 0,
      marginTop: 0,
      padding: 10,
    },
  },
  paper: {
    padding: 25,
    background: "#ffffff",
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
    [theme.breakpoints.down("xs")]: {
      padding: 0,
    },
  },
  container: {
    maxHeight: 440,
  },
  editInfo: {
    color: "#000",
    fontSize: "1.5rem",
    display: "flex",
    justifyContent: "flex-start",
    marginLeft: 40,
    marginBottom: 10,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  cell: {
    color: "#000",
    fontSize: "1rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
      minWidth: 50,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.8rem",
      minWidth: 117,
    },
  },
  heading: {
    color: "#000",
    fontSize: "1rem",
    backgroundColor: "#ebebe0",
    height: 50,
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    marginBottom: 1,
  },
  message: {
    color: "#000",
    fontSize: "1rem",
    backgroundColor: "#e6ffe6",
    height: 50,
    display: "flex",
    alignContent: "center",
    alignItems: "center",
  },
  resName: {
    color: "#000",
    fontSize: "1rem",
    backgroundColor: "#e6ffe6",
    height: 50,
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 1,
  },
  reply: {
    display: "flex",
    justifyContent: "flex-end",
  },
  replyButton: {
    textTransform: "capitalize",
  },
  button: {
    borderRadius: "20px",
    textTransform: "capitalize",
    fontSize: "1rem",
    backgroundColor: "#e45826",
    color: "#fff",
    width: "160px",
    fontWeight: 400,
    height: 40,
    marginBottom: 5,
    marginRight: 20,
    "&:hover": {
      backgroundColor: "#e45826",
      boxShadow: "none",
    },
  },
  cellText: {
    color: "#000",
    fontSize: "0.9rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.9rem",
    },
  },
}));

export const CssTextField = withStyles((theme) => ({
  root: {
    "& label.Mui-focused": {
      color: "#e45826",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#e45826",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "2px solid #e45826",
        height: "70px",
        fontSize: "1.3rem",
        marginRight: 20,
        marginTop: 10,
        marginBottom: 10,
        [theme.breakpoints.down("md")]: {
          height: "50px",
          fontSize: "1.2rem",
        },
        [theme.breakpoints.down("sm")]: {
          height: "50px",
          fontSize: "1.1rem",
        },
        [theme.breakpoints.down("xs")]: {
          height: "45px",
          fontSize: "1rem",
        },
      },
      "&:hover fieldset": {
        borderColor: "#e45826",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#e45826",
      },
    },
  },
}))(TextField);
