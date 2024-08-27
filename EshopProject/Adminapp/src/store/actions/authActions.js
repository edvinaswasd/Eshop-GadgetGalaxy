import { LOGIN, LOGOUT, TOGGLE, REGISTER } from "./types";
import axios from "axios";
import { routes } from "../../routes";
import jwt from "jsonwebtoken";
export const login = (token) => (dispatch) => {
  try {

    let { firstName, userType, id } = jwt.decode(token);

    // save to the session storage
    localStorage.setItem("token", token);
    localStorage.setItem("name", firstName);
    localStorage.setItem("role", userType);
    localStorage.setItem("id", id);
    axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.getItem(
      "token"
    ))}`;

    dispatch({
      type: LOGIN,
      payload: { token, firstName, userType, id },
    });
  } catch (error) { }
};

export const register = (name, role, token, permissions, id) => (dispatch) => {
  try {
    let permittedRoutes;
    if (role === "super") {
      // eslint-disable-next-line
      permittedRoutes = routes.filter((route) => {
        const children = route.children;

        const intersection = children.filter((element) => !element.isHidden);
        if (intersection.length) {
          route.children = intersection;
          return route;
        }
      });
    } else {
      // eslint-disable-next-line
      permittedRoutes = routes.filter((route) => {
        const children = route.children;

        const intersection = children.filter(
          (element) => permissions.includes(element.path) && !element.isHidden
        );
        if (intersection.length) {
          route.children = intersection;
          return route;
        }
      });
    }

    // save to the session storage
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    localStorage.setItem("role", role);
    localStorage.setItem("routes", JSON.stringify(permittedRoutes));
    localStorage.setItem("id", id);

    axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
      "token"
    )}`;

    dispatch({
      type: REGISTER,
      payload: { token, name, role, routes: permittedRoutes, id },
    });
  } catch (error) { }
};


export const logout = () => (dispatch) => {
  // remove items from session storage
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  localStorage.removeItem("role");
  localStorage.removeItem("routes");
  localStorage.removeItem("id");

  axios.defaults.headers.common.Authorization = null;

  dispatch({
    type: LOGOUT,
  });
};

export const toggleDrawer = () => (dispatch) => {
  dispatch({
    type: TOGGLE,
  });
};

//reset password

export const resetPass = () => (dispatch) => {
  dispatch({});
};
