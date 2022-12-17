import React, { useState, useEffect } from 'react';
import './../App.css';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function Profile() {

  // const [userData, setuserData] = useState(undefined);
  const [userData, setuserData] = useState({
    firstName: '',
    lastName: '',
    bio: {
      description: '',
      funFact: '',
      other: ''
    },
    matches: [],
    rejects: [],
    prospectiveMatches: [],
    topArtists: [],
    topTracks: []
  });

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(undefined);
  const profileURL = "http://localhost:8888/users/";
  let { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(profileURL + id);
        setuserData(data);
        setLoading(false);
        console.log(data);
      } catch (e) {
        console.log(e);
        setErrorMsg(e.message);
      }
    }
    fetchData();
  }, []);

  const profileName = (
    <div>
      {userData.firstName} {userData.lastName}
    </div>
  );
  const bio = (
    <div>
      <div>
        Description: {userData.bio.description}
      </div>

      <div>
        Fun Fact: {userData.bio.funFact}
      </div>

      <div>
        Other: {userData.bio.other}
      </div>
    </div>
  );


  let connectSpotify = <a href="http://localhost:8888/spotify/login">Connect Your Spotify Account</a>;

  if (userData.topTracks.length > 0) {
    connectSpotify = <a href="http://localhost:8888/spotify/login">Update Your Spotify Data</a>;
  }

  const topArtists = (
    <div>
      <h1>Top Artists</h1>
      {userData.topArtists.map((artist, index) => {
        return (
          <div key={index}>{index + 1}. {artist}</div>
        );
      })}
    </div>
  );

  const topTracks = (
    <div>
      <h1>Top Tracks</h1>
      {userData.topTracks.map((track, index) => {
        return (
          <div key={index}>{index + 1}. {track}</div>
        );
      })}
    </div>
  );

  const picture = (
    <div>INSERT PICTURE HERE</div>
  )
  if (errorMsg) {
    return (
      <div>
        <h1>{errorMsg}</h1>
      </div>
    );
  }else{ 
    if (loading) {
      return (
        <div>
          <h2>Loading....</h2>
        </div>
      );
    } else {
      return (
        <div className="App-body">
          <h1>{errorMsg}</h1>
          <br />
          {picture}
          {profileName}
          {bio}
          {connectSpotify}
          {topArtists}
          {topTracks}
        </div>
      );
    }
  }
  

};

export default Profile;