import React from 'react'
import {useStyles} from "../../styles/classes";
import photo from '../../assets/error.png';


export default function PageNotFound() {

    const classes = useStyles();

    return (
        <div className={classes.center}>            
            <img  className={classes.img} src={photo} alt="Error" />
            <h2> PAGE NOT FOUND</h2>
        </div>
    )
}
