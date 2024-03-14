import React, { useState } from "react";
import AxiosInstance from "../axios/axiosInstance";
import { useDispatch } from "react-redux";
import { authTokenActions } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosInstance = AxiosInstance({
    "Content-Type": "application/json",
  });

  const onInputChangeHandle = (event) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
    if (name === "email") {
      errors.email = "";
    }
    if (name === "password") {
      errors.password = "";
    }
  };

  const onLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(loginData);
    if (Object.keys(validationErrors).length === 0) {
      console.log(loginData);
      await axiosInstance
        .post("/users/signIn", loginData)
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
    const errors = {};
    if (!data.password) {
      errors.password = "Password is required";
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
      <form style={{padding:"16px", display:"flex", flexDirection: "column"}}>
        <div>
          <h1>Welcome!</h1>
        </div>

        <label >
          <input
            
            name="email"
            type="text"
            placeholder="Email Address"
            onChange={onInputChangeHandle}
          />
          {errors.email && <div >{errors.email}</div>}
        </label>
        <label >
          <input
            
            name="password"
            type="password"
            placeholder="Password"
            onChange={onInputChangeHandle}
            required
          />
          {errors.password && (
            <div className={styles.error}>{errors.password}</div>
          )}
        </label>
        

        <div style={{padding: "16px"}}>
            
          <button
            
            
            onClick={onLogin}
            color="#faaf90"
          >Sign in</button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default Login;