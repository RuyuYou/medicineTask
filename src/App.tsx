import React from 'react';
import { HashRouter, useRoutes } from 'react-router-dom';
import HomePage from './homepage/homepage';
import Login from './login/login';


export interface RouteObject {
  element?: React.ReactNode;
  path?: string;

}

export const rootRouter: RouteObject[] = [
  {
    path: '/homepage',
    element: <HomePage to="/homepage"/>
  },
  {
    path: '/login',
    element: <Login to="login"/>
  },
  {
    path: '/',
    element: <Login to="login"/>
  }
];

const Router = () => {
  return useRoutes(rootRouter);
};

const App = () => {
  return (
    <HashRouter>
      <Router/>
    </HashRouter>
  );
};

export default App;
