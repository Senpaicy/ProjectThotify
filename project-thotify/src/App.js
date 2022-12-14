import "./App.css";
import React, { useEffect, useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import {
  NavLink,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

// ---- Importing Components
import Home from "./components/Home";
import Profile from "./components/Profile";
import Matches from "./components/Matches";
import Message from "./components/Message";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TestComponent from "./components/TestComponent";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./components/LandingPage";
import ErrorPage from "./components/ErrorPage";
import UserProfile from "./components/UserProfile";
function App() {
  const [currentUserFromDB, setCurrentUserFromDB] = useState();

  // console.log(
  //   "LOCAL STORAGE:",
  //   window.localStorage.getItem("currentUserFromDB")
  // );

  useEffect(() => {
    const data = window.localStorage.getItem("currentUserFromDB");
    if (data !== "undefined") setCurrentUserFromDB(JSON.parse(data));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "currentUserFromDB",
      JSON.stringify(currentUserFromDB)
    );
  }, [currentUserFromDB]);

  return (
    <Router>
      <AuthProvider>
        <header className="App-Header">
          <NavLink to="/">
            <h1 className="App-Title">Thotify</h1>
          </NavLink>
          <div className="Row">
            {currentUserFromDB && (
              <NavLink to={`/`}>
                <p className="SignUpButton">HOME</p>
              </NavLink>
            )}
            {currentUserFromDB && (
              <NavLink to={`/my-profile/`}>
                <p className="SignUpButton">MY PROFILE</p>
              </NavLink>
            )}
            {currentUserFromDB && (
              <NavLink to="/my-matches">
                <p className="SignUpButton">MY MATCHES</p>
              </NavLink>
            )}
            {!currentUserFromDB && (
              <NavLink to="/login">
                <p className="SignUpButton">LOGIN</p>
              </NavLink>
            )}
            {!currentUserFromDB && (
              <NavLink to="/signup">
                <p className="SignUpButton">SIGN UP</p>
              </NavLink>
            )}
          </div>
        </header>

        <div className="App-body">
          <Routes>
            {currentUserFromDB ? (
              <Route
                exact
                path="/"
                element={
                  <ProtectedRoute>
                    <Home
                      currentUserFromDB={currentUserFromDB}
                      setCurrentUserFromDB={setCurrentUserFromDB}
                    />
                  </ProtectedRoute>
                }
              />
            ) : (
              <Route exact path="/" element={<LandingPage />} />
            )}
            {/* <Route exact path="/home" element={<ProtectedRoute><Home currentUserFromDB={currentUserFromDB} setCurrentUserFromDB={setCurrentUserFromDB} /></ProtectedRoute>} /> */}
            <Route
              path="/my-profile/"
              element={
                <ProtectedRoute>
                  <Profile
                    currentUserFromDB={currentUserFromDB}
                    setCurrentUserFromDB={setCurrentUserFromDB}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-profile/:userId"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/my-matches/"
              element={
                <ProtectedRoute>
                  <Matches
                    currentUserFromDB={currentUserFromDB}
                    setCurrentUserFromDB={setCurrentUserFromDB}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/message/:chatroom"
              element={
                <ProtectedRoute>
                  <Message
                    currentUserFromDB={currentUserFromDB}
                    setCurrentUserFromDB={setCurrentUserFromDB}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login/"
              element={
                <Login
                  currentUserFromDB={currentUserFromDB}
                  setCurrentUserFromDB={setCurrentUserFromDB}
                />
              }
            />
            <Route path="/signup/" element={<Signup />} />
            <Route
              path="/test/"
              element={
                <ProtectedRoute>
                  <TestComponent />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
