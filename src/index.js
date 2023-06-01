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
import { Temporary } from './pages/temporary/temporary';
import { ActivityManage } from './pages/activity/activity';
import { CourseManage } from './pages/course/course';
import { PersonManage } from './pages/person/person';
import { Terminal } from './pages/log/log';
import { useUserData } from './utils/useUserData';
import { CurriculumWrap } from './pages/curriculum-wrap/curriculum-wrap';


const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [{
      path: 'navigate',
      element: <NavigateActivity />
    }, {
      path: 'curriculum',
      element: <CurriculumWrap />
    }, {
      path: 'temporary',
      element: <Temporary />
    }, {
      path: 'activity',
      element: <ActivityManage />
    }, {
      path: 'course',
      element: <CourseManage />
    }, {
      path: 'person',
      element: <PersonManage />
    }, {
      path: "log",
      element: <Terminal />
    }]
  },
  {
    path: "login/",
    element: <Login />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />

);

myAxios.get('/').then((data) => {
  console.log(data);
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
