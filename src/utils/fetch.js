import { Toast } from "@douyinfe/semi-ui";
import axios from "axios";
import { bus } from "../bus";

var interceptors;

export const myAxios = axios.create({
  baseURL: "/api",
  timeout: 5000,
})



myAxios.interceptors.request.use(
  function(config) {
    // config.data = JSON.stringify(config.data)
    config.headers = {
      "Content-Type": "application/json",
      "Authorization":"123",
    };
    return config;
  },
  function(error) {
    console.log("Error occurs when emitted request");
    return Promise.reject(error);
  }
)

interceptors = myAxios.interceptors.response.use(
  function (response) {
    if (response.data) {
      return response.data
    } else {
      Toast.error("An Error Occur");
      return Promise.reject(response);
    }
  },
  function(error) {
    console.log(error);
    Toast.error("An Error Occur "+error);
    return Promise.reject(error);
  }
)

export const setToken = () => {
  console.log('set');
  myAxios.interceptors.request.eject(interceptors);
  interceptors = myAxios.interceptors.request.use(
    function (config) {
       config.headers = {
      "Content-Type": "application/json",
    };
      console.log('called');
      // config.data = JSON.stringify(config.data)
      // config.headers = {
      //   "Content-Type": "application/json",
      //   "Authorization": "Bearer "+ bus.embedToken
      // };
      // config.headers.Authorization = 'Bearer ' + bus.embedToken;
      config.headers['Authorization'] = 'Bearer ' + bus.embedToken;
      // config.headers['User-Agent'] = '123123123';
      return config;
    },
    function(error) {
      console.log("Error occurs when emitted request");
      return Promise.reject(error);
    }
  )
}