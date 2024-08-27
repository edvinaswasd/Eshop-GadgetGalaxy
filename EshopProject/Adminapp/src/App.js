import React, { Suspense } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ThemeProvider, unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core/styles";
import "../src/index.css";
import Dashboard from "./components/Dashboard/dashboard";
import Login from "../src/components/layouts/Login";
import NotFound from "../src/components/layouts/PageNotFound";
import PermissionDenied from "../src/components/layouts/PermissionDenied";
import "../src/index.css";
// Redux
import { Provider as ReduxProvider } from "react-redux";
import store from "./store/store";
import Loader from "./components/layouts/loader/Loader";
// protected route
import ProtectedRoute from "../src/components/common/ProtectedRoute";
import { routes } from "../src/routes";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const lightTheme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#0066B2",
    },
    secondary: {
      main: "#808080",
    },
  },
  overrides: {
    MuiFormLabel: {
      asterisk: {
        color: "#FFFFFF",
        "&$error": {
          color: "#FFFFFF",
        },
      },
    },
  },
});

function App() {
  const id = localStorage.getItem('id')

  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={lightTheme}>
        <ThemeProvider theme={darkTheme} />
        <Suspense
          fallback={
            <div>
              <Loader />
            </div>
          }
        >
          <BrowserRouter>
            <Routes>
              {<Route path={`/dashboard`} element={<Dashboard />} />}
              <Route path="/" element={<Login />} />
              <Route
                path="/permission-denied"
                exact
                element={<PermissionDenied />}
              />
              <Route path="*" component={<NotFound />} />
              {routes.map(({ element, path, name }) => (
                <Route
                  key={name}
                  path={path}
                  element={<ProtectedRoute element={element} />}
                />
              ))}
            </Routes>
          </BrowserRouter>
        </Suspense>
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default App;
