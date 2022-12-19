import React, { useState, useEffect } from "react";
import "./../App.css";
import "../style/css/Profile.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";
import { useAuth } from "../contexts/AuthContext";
import Modal from 'react-modal';

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
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalError, setModalError] = useState();
  const [description, setDescription] = useState(currentUserFromDB.bio.description);
  const [funFact, setFunFact] = useState(currentUserFromDB.bio.funFact);
  const [other, setOther] = useState(currentUserFromDB.bio.other);
  const {logout} = useAuth();
  let navigate = useNavigate();
  //reference from https://www.youtube.com/watch?v=bhkg2godRDc
  useEffect(() => {
    
    const getTopArtists = async () => {
      let userName;
      let topArtistNames;
      let topTrackNames;

      spotifyApi.getMe().then(
        async function (data) {
          let userName = data.body.id;
          console.log("Username: ", userName);
          spotifyApi.getMyTopArtists().then(
            async function (data) {
              let topArtists = data.body.items;
              console.log("Top Artists: ", topArtists);
              topArtistNames = topArtists.map((artist) => {
                return artist.name;
              });
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
                  }
                  );
                  console.log("top track names:", topTrackNames);
                  console.log("CurrentUSerFromDB: ", currentUserFromDB);
                  let userUpdateInfo = {
                    firstName: currentUserFromDB.firstName,
                    lastName: currentUserFromDB.lastName,
                    bio: currentUserFromDB.bio,
                    email: currentUserFromDB.email,
                    spotifyUsername: userName,
                    matches: currentUserFromDB.matches,
                    rejects: currentUserFromDB.rejects,
                    prospectiveMatches: currentUserFromDB.prospectiveMatches,
                    topArtists: topArtistNames,
                    topTracks: topTrackNames,
                  };
                  console.log("userUpdateInfo", userUpdateInfo);
                  const artistData = await axios.post(
                    "http://localhost:8888/users/update-user/" + currentUserFromDB._id,
                    { updatedUser: userUpdateInfo }
                  );
                  setCurrentUserFromDB(artistData.data);
                }, async function (err) {
                  console.log("Something went wrong!", err);
                  }
                );
            }, async function (err) {
              console.log("Something went wrong!", err);
              }
            );
        }, async function (err) {
          console.log("Something went wrong!", err);
          }
      );
    }

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
        console.log("Description", description);
        console.log("FunFact", funFact);
        console.log("Other", other);
        setLoading(false);
        // console.log(data);
      } catch (e) {
        console.log(e);
        setErrorMsg(e.message);
      }
    }
    fetchData();
  }, [currentUserFromDB]);


  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await logout();
      setCurrentUserFromDB();
      navigate("/");
    } catch (e){
      console.log(e);
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      let userUpdateInfo = {
        firstName: currentUserFromDB.firstName,
        lastName: currentUserFromDB.lastName,
        bio: {
          description: description,
          funFact: funFact,
          other: other,
        },
        email: currentUserFromDB.email,
        spotifyUsername: currentUserFromDB.spotifyUsername,
        matches: currentUserFromDB.matches,
        rejects: currentUserFromDB.rejects,
        prospectiveMatches: currentUserFromDB.prospectiveMatches,
        topArtists: currentUserFromDB.topArtists,
        topTracks: currentUserFromDB.topTracks,
      };
      console.log("userUpdateInfo", userUpdateInfo);
      const updatedUser = await axios.post(
        "http://localhost:8888/users/update-user/" + currentUserFromDB._id,
        { updatedUser: userUpdateInfo }
      );
      console.log("updated user", updatedUser);
      setCurrentUserFromDB(updatedUser.data);
      setIsOpen(false);
    } catch(error) {
      console.log(error);
      setModalError(error.response.data.error);
    }
  }


  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    console.log("fired after open");
  }

  function closeModal() {
    handleProfileUpdate();
    setIsOpen(false);
  }


  const Bio = () => {
    return (
      <div className="Bio">
        
        <div className="Bio-Divider">
          <h3>Description:</h3>
          <div>
            {userData.bio.description}
          </div>
        </div>
        <div className="Bio-Divider">
          <h3>Fun Fact:</h3>
          <div> 
            {userData.bio.funFact}
          </div>
        </div>
        <div className="Bio-Divider">
          <h3>Other:</h3>
          <div>
            {userData.bio.other}
          </div>
        </div>
        <div className="Bio-Divider-B">
          <button className="Bio-Edit-Button" onClick={openModal}>Edit</button>
        </div>
        
      </div>
    );
  };

  const ConnectToSpotifyButton = () => {
    return (
      <a href="http://localhost:8888/spotify/login">
        <button type="button">
          {userData.topTracks.length > 0 ? "Refresh Your Spotify Info" : "Connect Your Spotify Account" }
        </button>
      </a>
    );
  };

  const Picture = () => {
    return (
        <img className="ProfilePic" src="/images/profile/blank_pfp.png" alt="Profile Picture"></img>
    );
  };

  const TopTracks = () => {
    return (
      <div className="TopList">
        <h3>Top Tracks</h3>
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

  const TopArtists = () => {
    return (
      <div className="TopList">
        <h3>Top Artists</h3>
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
        <div id="profile" className="container">
          <div className="name">
            Hello, {" "}{userData.firstName} {userData.lastName}{" "}
          </div>
          <div>
            <div className="row1">
              <Picture />
              <Bio />
            </div>
            <div className="row2">
              <TopTracks />
              <TopArtists />
            </div>
          </div>
          <div>
            <ConnectToSpotifyButton />
            <button type="button" onClick={handleSignOut}>Sign Out</button>
          </div>

          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            // style={customStyles}
            contentLabel="Example Modal"
            appElement={document.getElementById('profile')}
          >
            <div className="Modal-TextBox">
              
            
            <h2 className="Modal-Header">Hello</h2>
            <div>I am a modal</div>
            <form>
            <div className="Modal-TextBox">
            <input
              type="text"
              name="description"
              defaultValue={userData.bio.description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <label>Description</label>
          </div>
          <div className="Modal-TextBox">
            <input
              type="text"
              name="funFact"
              defaultValue={userData.bio.funFact}
              onChange={(e) => {
                setFunFact(e.target.value);
              }}
            />
            <label>Fun Fact</label>
          </div>
          <div className="Modal-TextBox">
            <input
              type="text"
              name="other"
              defaultValue={userData.bio.other}
              onChange={(e) => {
                setOther(e.target.value);
              }}
            />
            <label>Other</label>
          </div>
              
            </form>
            <button onClick={handleProfileUpdate}>Save & Close</button>
            {modalError && <p>{`${modalError}`}</p>}
            </div>
          </Modal>

        </div>
      );
    }
  }
}

export default Profile;
