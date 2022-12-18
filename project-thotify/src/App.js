// import logo from './logo.svg';
import "./App.css";
import React, { useEffect, useState } from "react";
// import SpotifyWebApi from "spotify-web-api-node";
import { AuthProvider } from "./contexts/AuthContext";
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
// const spotifyApi = new SpotifyWebApi();

//reference from https://www.youtube.com/watch?v=bhkg2godRDc
// const getTokenFromUrl = () => {
//   return window.location.hash
//     .substring(1)
//     .split("&")
//     .reduce((initial, item) => {
//       let parts = item.split("=");
//       initial[parts[0]] = decodeURIComponent(parts[1]);
//       return initial;
//     }, {});
// };

function App() {
  const [currentUserFromDB, setCurrentUserFromDB] = useState({});

  console.log(window.localStorage.getItem('currentUserFromDB'));

  useEffect(() => {
    const data = window.localStorage.getItem('currentUserFromDB');
    if (data !== {} )setCurrentUserFromDB(JSON.parse(data));
  }, []);

  useEffect(() => {
    window.localStorage.setItem('currentUserFromDB', JSON.stringify(currentUserFromDB))
  }, [currentUserFromDB]);


  // const [spotifyToken, setSpotifyToken] = useState("");
  // const [loggedInToSpotify, setLoggedInToSpotify] = useState(false);

  //reference from https://www.youtube.com/watch?v=bhkg2godRDc
  // useEffect(() => {
  //   const getTopArtists = async () => {
  //     spotifyApi.getMyTopArtists().then(
  //       function (data) {
  //         let topArtists = data.body.items;
  //         console.log("Top Artists: ", topArtists);
  //       },
  //       function (err) {
  //         console.log("Something went wrong!", err);
  //       }
  //     );
  //   };

  //   console.log("Here is what we got from url: ", getTokenFromUrl());
  //   const spotifyToken = getTokenFromUrl().access_token;
  //   window.location.hash = "";

  //   if (spotifyToken) {
  //     setSpotifyToken(spotifyToken);
  //     spotifyApi.setAccessToken(spotifyToken);
  //     console.log("calling top artists");
  //     // getTopArtists();
  //     console.log("done calling");
  //     console.log(`This is the spotify token: ${spotifyToken}`);
  //     spotifyApi.getMe().then((user) => {
  //       console.log("user", user);
  //     });
  //     spotifyApi.getMyTopArtists().then(
  //       (data) => {
  //         console.log("data", data);
  //       }
  //       // function (data) {
  //       //   // let topArtists = data.body.items;
  //       //   console.log("Top Artists: ", data);
  //       // },
  //       // function (err) {
  //       //   console.log("Something went wrong!", err);
  //       // }
  //     );
  //     setLoggedInToSpotify(true);
  //   }
  // });

  return (
    <Router>
      <AuthProvider>
        
          <header className="App-Header">
            <NavLink to="/"><h1 className="App-Title">Thotify</h1></NavLink>
            <nav>
              <ul className="Nav-Links">
                <li><a className="Nav-Link"><NavLink to="/">Home</NavLink></a></li>
                <li><a className="Nav-Link"><NavLink to={`/profile/${currentUserFromDB._id}`}>My Profile</NavLink></a></li>
                <li><a className="Nav-Link"><NavLink to="/my-matches">My Matches</NavLink></a></li>
                <li><a className="Nav-Link"><NavLink to="/message/">Message Test</NavLink></a></li>
                <li><a className="Nav-Link"><NavLink to="/login">Login</NavLink></a></li>
                <li><a className="Nav-Link"><NavLink to="/signup">Signup</NavLink></a></li>
              </ul>
            </nav>
            <a className="Nav-Link"><NavLink to="/test"><button>Test</button></NavLink></a>
        </header>
        
          <div className="App-body">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/home" element={<Home />} />
              <Route 
                path="/profile/:id" 
                element={
                  <ProtectedRoute>
                    <Profile currentUserFromDB={currentUserFromDB} setCurrentUserFromDB={setCurrentUserFromDB} />
                  </ProtectedRoute>
                }
              />
              <Route exact path="/my-matches/" element={<Matches />} />
              <Route path="/message/" element={<Message />} />
              <Route path="/login/" element={<Login currentUserFromDB={currentUserFromDB} setCurrentUserFromDB={setCurrentUserFromDB}/>} />
              <Route path="/signup/" element={<Signup />} />
              <Route 
                path="/test/" 
                element={
                  <ProtectedRoute>
                    <TestComponent />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>

        
      </AuthProvider>
    </Router>
  );
}

export default App;
