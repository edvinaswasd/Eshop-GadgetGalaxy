import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
    // backgroundColor: "blue",
    // width:'100%'
  },
  center: {
    textAlign: "center",
  },
  padding: {
    padding: theme.spacing(3),
  },
  formControl: {
    // margin: theme.spacing(1),
    flexGrow: 1,
  },
  flex: {
    display: "flex",
  },
  button: {
    margin: theme.spacing(1),
  },
  autoCompleat: {
    margin: theme.spacing(1),
  },
  green: {
    backgroundColor: "green",
    color: "white",
  },
  table: {
    backgroundColor: "lightBlue",
  },
  // img:{
  //   paddingTop:theme.spacing(2),
  //   paddingBottom:theme.spacing(1),
  // },
  divider: {
    margin: theme.spacing(2, 0),
  },
  paper: {
    height: 100,
    width: 100,
  },
}));
