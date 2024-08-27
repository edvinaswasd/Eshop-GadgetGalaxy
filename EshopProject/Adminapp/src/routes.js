import * as React from 'react'
import Register from "../src/components/layouts/Register";
import Account from '../src/components/Account/Account';
import "../src/index.css";
import Categories from "./components/Categories/Categories";
import Dashboard from "./components/Dashboard/dashboard";
import Products from "./components/Product/product";
import Users from "./components/user/users";
import Jobs from "./components/job/jobs";
import Reports from "./components/reports/Reports";
import GeneratePDF from "./components/GeneratePDF";
import GenerateXML from "./components/GenerateXML";


export const routes = [
  {
    name: "Dashboard",
    element: <Dashboard />,
    path: "/dashboard"
  },
  {
    name: "Products",
    element: <Products />,
    path: "/projects",
  },
  {
    name: "Categories",
    element: <Categories />,
    path: "/categories",
  },
  {
    name: "Register",
    element: <Register />,
    path: "/register",
  },
  {
    name: "Account",
    element: <Account />,
    path: "/account",
  },
  {
    name: "Users",
    element: <Users />,
    path: "/users",
  },
  {
    name: "Jobs",
    element: <Jobs />,
    path: "/jobs",
  },
  {
    name: "Reports",
    element: <Reports />,
    path: "/reports",
  },
  {
    name: "XML",
    element: <GenerateXML />,
    path: "/xml",
  },
  {
    name: "PDF",
    element: <GeneratePDF />,
    path: "/pdf",
  }
];

