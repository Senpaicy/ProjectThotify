import React, { useState, useEffect } from "react";
import "./../App.css";
import "../style/css/Profile.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";

function UserProfile() {
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
  const profileURL = "http://localhost:8888/users/";
  let { userId } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(profileURL + userId);
        setUserData(data);
        setLoading(false);
        // console.log(data);
      } catch (e) {
        console.log(e);
        setErrorMsg(e.message);
      }
    }
    fetchData();
  }, [userId]);

  const Bio = () => {
    return (
      <div className="Bio">
        <div className="Bio-Divider">
          <h2>Description:</h2>
          <div>{userData.bio.description}</div>
        </div>
        <div className="Bio-Divider">
          <h2>Fun Fact:</h2>
          <div>{userData.bio.funFact}</div>
        </div>
        <div className="Bio-Divider">
          <h2>Other:</h2>
          <div>{userData.bio.other}</div>
        </div>
      </div>
    );
  };

  const Picture = () => {
    return (
      <img
        className="ProfilePic"
        src={userData.pfp_url}
        alt="Profile Picture"
      ></img>
    );
  };

  const TopTracks = () => {
    return (
      <div className="TopList">
        {userData.topTracks.map((track, index) => {
          return (
            <div key={index}>
              <h3>
                {index + 1}. {track}
              </h3>
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
              <h3>
                {" "}
                {index + 1}. {artist}{" "}
              </h3>
              <img
                className="ArtistPic"
                src={userData.topArtistImgs[index]}
                alt="Artist Picture"
              ></img>
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
            <div className="name">{userData.firstName}'s Profile</div>
            {userData.spotifyUsername !== "" && (
              <div className="SpotifyUsername">
                <a
                  href={`https://open.spotify.com/user/${userData.spotifyUsername}`}
                  target="_blank"
                >
                  @{userData.spotifyUsername}
                </a>
              </div>
            )}
            <div>
              <div className="row1">
                <Picture />
                <Bio />
              </div>
              <div className="row2">
                {userData.topTracks.length > 0 && (
                  <div>
                    <h2>Top Tracks</h2>
                    <TopTracks />
                  </div>
                )}
                {userData.topArtists.length > 0 && (
                  <div>
                    <h2>Top Artists</h2>
                    <div className="DivWithScroll">
                      <TopArtists />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default UserProfile;
