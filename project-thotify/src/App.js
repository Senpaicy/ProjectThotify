// import logo from './logo.svg';
import "./App.css";
import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";
import {
  NavLink,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Matches from "./components/Matches";
import Message from "./components/Message";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TestComponent from "./components/TestComponent";
import ProtectedRoute from "./components/ProtectedRoute";
const spotifyApi = new SpotifyWebApi();

//reference from https://www.youtube.com/watch?v=bhkg2godRDc
const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
      let parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
};

function App() {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [loggedInToSpotify, setLoggedInToSpotify] = useState(false);

  //reference from https://www.youtube.com/watch?v=bhkg2godRDc
  useEffect(() => {
    const getTopArtists = async () => {
      spotifyApi.getMyTopArtists().then(
        function (data) {
          let topArtists = data.body.items;
          console.log("Top Artists: ", topArtists);
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
    };

    console.log("Here is what we got from url: ", getTokenFromUrl());
    const spotifyToken = getTokenFromUrl().access_token;
    window.location.hash = "";

    if (spotifyToken) {
      setSpotifyToken(spotifyToken);
      spotifyApi.setAccessToken(spotifyToken);
      console.log("calling top artists");
      // getTopArtists();
      console.log("done calling");
      console.log(`This is the spotify token: ${spotifyToken}`);
      spotifyApi.getMe().then((user) => {
        console.log("user", user);
      });
      spotifyApi.getMyTopArtists().then(
        (data) => {
          console.log("data", data);
        }
        // function (data) {
        //   // let topArtists = data.body.items;
        //   console.log("Top Artists: ", data);
        // },
        // function (err) {
        //   console.log("Something went wrong!", err);
        // }
      );
      setLoggedInToSpotify(true);
    }
  });

  return (
    <Router>
      <AuthProvider>
        <div>
          <header className="App-header">
            <h1 className="App-title">Thotify</h1>
            <nav>
              <NavLink className="navlink" to="/">
                Home
              </NavLink>
              |
              <NavLink className="navlink" to="/profile/0">
                {/*Need to change link above to logged in user's profile, or redirect to login*/}
                My Profile
              </NavLink>
              |
              <NavLink className="navlink" to="/my-matches">
                My Matches
              </NavLink>
              |
              <NavLink className="navlink" to="/message/">
                Message Test
              </NavLink>
              |
              <NavLink className="navlink" to="/login">
                {/*Need to change link above to logged in user's profile, or redirect to login*/}
                Login
              </NavLink>
              |
              <NavLink className="navlink" to="/signup">
                {/*Need to change link above to logged in user's profile, or redirect to login*/}
                Signup
              </NavLink>
              |
              <NavLink className="navlink" to="/test">
                {/*Need to change link above to logged in user's profile, or redirect to login*/}
                Test
              </NavLink>
            </nav>
          </header>
          <div className="App-body">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/home" element={<Home />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route exact path="/my-matches/" element={<Matches />} />
              <Route path="/message/" element={<Message />} />
              {/* login and signup both need error checking */}
              <Route path="/login/" element={<Login />} />
              <Route path="/signup/" element={<Signup />} />
              <Route
                path="/test/"
                element={
                  //use this to protect routes
                  <ProtectedRoute>
                    <TestComponent />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
