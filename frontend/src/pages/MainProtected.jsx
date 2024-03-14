import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authTokenActions } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../axios/axiosInstance";

const Main = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.authToken.userId);
  const [userName, setUsername] = useState("");

  const axiosInstance = AxiosInstance({
    "Content-Type": "application/json",
  });

  const onLogout = async () => {
    await axiosInstance
      .get("/users/logout")
      .then((response) => {
        console.log(response);
        dispatch(authTokenActions.deleteToken());
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUserData = async () => {
    await axiosInstance
      .get("/users/getUser/" + userId)
      .then((response) => {
        console.log(response);
        setUsername(response.data.userEmail);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      <div>Protected Main</div>
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <button onClick={onLogout}>LogOut</button>
        <button onClick={getUserData}>Get User Data</button>
      </div>
      {userName !== "" && <div>{userName}</div>}
    </React.Fragment>
  );
};

export default Main;
