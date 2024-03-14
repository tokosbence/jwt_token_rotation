import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { authTokenActions } from "../store/authSlice";

const backendURI = "http://localhost:5000";

const AxiosInstance = ({ headers }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.authToken.token);

  const instance = axios.create({
    baseURL: backendURI,
    headers: {
      headers,
      authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (
        error.response.status === 403 &&
        error.response.data.error === "Forbidden: JWT token expired!"
      ) {
        if (accessToken) {
          try {
            const response = await axios.get(`${backendURI}/users/refresh`, {
              withCredentials: true,
            });

            const newAccessToken = response.data;
            // Update the access token in local storage
            dispatch(authTokenActions.addToken(newAccessToken));

            // Retry the original request with the new access token
            error.config.headers.authorization = `Bearer ${newAccessToken}`;

            return axios.request(error.config);
          } catch (refreshError) {
            // If refresh token is expired or invalid, redirect to the login page
            navigate("/login");
            return Promise.reject(refreshError);
          }
        } else {
          // If no refresh token is found, redirect to the login page
          navigate("/login");
        }
      } else {
        return Promise.reject(error);
      }
    }
  );

  return instance;
};

export default AxiosInstance;