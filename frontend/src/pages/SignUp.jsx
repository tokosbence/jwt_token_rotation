import React, { useState } from "react";

import AxiosInstance from "../axios/axiosInstance";
import { useDispatch } from "react-redux";
import { authTokenActions } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    //name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosInstance = AxiosInstance({
    "Content-Type": "application/json",
  });

  const onInputChangeHandle = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    /*if (name === "name") {
      errors.name = "";
    }*/
    if (name === "email") {
      errors.email = "";
    }
    if (name === "password") {
      errors.password = "";
    }
    if (name === "confirmPassword") {
      errors.passwordConfirm = "";
    }
  };

  const onAuth = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      console.log(formData);
      await axiosInstance
        .post("/users/signUp", formData)
        .then((response) => {
          if (response.data.accessToken) {
            dispatch(authTokenActions.addToken(response.data.accessToken));
            navigate("/");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = (data) => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).+/;
    const errors = {};
    
    if (!data.password && !data.confirmPassword) {
      errors.password = "Password is required";
    } else {
      if (data.password.trim().length < 8) {
        errors.password = "Password is too short";
      }
      if (!passwordPattern.test(data.password)) {
        errors.password = "Password not contains number or uppercase";
      }
      if (data.password !== data.confirmPassword) {
        errors.password = "The passwords are not equal";
      }
    }
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(data.email)) {
      errors.email = "Invalid email format";
    }
    return errors;
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Test the email against the pattern
    return emailPattern.test(email);
  };

  return (
    <React.Fragment>
      <form style={{padding: "16px", display: "flex", flexDirection:"column"}}>
        <div >
          <h1>Create your account!</h1>
        </div>

       

        <label >
          <input
            
            type="text"
            placeholder="Email"
            name="email"
            onChange={onInputChangeHandle}
          />
          {errors.email && <div >{errors.email}</div>}
        </label>

        <label >
          <input
            
            type="password"
            placeholder="Password"
            name="password"
            onChange={onInputChangeHandle}
          />
          {errors.password && (
            <div >{errors.password}</div>
          )}
        </label>

        <label >
          <input
            
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            onChange={onInputChangeHandle}
          />
        </label>

        <div style={{padding: "16px"}}>
            
          <button
            
            title="Sign Up"
            onClick={onAuth}
            color="#faaf90"
          >Sign Up </button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default SignUp;