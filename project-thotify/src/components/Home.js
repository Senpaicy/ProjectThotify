import React, { useState, useEffect } from 'react';

// --- Importing Stylesheets
import './../App.css';
import "../style/css/Forms.css";
import "../style/css/Home.css";

import { Link } from 'react-router-dom';
import axios from 'axios';

function Home({currentUserFromDB, setCurrentUserFromDB}) {
  const [matchData, setMatchData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(undefined);
  const usersURL = "http://localhost:8888/users/";

  const matchingAlgorithm = (personA, personB) => {
      const personATracksInCommon = personA.topTracks.filter((track) => currentUserFromDB.topTracks.includes(track));
      const personAArtistsInCommon = personA.topArtists.filter((artist) => currentUserFromDB.topArtists.includes(artist));
      const personBTracksInCommon = personB.topTracks.filter((track) => currentUserFromDB.topTracks.includes(track));
      const personBArtistsInCommon = personB.topArtists.filter((artist) => currentUserFromDB.topArtists.includes(artist));
      const personATotalPoints = personATracksInCommon.length + personAArtistsInCommon.length;
      const personBTotalPoints = personBTracksInCommon.length + personBArtistsInCommon.length;
      if (personATotalPoints < personBTotalPoints) {
        return -1;
    }
      if (personATotalPoints > personBTotalPoints) {
        return 1;
      }
      return 0;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        let { data } = await axios.get(usersURL);
        // console.log("data ", data[0]._id);
        console.log("current user ", currentUserFromDB);
        console.log("current ", currentUserFromDB._id);
        data = data.filter((user) => user._id !== currentUserFromDB._id);
        console.log("data ", data);

        // setMatchData(data);
        console.log("unsorted match data", data);
        let sortedMatchData = Array.from(data);
        sortedMatchData.sort(matchingAlgorithm);
        sortedMatchData.reverse()
        console.log("sorted match data", sortedMatchData);
        setMatchData(sortedMatchData);


        console.log("matches ",matchData);
        setLoading(false);
        console.log(data);
      } catch (e) {
        console.log(e);
        setErrorMsg(e.message);
      }
    }
    fetchData();
  }, [currentUserFromDB]);

  

  async function match(person){
    console.log("Matched ", person.firstName);
    let chatroom;
    if (person._id > currentUserFromDB._id){
      chatroom = person._id + "-" + currentUserFromDB._id;
    }else{
      chatroom = currentUserFromDB._id + "-" + person._id;
    }
    let matches = currentUserFromDB.matches;
    if (matches){
      currentUserFromDB.matches.push({_id: person._id, name: person.firstName, chatroom: chatroom, img: ""});
    }else{
      matches = [{_id: person._id, name: person.firstName, chatroom: chatroom, img: ""}];
    }
    let userUpdateInfo = {
      firstName: currentUserFromDB.firstName,
      lastName: currentUserFromDB.lastName,
      bio: currentUserFromDB.bio,
      email: currentUserFromDB.email,
      spotifyUsername: currentUserFromDB.spotifyUsername,
      matches: matches,
      rejects: currentUserFromDB.rejects,
      prospectiveMatches: currentUserFromDB.prospectiveMatches,
      topArtists: currentUserFromDB.topArtists,
      topArtistImgs: currentUserFromDB.topArtistImgs,
      topTracks: currentUserFromDB.topTracks,
    };

    const newMatchData = await axios.post(
      "http://localhost:8888/users/update-user/" + currentUserFromDB._id,
      { updatedUser: userUpdateInfo }
    );

    const createChat = await axios.post(
      "http://localhost:8888/users/create-chatroom/",
      { 
        chatName: chatroom,
        users: [currentUserFromDB._id, person._id] 
      }
    );
    
    setCurrentUserFromDB(newMatchData.data);

    console.log("new current user:", currentUserFromDB); 
    
  }

  async function unmatch(person){
    console.log("unmatched ", person.firstName);
    let chatroom;
    if (person._id > currentUserFromDB._id){
      chatroom = person._id + "-" + currentUserFromDB._id;
    }else{
      chatroom = currentUserFromDB._id + "-" + person._id;
    }
    let userUpdateInfo = {
      firstName: currentUserFromDB.firstName,
      lastName: currentUserFromDB.lastName,
      bio: currentUserFromDB.bio,
      email: currentUserFromDB.email,
      spotifyUsername: currentUserFromDB.spotifyUsername,
      pfp_url: currentUserFromDB.pfp_url,
      matches: currentUserFromDB.matches.filter((user) => user._id !== person._id),
      rejects: currentUserFromDB.rejects,
      prospectiveMatches: currentUserFromDB.prospectiveMatches,
      topArtists: currentUserFromDB.topArtists,
      topArtistImgs: currentUserFromDB.topArtistImgs,
      topTracks: currentUserFromDB.topTracks,
    };

    const newMatchData = await axios.post(
      "http://localhost:8888/users/update-user/" + currentUserFromDB._id,
      { updatedUser: userUpdateInfo }
    );

    console.log("chatroom", chatroom);
    const deleteChat = await axios.delete(
      "http://localhost:8888/users/delete-chatroom/",
      { 
        data: {chatName: chatroom}
      }
    );
    
    setCurrentUserFromDB(newMatchData.data);
    
  }

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
        <div>
          <br />
          <div className='Center-Container'>
            
          {matchData.map((person) => {
            const tracksInCommon = person.topTracks.filter((track) => currentUserFromDB.topTracks.includes(track));
            const artistsInCommon = person.topArtists.filter((artist) => currentUserFromDB.topArtists.includes(artist));
           return (
              <div className='Center' key={person._id}>
                <div className='Text-Field'>
                  <div className='Card-Heading'>
                    <div className="ImageNameHolder">
                      <img className="ProfilePic" src={person.pfp_url} alt="Profile Picture"></img>
                      <h1>{person.firstName}</h1>
                    </div>
                    {person.spotifyUsername !== "" &&
                    <div className="SpotifyUsername">
                      <a href={`https://open.spotify.com/user/${person.spotifyUsername}`} target="_blank">@{person.spotifyUsername}</a>
                    </div>
                    }
                  </div>
                  
                  <div className="Bio">
                    <div className="Bio-Divider">
                      <h2>Description:</h2>
                      <div>
                        {person.bio.description}
                      </div>
                    </div>
                    <div className="Bio-Divider">
                      <h2>Fun Fact:</h2>
                      <div> 
                        {person.bio.funFact}
                      </div>
                    </div>
                    <div className="Bio-Divider">
                      <h2>Other:</h2>
                      <div>
                        {person.bio.other}
                      </div>
                    </div>
                    {tracksInCommon.length > 0 ?
                      <div className="Bio-Divider">
                        <h2>{person.firstName}'s Shared Songs: </h2>
                        <ul>
                          {tracksInCommon.map((track) => {
                            return (<li>
                              {track}
                            </li>)})}
                        </ul> 
                      </div>
                      : null
                    }
                    {artistsInCommon.length > 0 ?
                      <div className="Bio-Divider">
                        <h2>{person.firstName}'s Shared Artists: </h2>
                        <ul>
                          {artistsInCommon.map((artist) => {
                            return (<li>
                              {artist}
                            </li>)})}
                        </ul>
                      </div>
                      :null
                    }
                    {currentUserFromDB.matches.filter(
                    (match) => match._id === person._id).length > 0 ?
                    <button
                      className='button'
                      onClick={
                        () => unmatch(person)
                      } 
                    >
                      Unmatch
                    </button>
                    :
                    <button
                      className='button'
                      onClick={() =>
                        match(person)
                      }
                    >
                      Match
                    </button>
                    }
                  </div>
                  
                  <br />
                  <br />
                  
                </div>
              </div>
            )
          })}
          </div>
        </div>
      );
        }
      }
    }
        

export default Home;