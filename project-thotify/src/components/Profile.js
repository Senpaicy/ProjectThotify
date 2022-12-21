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
  const [profilePic, setProfilePic] = useState(currentUserFromDB.pfp_url);
  const [description, setDescription] = useState(currentUserFromDB.bio.description);
  const [funFact, setFunFact] = useState(currentUserFromDB.bio.funFact);
  const [other, setOther] = useState(currentUserFromDB.bio.other);
  const {logout} = useAuth();
  let navigate = useNavigate();
  //reference from https://www.youtube.com/watch?v=bhkg2godRDc

  const [pfpImage, setPfpImage] = useState(null);

  function onImageChage(e){
    console.log("LOG: ",e.target.files);
    setPfpImage(e.target.files[0]);
  }

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
              let topArtistImgs = topArtists.map((artist) => {
                return artist.images[0].url;
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
                });
                  console.log("top track names:", topTrackNames);
                  console.log("CurrentUSerFromDB: ", currentUserFromDB);
                  let userUpdateInfo = {
                    firstName: currentUserFromDB.firstName,
                    lastName: currentUserFromDB.lastName,
                    bio: currentUserFromDB.bio,
                    email: currentUserFromDB.email,
                    spotifyUsername: userName,
                    pfp_url: currentUserFromDB.pfp_url,
                    matches: currentUserFromDB.matches,
                    rejects: currentUserFromDB.rejects,
                    prospectiveMatches: currentUserFromDB.prospectiveMatches,
                    topArtists: topArtistNames,
                    topArtistImgs: topArtistImgs,
                    topTracks: topTrackNames,
                  };
                  console.log("userUpdateInfo", userUpdateInfo);
                  const artistData = await axios.post(
                    "http://54.186.68.123/users/update-user/" + currentUserFromDB._id,
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
    // firstName: "",
    // lastName: "",
    // bio: {
    //   description: "",
    //   funFact: "",
    //   other: "",
    // },
    // matches: [],
    // rejects: [],
    // prospectiveMatches: [],
    // topArtists: [],
    // topArtistImgs: [],
    // topTracks: [],
  });

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(undefined);
  const profileURL = "http://54.186.68.123/users/";
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
    await e.preventDefault();

    // pfpImageURL
    // try{
      console.log("sending images to server");
      const data = new FormData();
      data.append("name", pfpImage.name);
      data.append('id', currentUserFromDB._id);
      data.append('account_type', 'user')
      data.append('pfp', pfpImage, {type: "file"});
      
      console.log("log data: ", data.entries())
      const pfpImageURL = await axios.post(
        "http://54.186.68.123/images/ingest-image/",
        data,
      );
      // setProfilePic(pfpImageURL);
    // }catch(e){
    //   console.error("Unable to send new pfp to server: ", e);
    // }

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
        pfp_url: pfpImageURL,
        spotifyUsername: currentUserFromDB.spotifyUsername,
        matches: currentUserFromDB.matches,
        rejects: currentUserFromDB.rejects,
        prospectiveMatches: currentUserFromDB.prospectiveMatches,
        topArtists: currentUserFromDB.topArtists,
        topArtistImgs: currentUserFromDB.topArtistImgs,
        topTracks: currentUserFromDB.topTracks,
      };
      console.log("userUpdateInfo", userUpdateInfo);
      const updatedUser = await axios.post(
        "http://54.186.68.123/users/update-user/" + currentUserFromDB._id,
        { updatedUser: userUpdateInfo }
      );
      console.log("updated user", updatedUser);
      setCurrentUserFromDB(updatedUser.data);
      window.scrollTo(0, 0);
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
          <h2>Description:</h2>
          <div>
            {userData.bio.description}
          </div>
        </div>
        <div className="Bio-Divider">
          <h2>Fun Fact:</h2>
          <div> 
            {userData.bio.funFact}
          </div>
        </div>
        <div className="Bio-Divider">
          <h2>Other:</h2>
          <div>
            {userData.bio.other}
          </div>
        </div>
      </div>
    );
  };

  const ConnectToSpotifyButton = () => {
    return (
      <a href="http://54.186.68.123/spotify/login">
        <div className="PButton">
          <p >
            {userData.spotifyUsername ? "Refresh Spotify Info" : "Connect to Spotify" }
          </p>
        </div>
        
      </a>
    );
  };

  const Picture = () => {
    return (
        <img className="ProfilePic" src={userData.pfp_url} alt="Profile Picture"></img>
    );
  };

  const TopTracks = () => {
    return (
      <div className="TopList">
          {userData.topTracks.map((track, index) => {
            return (
              <div key={index}>
                <h3>{index + 1}. {track}</h3>
              </div>
            );
          })}
      </div>
    );
  };

  console.log("USER DATA", userData);
  
  console.log("USER DATA.ARTIST IMGS", userData.topArtistImgs);

  const TopArtists = () => {
    return (
      <div className="TopList">
          {userData.topArtists.map((artist, index) => {
            return (
              <div className="" key={index}>
                <h3> {index + 1}. {artist} </h3>
                <img className="ArtistPic" src={userData.topArtistImgs[index]} alt="Artist Picture"></img>
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
          <div className="MakingWidth">
            <div className="name">
              Hello, {" "}{userData.firstName} {userData.lastName}{" "}
            </div>
            {userData.spotifyUsername !== "" &&
            <div className="SpotifyUsername">
              <a href={`https://open.spotify.com/user/${userData.spotifyUsername}`} target="_blank">@{userData.spotifyUsername}</a>
            </div>
            }
            <div>
              <div className="row1">
                <Picture />
                <Bio />
              </div>
              <div className="row2">
                {userData.topTracks.length > 0 &&
                <div>
                  <h2>Top Tracks</h2>
                  <TopTracks />
                </div>
                }
                {userData.topArtists.length > 0 &&
                <div>
                  <h2>Top Artists</h2>
                  <div className="DivWithScroll">
                    <TopArtists />
                  </div>
                </div>
                }
                
                
              </div>
            </div>
            <div className="Button-Div">
              <ConnectToSpotifyButton />

              <button className="PButton" type="button" onClick={openModal}>
                Edit Bio
              </button>

              <button className="PButton" type="button" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          </div>

          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            appElement={document.getElementById('profile')}
          >
            <div className="Center-Container">
              <div className="Center">           
                <h1 className="Modal-Header">Editing Profile</h1>
                <form>
                <div className="Modal-TextBox">
                    <input type="file" accept="image/*" name="pfp_url" onChange={onImageChage} />

                    {/* <input
                      type="text"
                      name="pfp_url"
                      id="pfp_url"
                      defaultValue={userData.pfp_url}
                      onChange={(e) => {
                        setProfilePic(e.target.value);
                      }}
                    /> */}
                    <label htmlFor="pfp_url">Profile Pic Url</label>
                  </div>
                  <div className="Modal-TextBox">
                    <input
                      type="text"
                      name="description"
                      id="description"
                      defaultValue={userData.bio.description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
                    <label htmlFor="description">Description</label>
                  </div>
                  <div className="Modal-TextBox">
                    <input
                      type="text"
                      name="funFact"
                      id="funFact"
                      defaultValue={userData.bio.funFact}
                      onChange={(e) => {
                        setFunFact(e.target.value);
                      }}
                    />
                    <label htmlFor="funFact">Fun Fact</label>
                  </div>
                  <div className="Modal-TextBox">
                    <input
                      type="text"
                      name="other"
                      id="other"
                      defaultValue={userData.bio.other}
                      onChange={(e) => {
                        setOther(e.target.value);
                      }}
                    />
                    <label htmlFor="other">Other</label>
                  </div>
              </form>
              <button onClick={handleProfileUpdate}>
                Save & Close
              </button>
            </div>
            {modalError && <p className="ErrorMessage">{`${modalError}`}</p>}
            </div>
          </Modal>
        </div>
      );
    }
  }
}

export default Profile;
