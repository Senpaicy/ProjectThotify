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
  // currently has zero protection against unauthorized users joining the chat
  const recipient = (currentUserFromDB.matches.length > 0 && currentUserFromDB.matches.filter((user) => user.chatroom === chatroom).length > 0 ) ? currentUserFromDB.matches.filter((user) => user.chatroom === chatroom)[0].name : null;
  console.log("RECIPIENT", recipient);


  const [state, setState] = useState({message: '', name: currentUserFromDB.firstName, room: chatroom, recipient: recipient, history:[]});
  const [chat, setChat] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    async function fetchData() {
      try {
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
    socketRef.current.emit('create_room', state.name, state.room, currentUserFromDB._id);
    console.log("Room Created");
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socketRef.current.on('message', ({name, message}) => {
      console.log("NAME", name);
      console.log("MESSAGE", message);
      let currentDate = new Date();
      const timestamp = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
      setChat([...chat, {name, message, timestamp }]);
    });
  }, [chat]);

  const onMessageSubmit = async (e) => {
    console.log("Message send called");
    let msgEle = document.getElementById('message');
    console.log("msgElement", [msgEle.name], msgEle.value);
    setState({...state, [msgEle.name]: msgEle.value});
    console.log("ROOM", state.room);
    socketRef.current.emit('message', {
      name: state.name,
      message: msgEle.value,
      id: currentUserFromDB._id
    }, state.room);
    console.log("ROOM", state.room);
    e.preventDefault();
    console.log("message", state.message);
    let currentDate = new Date();
    const timestamp = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
    const messageInfo = {
      sender: state.name, 
      content: msgEle.value, 
      timestamp: timestamp
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
    return chat.map(({name, message, timestamp}, index) => (
      <div key={index}>
        <h3>
          {timestamp} {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };
  
  if (!chatroom.includes(currentUserFromDB._id) || currentUserFromDB.matches.filter((user) => user.chatroom === chatroom).length <= 0 ){
    return (
      <h1>You do not have access to this chat room</h1>
    )
  }

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
              <label htmlFor='message'>Type Message Here: </label>
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
          {/* <form onSubmit={onRoomLeave}>
            <button>Leave Chat</button>
          </form> */}
        </div>
      )}

    </div>
  );
};

export default Message;
