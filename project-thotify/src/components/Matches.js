import React, { useState, useEffect } from 'react';
import './../App.css';
import "../style/css/Forms.css";
import { Link } from 'react-router-dom';
import axios from 'axios';


function Matches({currentUserFromDB, setCurrentUserFromDB}) {

  const [matchData, setMatchData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(undefined);
  const matchesURL = "http://35.163.199.26:8888/users/";

  useEffect(() => {
    async function fetchData() {
      try {
        // const { data } = await axios.get(matchesURL + currentUserFromDB._id);
        //should be in the form of:
        //[{_id: 123141414, name: 'John', chatroom:'123', img}, ....]
        setMatchData(currentUserFromDB.matches);
        setLoading(false);
        console.log(currentUserFromDB.matches);
      } catch (e) {
        console.log(e);
        setErrorMsg(e.message);
      }
    }
    fetchData();
  }, [currentUserFromDB]);

  async function unmatch(person){
    console.log("person", person);
    console.log("unmatched ", person.name);
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
      "http://35.163.199.26:8888/users/update-user/" + currentUserFromDB._id,
      { updatedUser: userUpdateInfo }
    );

    console.log("chatroom", chatroom);
    const deleteChat = await axios.delete(
      "http://35.163.199.26:8888/users/delete-chatroom/",
      { 
        data: {chatName: chatroom}
      }
    );
    
    setCurrentUserFromDB(newMatchData.data);
    
  }

  const buildListItem = (match) => {
    return (
      <div key={match._id}>
        <div className='Center-Container'>
          <div className='Center'>
            {/* <Link to={`/Profile/${match._id}`}>{match.img}</Link> */}
            <h1>{match.name}</h1>
            
            <Link to={`/message/${match.chatroom}`}>
              <button>Chat</button>
            </Link>
            <button
              className='button'
              onClick={() =>
                unmatch(match)
              }
            >
              Unmatch
            </button>
          </div>
          
        </div>       
      </div>
    );
  };

  let li =
    matchData &&
    matchData.map((match) => {
      return buildListItem(match);
    });

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
        <div className="App-body">
          {errorMsg}
          <br />
          <div className="list-unstyled">{li}</div>
        </div>
      );
    }
  }

};

export default Matches;