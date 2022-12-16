import React, {useEffect, useRef, useState} from 'react';
// import {useLocation} from 'react-router-dom';
import io from 'socket.io-client';
import './../App.css';

function Message() {
  // chat history, name, room, and recipient are passed in from the link on the matches page
  // const location = useLocation();
  // const [state, setState] = useState(location.state);
  // temporary state for testing purposes
  // currently has zero protection against unauthorized users joining the chat
  const [state, setState] = useState({message: '', name: '', room: 'A', recipient: 'Frank', history:[{name: "Bob", message: "Hi"},{name: "Frank", message: "Hello"}]});
  const [chat, setChat] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('/');
    // setState({name: document.getElementById('username_input').value, room: document.getElementById('room_input').value});
    socketRef.current.emit('create_room', "Bob", "A");
    // console.log("Room Created");
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
