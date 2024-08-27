import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Card, Grid } from "@material-ui/core";
import {
    ClipLoader
} from "react-spinners";

export default function PieChartOfUserType() {

    const [labels, setLabels] = useState([]);
    const [data, setData] = useState([]);
    const [alert, setAlert] = useState({
        showAlert: false,
        severity: "success",
        message: "",
    });
    const [callingBackend, setCallingBackend] = useState(false);

    useEffect(() => {
        loadData()
    }, []);

    const loadData = async () => {

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")
                    }`,
            },
        };
        try {
            setCallingBackend(true)
            const { data } = await axios.get("/user/rolesChart", config);
            setData([data.collaboratorCount, data.founderCount]);
            setLabels(["Collaborator", "Founder"]);
            setCallingBackend(false)
        } catch (error) {
            setAlert({
                showAlert: true,
                severity: "error",
                message: "Data loading failed!",
            });
        }
    };

    const chartDetails = {
        maintainAspectRatio: true,
        responsive: true,
        labels: labels,
        datasets: [
            {
                label: "Type of users",
                data: data,
                backgroundColor: [
                    "#0066B2",
                    "#009E60"
                ]
            }
        ]
    }
    const styles = {
        pieContainer: {
            width: "30%",
            height: "30%",
            margin: "0 auto"
        },
    };

    return (
        <Card>
            <Grid style={styles.pieContainer}>
                {
                    callingBackend ?
                        <Grid container justifyContent="center">
                            <ClipLoader color="#0066B2" style={{ marginLeft: "5rem" }} />
                        </Grid> :
                        <Pie
                            data={chartDetails}
                            width={200}
                            height={200}
                            fontSize='2px'
                            options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: "Type of users"
                                    },
                                    legend: {
                                        display: true,
                                        position: "bottom"
                                    }
                                }
                            }}
                        />}
            </Grid>
        </Card>
    );
}