import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routeConfigs from './components/routing/config';
import PrivateRoute from './components/routing/PrivateRoute';
import { setCurrentUser, logOutUser } from "./redux/actions/authActions";
import jwt_decode from "jwt-decode";
import setAuthToken from './utils/setAuthToken';
import { useDispatch } from 'react-redux';

const App = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    console.log("token")
    if (localStorage.jwtToken) {

      // Set auth token header auth
      const token = localStorage.jwtToken;
      setAuthToken(token);
      // Decode token and get user info and exp
      const decoded = jwt_decode(token);
      console.log(decoded);
      // Set user and isAuthenticated
      dispatch(setCurrentUser(decoded));
      // Check for expired token
      const currentTime = Date.now() / 1000; // to get in milliseconds
      if (decoded.exp < currentTime) {
          dispatch(logOutUser());
          window.location.href = "/auth/login";
      }
    }
  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoute/>}>
            {
              routeConfigs.PrivateRoutes.map(({path, element}, key) => <Route path={path} element={element} key={key}/>)
            }
          </Route>
          {
            routeConfigs.NormalRoutes.map(({path, element}, key) => <Route path={path} element={element} key={key}/>)
          }
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
