import { useState } from "react";
import axios from "axios";

export const useUser = ({ setAlert ,props}) => {
    const [componentType, setComponentType] = useState("create");
    const [callingBackend, setCallingBackend] = useState(false);

  // data
  const [initialValues, setInitialValues] = useState({
    title: "Mr",
    firstName: "",
    lastName: "",
    name:"",
    email: "",
    password: "",
    role: "moderator",
    permissions: [],
  });

  // get user
  const get = async (id) => {
    try {
      const data = await axios.get(`/user/${id}`);

      setInitialValues({
        title: data.data.local.title,
        firstName: data.data.local.firstName,
        lastName: data.data.local.lastName,
        name:data.data.local.name,
        email: data.data.local.email,
        password: "12345@#Aw",
        role: data.data.local.role,
        permissions: data.data.local.permissions,
      });
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Data loading failed!",
      });
    }
  };

  // create method
  const submit = async (e, { resetForm }) => {
    if (componentType === "create") {
      try {
        setCallingBackend(true);
        await axios.post("/user", {
          local: {
            title: e.title,
            firstName: e.firstName,
            lastName: e.lastName,
            name: e.name,
            email: e.email,
            password: e.password,
            status: true,
            role: e.role,
            permissions: e.permissions,
          },
        });
        resetForm();
        setAlert({
          showAlert: true,
          severity: "success",
          message: "User created successfully!",
        });
      } catch (error) {
        if (error.response.status === 403) {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "User already exists!",
          });
        } else {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "User creation failed!",
          });
        }
      } finally {
        setCallingBackend(false);
      }
    } else {
      try {
        setCallingBackend(true);
        delete e.password;
        await axios.put(`/user/${props.location.state.id}`, e);
        props.history.push("/user");
      } catch (error) {
        setAlert({
          showAlert: true,
          severity: "error",
          message: "User updating failed!",
        });
      } finally {
        setCallingBackend(false);
      }
    }
  };

  return {
    initialValues,
    setInitialValues,
    get,
    submit,
    componentType,
    setComponentType,
    callingBackend,
    setCallingBackend
  };
};
