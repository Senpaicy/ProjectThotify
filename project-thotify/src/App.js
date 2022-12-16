// import logo from './logo.svg';
import './App.css';
import React from 'react';
import {NavLink, BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Matches from './components/Matches';
import Message from './components/Message';

function App() {
  return (
    <Router>
        <div>
          <header className='App-header'>
            <h1 className='App-title'>
              Thotify
            </h1>
            <nav>
              <NavLink className='navlink' to='/'>
                Home
              </NavLink>
              |
              <NavLink className='navlink' to='/profile/0'> 
               {/*Need to change link above to logged in user's profile, or redirect to login*/}
                My Profile
              </NavLink>
              |
              <NavLink className='navlink' to='/my-matches'>
                My Matches
              </NavLink>
              |
              <NavLink className='navlink' to='/message/'>
                Message Test 
              </NavLink>
            </nav>
          </header>
          <div className='App-body'>
            <Routes>
              <Route exact path='/' element={<Home/>} />
              <Route path='/profile/:id' element={<Profile/>} />
              <Route exact path='/my-matches/' element={<Matches/>} />
              <Route path='/message/' element={<Message/>} />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
