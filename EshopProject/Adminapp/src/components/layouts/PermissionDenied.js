import { Grid} from '@material-ui/core';
import React from 'react';
import {useStyles} from "../../styles/classes";

import photo from '../../assets/guard.png';

export default function PermissionDenied() {

  const classes = useStyles();

  return (
    <Grid container>
      <Grid item md={12} className={classes.center}>        
        <img className={classes.img} src={photo} alt="Permission denied" />
        <h2>ACCESS DENIED</h2>
      </Grid>
    </Grid>
  );
}
