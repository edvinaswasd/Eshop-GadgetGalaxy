import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Card } from "@material-ui/core";

export default function PieChart() {

    const [labels, setLabels] = useState([]);
    const [data, setData] = useState([]);
    const [alert, setAlert] = useState({
        showAlert: false,
        severity: "success",
        message: "",
    });

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
            const { data } = await axios.get("/user", config);
            const active = data.filter((active) => active.userStatus === "active");
            const inactive = data.filter((inactive) => inactive.userStatus === "inactive");
            const newData = [inactive?.length, active?.length]
            setData(newData);
            setLabels(["Deactivated", "Active"]);
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
                label: "No of deactivated users",
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
            width: "22%",
            height: "22%",
            top: "25%",
            left: "79%",
            position: "absolute",
            transform: "translate(-50%, -50%)",
        },
        relative: {
            position: "relative",
        },
    };

    return (
        <Card>
            <div style={styles.pieContainer}>
                <Pie
                    data={chartDetails}
                    width={50}
                    height={50}
                    fontSize='2px'
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: "Users"
                            },
                            legend: {
                                display: true,
                                position: "bottom"
                            }
                        }
                    }}
                />
            </div>
        </Card>
    );
}