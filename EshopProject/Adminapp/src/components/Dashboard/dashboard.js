import React from "react";
import Grid from "@material-ui/core/Grid";
import HeaderAndLayout from '../layouts/HeaderAndLayout';
import PieChart from "../reports/PieChart";
import UserBarChart from "../reports/UserBarChart";
import ProjectBarChart from "../reports/ProjectBarChart";
import JobBarChart from "../reports/JobBarChart";
import IntegerViews from "../reports/integerViews";
import PieChartOfSkills from "../reports/PieChartOfSkills";
import PieChartOfUserType from "../reports/PieChartOfUserType";

export default function Dashboard() {
    return (
        <div className="container" style={{ marginTop: "2rem" }}>
            <HeaderAndLayout activeItem={"dashboard"} />
            <Grid container spacing={3} justify="center" m={2}>
                <Grid
                    item
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}

                >
                    <UserBarChart />
                </Grid>
                <Grid
                    item
                    xs={6}
                    sm={6}
                    md={6}

                >
                    <PieChart />

                </Grid>
            </Grid>
            <Grid container spacing={3} justifyContent="center" m={2}>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    justifyContent="center"
                >
                    <PieChartOfUserType />
                </Grid>
            </Grid>
            <Grid container spacing={3} justify="center" m={2}>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                >
                    <IntegerViews />
                </Grid>
            </Grid>
            <Grid container spacing={3} justifyContent="center" m={2}>
                <Grid
                    item
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}

                >
                    <ProjectBarChart />
                </Grid>
            </Grid>
            <Grid container spacing={3} justifyContent="center" m={2}>
                <Grid
                    item
                    xs={6}
                    sm={6}
                    md={6}
                    lg={6}
                    justifyContent="center"
                >
                    <PieChartOfSkills />
                </Grid>
                <Grid
                    item
                    xs={6}
                    sm={6}
                    md={6}
                >
                    <JobBarChart />
                </Grid>
            </Grid>

        </div>
    );
}
