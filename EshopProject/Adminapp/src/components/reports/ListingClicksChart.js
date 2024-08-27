import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Card } from "@material-ui/core";

export default function ListingClicksChart() {

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
        try {
            const { data } = await axios.get("/listing/clicks/count");
            const visitors = data.visitor
            let users = data.users;
            let newData = [visitors]
            let labels = ["visitor"]
            const res = await axios.get("/user");
            const allUsers = res.data;
            // seting users' counts and labels array
            users.forEach((element) => {
                newData = [...newData, element.count]
                labels = [...labels, allUsers.filter(item => item._id == element.id)[0].userName]
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
        responsive: true,
        labels: labels,
        datasets: [
            {
                label: "Listing Clicks",
                data: data,
                backgroundColor: [
                    "#50AF95",
                ]
            }
        ]
    }
    const styles = {
        barContainer: {
            width: "40%",
            height: "40%",
            top: "78%",
            left: "79%",
            position: "absolute",
            transform: "translate(-50%, -50%)",
            overflow: "scroll"
        },
        relative: {
            position: "relative",
        },
    };

    return (
        <Card>
            <div style={styles.barContainer}>
                <Bar
                    data={chartDetails}
                    width={50}
                    height={50}
                    fontSize='2px'
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: "Listing Clicks"
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