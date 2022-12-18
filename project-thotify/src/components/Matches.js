import React, { useState, useEffect } from 'react';
import './../App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../style/css/Forms.css";

function Matches() {
    
	const [matchData, setMatchData] = useState(undefined);
	const [ loading, setLoading ] = useState(true);
	const [ errorMsg, setErrorMsg ] = useState(undefined);
    const matchesURL = "";

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(matchesURL);
                setMatchData(data);
                setLoading(false);
                console.log(data);
            } catch (e) {
                console.log(e);
                setErrorMsg(e);
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

    let  li =
		matchData &&
		matchData.map((match) => {
		  return buildListItem(match);
		});

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
				<br/>
				<div className="list-unstyled">{li}</div>
			</div>
        );
    }
		
};

export default Matches;