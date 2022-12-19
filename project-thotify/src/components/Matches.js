import React, { useState, useEffect } from 'react';
import './../App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../style/css/Forms.css";

function Matches({currentUserFromDB}) {

  const [matchData, setMatchData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(undefined);
  const matchesURL = "http://localhost:8888/users/";

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(matchesURL + currentUserFromDB._id);
        //should be in the form of:
        //[{_id: 123141414, name: 'John', chatroom:'123', img}, ....]
        setMatchData(data.matches);
        setLoading(false);
        console.log(data.matches);
      } catch (e) {
        console.log(e);
        setErrorMsg(e.message);
      }
    }
    fetchData();
  }, []);

  const buildListItem = (match) => {
    return (
      <div key={match.id}>
        <Link to={`/Profile/${match.id}`}>
          {match.profile.img}
        </Link>
        {match.name}
        <Link to={`/Chat/${match.chatId}`}>
          Chat
        </Link>
        <Link to={`/Matches/Unmatch/${match.id}`}>
          Unmatch
          {/* Fix this later */}
        </Link>
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