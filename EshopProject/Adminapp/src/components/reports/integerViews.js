import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import axios from "axios";
import { Card } from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ClipLoader from 'react-spinners/ClipLoader'
import 'react-toastify/dist/ReactToastify.css';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    table: {
        minWidth: 200,
        height: 100
    },
    button: {
        textAlign: "center",
        backgroundColor: "#4094F7",
        color: "#FFFFFF",
        borderRadius: "0.5rem",
        marginLeft: "29.8rem",
        marginBottom: "1rem"
    },
});

export default function IntegerViews() {

    const classes = useStyles();
    const [active, setActive] = useState("");
    const [inactive, setInactive] = useState("");
    const [alert, setAlert] = useState({
        showAlert: false,
        severity: "success",
        message: "",
    });
    const [callingBackend, setCallingBackend] = useState(false);

    useEffect(() => {
        loadData()
    }, []);

    useEffect(() => {
        if (active) {
            setCallingBackend(false)
        }
    }, [active]);

    const loadData = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")
                    }`,
            },
        };
        try {
            setCallingBackend(true);
            const { data } = await axios.get("/user", config);
            const actives = data.filter((active) => active.userStatus === "active");
            const active100DateRange = actives.filter((e) => {
                let date1 = new Date(e.updatedAt);
                let date2 = new Date();
                let Difference_In_Time = date2.getTime() - date1.getTime();
                let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                if (Difference_In_Days <= 100) {
                    return e;
                }
            })
            const inactive = parseInt(actives?.length) - parseInt(active100DateRange?.length);
            setActive(active100DateRange?.length);
            setInactive(inactive);
        } catch (error) {
            setAlert({
                showAlert: true,
                severity: "error",
                message: "Data loading failed!",
            });
        }
    };
    return (
        <Card style={{ marginTop: "5rem" }}>
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Active users within last 100 days</TableCell>
                            <TableCell align="center">Inactive users within last 100 days</TableCell>
                        </TableRow>
                    </TableHead>
                    {
                        callingBackend ? <ClipLoader color="#0066B2" /> :
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center">
                                        {active}
                                    </TableCell>
                                    <TableCell align="center">
                                        {inactive}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                    }
                </Table>
            </TableContainer>
        </Card>
    );
}