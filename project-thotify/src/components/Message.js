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
  // chat history, name, room, and recipient are passed in from the link on the matches page
  // const location = useLocation();
  // const [state, setState] = useState(location.state);
  // temporary state for testing purposes
  // currently has zero protection against unauthorized users joining the chat

  // Need to post to chat (update history)

  // Render chat/render history not working?

  //recopient undefined
  
  const recipient = currentUserFromDB.matches.filter((user) => user.chatroom === chatroom)[0].name;


  const [state, setState] = useState({message: '', name: currentUserFromDB.firstName, room: chatroom, recipient: recipient, history:[]});
  const [chat, setChat] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    async function fetchData() {
      try {
        // const { data } = await axios.get(matchesURL + currentUserFromDB._id);
        //should be in the form of:
        //[{_id: 123141414, name: 'John', chatroom:'123', img}, ....]
        const {data} = await axios.get(
          "http://localhost:8888/users/chat/" + chatroom,
        );
        console.log("data", data);
        setState({message: '', name: currentUserFromDB.firstName, room: chatroom, recipient: recipient, history: data.history});
      } catch (e) {
        console.log("Error: ", e);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
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

  const onMessageSubmit = async (e) => {
    console.log("Message send called");
    let msgEle = document.getElementById('message');
    console.log("msgElement", [msgEle.name], msgEle.value);
    setState({...state, [msgEle.name]: msgEle.value});
    socketRef.current.emit('message', {
      name: state.name,
      message: msgEle.value,
    }, state.room);
    e.preventDefault();
    console.log("message", state.message);
    const messageInfo = {
      sender: state.name, 
      content: msgEle.value, 
      timestamp: new Date().toDateString()
    }
    console.log("messageInfo", messageInfo);
    try{
      const uploadMessage = await axios.post(
        "http://localhost:8888/users/chat/" + chatroom,
        {
          message: messageInfo
        }
      );
    }catch(e){
      console.log("Error: ", e);
    }
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
    console.log("History", state.history);
    return state.history.map(({content, sender, timestamp}, index) => (
      <div key={index}>
        <h3>
          {timestamp} {sender}: <span>{content}</span>
        </h3>
      </div>
    ));
  };

  const renderChat = () => {
    console.log("CHAT", chat);
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
          <div className='Center-Container'>
            <h1>Chat With {state.recipient}</h1>
            <div className='Center'>
            {renderHistory()}
            {renderChat()}
            </div>
          </div>
          <form onSubmit={onMessageSubmit}>
            <div>
              <label for='message'>Type Message Here: </label>
              <input
                 className='Center'
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
