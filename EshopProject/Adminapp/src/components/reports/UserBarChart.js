import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Card, Grid } from "@material-ui/core";
import Datepicker from "./Datepicker";
import Datepicker2 from "./Datepicker2";
import { date } from "yup";


export default function UserBarChart() {

    const [labels, setLabels] = useState([]);
    const [data, setData] = useState([]);
    const [alert, setAlert] = useState({
        showAlert: false,
        severity: "success",
        message: "",
    });
    const date_format = new Date();
    const newDate = date_format.getFullYear() + '-' + (date_format.getMonth() + 1) + '-' + date_format.getDate();
    const preDate = date_format.getFullYear() + '-' + (date_format.getMonth()) + '-' + date_format.getDate();
    const [startDate, setStartDate] = useState(preDate);
    const [endDate, setEndDate] = useState(newDate);
    let dateRange = startDate.toString() + '&' + endDate.toString();

    useEffect(() => {
        loadData()
    }, [dateRange]);

    const loadData = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")
                        }`,
                },
            };
            const { data } = await axios.get(`/user/date/${dateRange}`, config);
            let newData = []
            let labels = []


            data.forEach((e) => {
                if (labels.filter(item => item == e.createdAt.split("T")[0]).length == 0) {
                    labels.push(e.createdAt.split("T")[0]);
                    newData.push(data.filter(item => item.createdAt.split("T")[0] == e.createdAt.split("T")[0]).length);
                };
            })
            setLabels(labels);
            setData(newData);

        } catch (error) {
            setAlert({
                showAlert: true,
                severity: "error",
                message: "Data loading failed!",
            });
        }
    };

    const chartDetails = {
        maintainAspectRatio: false,
        responsive: false,
        labels: labels,
        datasets: [
            {
                label: "New users created",
                data: data,
                backgroundColor: [
                    "#009E60",
                ]
            }
        ]
    }

    const styles = {
        barContainer: {
            width: "40%",
            height: "40%",
            top: "85%",
            left: "80%",
            position: "absolute",
            transform: "translate(-50%, -50%)",
            overflow: "scroll"
        },
        relative: {
            position: "relative",
        },
    };

    return (
        <>
            <Grid item xs={12} sm={12} container>
                <Grid item xs={6} sm={6}>
                    <p>Start Date</p>
                    <Datepicker setStartDate={setStartDate} startDate={startDate} />
                </Grid>
                <Grid item xs={6} sm={6}>
                    <p>End Date</p>
                    <Datepicker2 setEndDate={setEndDate} endDate={endDate} />
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} style={styles.pieContainer}>
                <Card>
                    <Grid item xs={12} sm={12}>
                        <Bar
                            data={chartDetails}
                            width={'50%'}
                            height={'25%'}
                            fontSize='2px'
                            options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: "New users created"
                                    },
                                    legend: {
                                        display: true,
                                        position: "bottom"
                                    }
                                }
                            }}
                        />
                    </Grid>
                </Card>
            </Grid>
        </>
    );
}