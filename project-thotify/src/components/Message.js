import React, { 
  useEffect, 
  useRef, 
  useState
} from 'react';

import io from 'socket.io-client';
import './../App.css';
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function Message({currentUserFromDB, setCurrentUserFromDB}) {
  
  const {chatroom} = useParams();
  console.log(chatroom);
  // chat history, name, room, and recipient are passed in from the link on the matches page
  // const location = useLocation();
  // const [state, setState] = useState(location.state);
  // temporary state for testing purposes
  // currently has zero protection against unauthorized users joining the chat

  console.log("CUFDB", currentUserFromDB);
  
  const recipient = currentUserFromDB.matches.filter((user) => user.chatroom === chatroom)[0].firstName;
  console.log("recipient", recipient);

  

  const [state, setState] = useState({message: '', name: currentUserFromDB.firstName, room: chatroom, recipient: recipient, history:[]});
  const [chat, setChat] = useState([]);

  console.log("CUFDB, ", currentUserFromDB);
  const socketRef = useRef();

  useEffect(() => {
    async function fetchData() {
      try {
        // const { data } = await axios.get(matchesURL + currentUserFromDB._id);
        //should be in the form of:
        //[{_id: 123141414, name: 'John', chatroom:'123', img}, ....]
        const {data} = await axios.get(
          "http://localhost:8888/users/" + currentUserFromDB._id + '/chat/' + chatroom,
        );
        console.log("data", data);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log("CUFDB 2, ", currentUserFromDB);
    console.log("State, ", state);
    socketRef.current = io('/');
    // setState({name: document.getElementById('username_input').value, room: document.getElementById('room_input').value});
    socketRef.current.emit('create_room', state.name, "A");
    console.log("Room Created");
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socketRef.current.on('message', ({name, message}) => {
      setChat([...chat, {name, message}]);
    });
  }, [chat]);

  const onMessageSubmit = (e) => {
    console.log("Message send called");
    let msgEle = document.getElementById('message');
    console.log([msgEle.name], msgEle.value);
    setState({...state, [msgEle.name]: msgEle.value});
    socketRef.current.emit('message', {
      name: state.name,
      message: msgEle.value,
    }, state.room);
    e.preventDefault();
    setState({message: '', name: state.name, room: state.room, recipient: state.recipient, history: state.history});
    msgEle.value = '';
    msgEle.focus();
  };

  const onRoomLeave = (e) => {
    setChat([]);
    socketRef.current.emit('leave_room', state.name, state.room);
    setState({message: '', name: '', room: ''});
    //leads to form submission being cancelled because the form is not connected
    // push chat to history on database
    
  };

  const renderHistory = () => {
    return state.history.map(({name, message}, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  const renderChat = () => {
    return chat.map(({name, message}, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  return (
    <div>
      {state.name && (
        <div className='card'>
          <div className='render-chat'>
            <h1>Chat With {state.recipient}</h1>
            {renderHistory()}
            {renderChat()}
          </div>
          <form onSubmit={onMessageSubmit}>
            <h1>Messenger</h1>
            <div>
              <input
                name='message'
                id='message'
                variant='outlined'
                label='Message'
              />
            </div>
            <button>Send Message</button>
            <br/><br/>
          </form>
          <form onSubmit={onRoomLeave}>
            <button>Leave Chat</button>
          </form>
        </div>
      )}

    </div>
  );
};

export default Message;
