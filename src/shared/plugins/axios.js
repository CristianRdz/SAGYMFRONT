import instance from "axios";
import { API_URL } from "../utils/constants";
//apiurl+/api con template string
const AxiosClient = instance.create({
   baseURL: `${API_URL}/api`,
});

const requestHandler = (request) => {
  request.headers["Accept"] = "application/json";
  request.headers["Content-type"] = "application/json";
  const token = localStorage.getItem("token");
  const session = JSON.parse(localStorage.getItem("user") || null);
  if (session?.isLogged)
    request.headers["Authorization"] = `Bearer ${session.token}`;
  return request;
};

const errorResponseHandler = (error) => {
  return Promise.reject(error);
};
const successResponseHandler = (response) => Promise.resolve(response.data);

AxiosClient.interceptors.request.use(
  (request) => requestHandler(request),
  (error) => Promise.reject(error)
);

AxiosClient.interceptors.response.use(
  (response) => successResponseHandler(response),
  (error) => errorResponseHandler(error)
);
export default AxiosClient;
