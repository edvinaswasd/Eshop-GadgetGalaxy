import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Card, Grid } from "@material-ui/core";

export default function PieChartOfSkills() {

    const [labels, setLabels] = useState([]);
    const [data, setData] = useState([]);
    const [alert, setAlert] = useState({
        showAlert: false,
        severity: "success",
        message: "",
    });
    const [backgroundColor, setBackgroundColor] = useState([]);

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
            let skillsArray = []
            let countArray = []
            let backgroundColorArray = []
            const { data } = await axios.get("/job/skillsCalculation/90", config);
            for (const skills of data) {
                skillsArray.push(skills?.skill)
                countArray.push(skills?.count)
            }
            setData([...countArray]);
            setLabels([...skillsArray]);
            for (let i = 0; i < countArray?.length; i++) {
                const r = Math.floor(Math.random() * 300);
                const g = Math.floor(Math.random() * 300);
                const b = Math.floor(Math.random() * 300);
                backgroundColorArray.push('rgba(' + r + ',' + g + ',' + b + ',10)')
            }
            setBackgroundColor([...backgroundColorArray])
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
                label: "Skills across all the jobs",
                data: data,
                backgroundColor: backgroundColor
            }
        ]
    }
    const styles = {
        pieContainer: {
            width: "100%",
            height: "100%",
            margin: "0 auto"
        },
    };

    return (
        <Card>
            <Grid style={styles.pieContainer}>
                <Pie
                    data={chartDetails}
                    width={200}
                    height={200}
                    fontSize='2px'
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: "Job skills"
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
    );
}