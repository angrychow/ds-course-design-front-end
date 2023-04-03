import { Toast } from "@douyinfe/semi-ui";
import axios from "axios";

export const myAxios = axios.create({
  baseURL: "/api/",
  timeout: 1000,
})

myAxios.interceptors.request.use(
  (config) => {
    // config.data = JSON.stringify(config.data)
    config.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

myAxios.interceptors.response.use(
  (response) => {
    if (response.data) {
      return response.data
    } else {
      Toast.error("An Error Occur");
      return Promise.reject(response);
    }
  },
  (error) => {
    console.log(error);
    Toast.error("An Error Occur "+error);
    return Promise.reject(error);
  }
)
