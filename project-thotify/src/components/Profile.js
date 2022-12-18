import React, { useState, useEffect } from "react";
import "./../App.css";
import "../style/css/Profile.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";
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

function Profile({ currentUserFromDB, setCurrentUserFromDB }) {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [loggedInToSpotify, setLoggedInToSpotify] = useState(false);

  //reference from https://www.youtube.com/watch?v=bhkg2godRDc
  useEffect(() => {
    
    const getTopArtists = async () => {
      
      let topTrackNames;
      spotifyApi.getMyTopTracks().then(
      async function (data) {
        let topTracks = data.body.items;
        console.log("top tracks:", topTracks);
        topTrackNames = topTracks.map((track) => {
          if (track.artists[0]){
            return track.name + " by " + track.artists[0].name;
          }else{
            return track.name;
          }
        });
        console.log("top track names:", topTrackNames);
      }
      );
      spotifyApi.getMyTopArtists().then(
        async function (data) {
          let topArtists = data.body.items;
          console.log("Top Artists: ", topArtists);
          let topArtistNames = topArtists.map((artist) => {
            return artist.name;
          });
          console.log("CurrentUSerFromDB: ", currentUserFromDB);
          let userUpdateInfo = {
            firstName: currentUserFromDB.firstName,
            lastName: currentUserFromDB.lastName,
            bio: currentUserFromDB.bio,
            email: currentUserFromDB.email,
            spotifyUsername: "hardcodedusername",
            matches: currentUserFromDB.matches,
            rejects: currentUserFromDB.rejects,
            prospectiveMatches: currentUserFromDB.prospectiveMatches,
            topArtists: topArtistNames,
            topTracks: topTrackNames,
          };
          const artistData = await axios.post(
            "http://localhost:8888/users/update-user/" + currentUserFromDB._id,
            { updatedUser: userUpdateInfo }
          );
        },
        async function (err) {
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
      getTopArtists();
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

  // const [userData, setUserData] = useState(undefined);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    bio: {
      description: "",
      funFact: "",
      other: "",
    },
    matches: [],
    rejects: [],
    prospectiveMatches: [],
    topArtists: [],
    topTracks: [],
  });

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(undefined);
  const profileURL = "http://localhost:8888/users/";
  let { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        // const { data } = await axios.get(profileURL + id);
        setUserData(currentUserFromDB);
        setLoading(false);
        // console.log(data);
      } catch (e) {
        console.log(e);
        setErrorMsg(e.message);
      }
    }
    fetchData();
  }, []);

  const Bio = () => {
    return (
      <div>
        <h2>Description:</h2>
        <div> {userData.bio.description}</div>

        <h2>Fun Fact:</h2>
        <div> {userData.bio.funFact}</div>

        <h2>Other:</h2>
        <div>Other: {userData.bio.other}</div>
      </div>
    );
  };

  let connectSpotify = (
    <button>
      {" "}
      <a href="http://localhost:8888/spotify/login">
        Connect Your Spotify Account
      </a>
    </button>
  );

  const ConnectToSpotifyButton = () => {
    return (
      <button>
        {" "}
        <a href="http://localhost:8888/spotify/login">
          Connect Your Spotify Account
        </a>
      </button>
    );
  };

  if (userData.topTracks.length > 0) {
    connectSpotify = (
      <a href="http://localhost:8888/spotify/login">Update Your Spotify Data</a>
    );
  }

  const TopArtists = () => {
    return (
      <div>
        <h1>Top Artists</h1>
        {userData.topArtists.map((artist, index) => {
          return (
            <div key={index}>
              {index + 1}. {artist}
            </div>
          );
        })}
      </div>
    );
  };

  const TopTracks = () => {
    return (
      <div>
        <h1> Top Tracks </h1>
        {userData.topTracks.map((track, index) => {
          return (
            <div key={index}>
              {index + 1}. {track}
            </div>
          );
        })}
      </div>
    );
  };

  const Picture = () => {
    return <div name="pfp"> picture here </div>;
  };

  if (errorMsg) {
    return (
      <div>
        <h1>{errorMsg}</h1>
      </div>
    );
  } else {
    if (loading) {
      return (
        <div>
          <h2>Loading....</h2>
        </div>
      );
    } else {
      return (
        <div className="container">
          <div className="row1">
            <Picture />
            <div className="name">
              {" "}
              {userData.firstName} {userData.lastName}{" "}
            </div>
          </div>
          <Bio />
          <TopTracks />
          <TopArtists />
          <ConnectToSpotifyButton />
        </div>
      );
    }
  }
}

export default Profile;
