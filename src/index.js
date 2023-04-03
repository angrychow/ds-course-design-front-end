import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from 'react-redux';
import { Curriculum } from './pages/curriculum/curriculum';
import axios from 'axios';
import { NavigateActivity } from './pages/navigate/navigate';
import { myAxios } from './utils/fetch';
import { Login } from './pages/login/login';

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [{
      path: 'activity',
      element: <NavigateActivity />
    }, {
      path: 'curriculum',
      element: <Curriculum/>
    }]
  },
  {
    path: "login/",
    element: <Login></Login>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
  
);

myAxios.get('/ping').then((data) => {
  console.log(data);
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
