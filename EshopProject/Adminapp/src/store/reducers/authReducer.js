import { LOGIN, LOGOUT, TOGGLE } from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
  name: localStorage.getItem("name"),
  id: localStorage.getItem("id"),
  routes: JSON.parse(localStorage.getItem("routes")),
  isDrawerOpen: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, ...action.payload };

    case LOGOUT:
      return initialState;

    case TOGGLE:
      return { ...state, isDrawerOpen: !state.isDrawerOpen };

    default:
      return state;
  }
}
