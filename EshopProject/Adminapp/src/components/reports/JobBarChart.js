import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Card, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';


export default function JobBarChart() {

    const [labels, setLabels] = useState([]);
    const [data, setData] = useState([]);
    const [value, setValue] = useState('week');
    const [loading, setLoading] = useState(false)
    const [check, setCheck] = useState(false);
    const [alert, setAlert] = useState({
        showAlert: false,
        severity: "success",
        message: "",
    });


    useEffect(() => {
        loadData()
    }, [value]);

    const loadData = async () => {
        setLoading(true)
        setCheck(true)
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")
                    }`,
            },
        };
        try {
            const { data, status } = await axios.get(`/job/date/${value}`, config);
            if (status === 200) {
                setLoading(false)
                setCheck(false)
            }
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
                label: "New Jobs created",
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
            height: "100%",
        },
        relative: {
            position: "relative",
        },
    };


    const handleChange = (event) => {
        setValue(event.target.value);
    };


    return (
        <>
            <Grid item xs={12} sm={12} container>
                <Grid item xs={12} sm={12}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Time</FormLabel>
                        <RadioGroup row value={value} onChange={handleChange}>
                            <FormControlLabel disabled={(value === "month" || value === "year") && check} value="week" control={<Radio />} label="Last Week" />
                            <FormControlLabel disabled={(value === "week" || value === "year") && check} value="month" control={<Radio />} label="Last Month" />
                            <FormControlLabel disabled={(value === "month" || value === "week") && check} value="year" control={<Radio />} label="Last Year" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} style={styles.pieContainer}>
                {!loading ? (
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
                                            text: "New Jobs created"
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
                ) : (<Grid
                    item
                    container
                    alignItems="center"
                    justifyContent="center"
                    style={{ height: "30vh" }}
                >
                    <Grid item>
                        <CircularProgress />
                    </Grid>
                </Grid>)}

            </Grid>
        </>
    );
}