import React, { useState, useEffect } from 'react';

// --- Importing Stylesheets
import './../App.css';
import "../style/css/Forms.css";

import { Link } from 'react-router-dom';
import axios from 'axios';

function Home({currentUserFromDB, setCurrentUserFromDB}) {
  const [matchData, setMatchData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(undefined);
  const usersURL = "http://localhost:8888/users/";

  useEffect(() => {
    async function fetchData() {
      try {
        let { data } = await axios.get(usersURL);
        // console.log("data ", data[0]._id);
        console.log("current user ", currentUserFromDB);
        console.log("current ", currentUserFromDB._id);
        data = data.filter((user) => user._id !== currentUserFromDB._id);
        console.log("data ", data);

        setMatchData(data);
        console.log("matches ",matchData);
        setLoading(false);
        console.log(data);
      } catch (e) {
        console.log(e);
        setErrorMsg(e.message);
      }
    }
    fetchData();
  }, []);

  

  async function match(person){
    console.log("Matched ", person.firstName);
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
      matches: currentUserFromDB.matches.push({_id: person._id, name: person.name, chatroom: chatroom, img: ""}),
      rejects: currentUserFromDB.rejects,
      prospectiveMatches: currentUserFromDB.prospectiveMatches,
      topArtists: currentUserFromDB.topArtists,
      topTracks: currentUserFromDB.topTracks,
    };

    const newMatchData = await axios.post(
      "http://localhost:8888/users/update-user/" + currentUserFromDB._id,
      { updatedUser: userUpdateInfo }
    );
    
    setCurrentUserFromDB(newMatchData.data);
    
  }

  async function unmatch(person){
    console.log("unmatched ", person.firstName);
    let userUpdateInfo = {
      firstName: currentUserFromDB.firstName,
      lastName: currentUserFromDB.lastName,
      bio: currentUserFromDB.bio,
      email: currentUserFromDB.email,
      spotifyUsername: currentUserFromDB.spotifyUsername,
      matches: currentUserFromDB.matches.filter((user) => user._id !== person._id),
      rejects: currentUserFromDB.rejects,
      prospectiveMatches: currentUserFromDB.prospectiveMatches,
      topArtists: currentUserFromDB.topArtists,
      topTracks: currentUserFromDB.topTracks,
    };

    const newMatchData = await axios.post(
      "http://localhost:8888/users/update-user/" + currentUserFromDB._id,
      { updatedUser: userUpdateInfo }
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
      // return (
      //   <div className="App-body">
      //     {errorMsg}
      //     <br />
      //     <div className="list-unstyled">{li}</div>
      //   </div>
      // );
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
               
                  <h1>{person.firstName}</h1>
                  <div>{person.bio.description}</div>
                  <div>{person.bio.funFact}</div>
                  <div>{person.bio.other}</div>
                  <h2>You have these top songs in common: </h2>
                  <ul>
                    {tracksInCommon.map((track) => {
                      return (<li>
                        {track}
                      </li>)})}
                  </ul>
                  <h2>You have these top artists in common:</h2>
                  <ul>
                    {artistsInCommon.map((artist) => {
                      return (<li>
                        {artist}
                      </li>)})}
                  </ul>
                  <br />
                  <div>
                  {currentUserFromDB.matches.includes(person._id) ?
                  <button
                className='button'
                onClick={() =>
                  // unmatch 
                  // remove from currentUserFromDB.matches
                  unmatch(person)
                  // console.log("Unmatched ", person.firstName)
                }
              >
                Unmatch
              </button>
              :
              <button
                className='button'
                onClick={() =>
                  // match
                  // add to from currentUserFromDB.matches
                  match(person)
                  // console.log("Matched ", person.firstName)
                }
              >
                Match
              </button>
            }
                  </div>
                 
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