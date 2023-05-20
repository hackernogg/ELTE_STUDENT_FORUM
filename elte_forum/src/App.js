import Navbar from './Navbar';
import Home from './Home';
import LoginReg from './LoginReg';
import React, { useState } from 'react';
import PostDetails from "./PostDetails";
import CreatePost from './CreatePost';
import Market from './Market';
import MarketPostDetails from './MarketPostDetails';
import Settings from './Settings';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [loginStatus, setloginStatus] = useState("");
  const [username, setUsername] = useState("");
  const handleChildData = (data1,data2) => {
    setloginStatus(data1);
    setUsername(data2);
  };
  return (
    <Router>
      <div className="App">
        {(loginStatus === '' || loginStatus !== username) &&(
          <LoginReg onChildData={handleChildData}/>
        )}

        {(loginStatus === username && loginStatus !== "" ) && (
          <div>
            <Navbar/>
            <div className="content">
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/posts/:id" element={<PostDetails />} />
                <Route path="/createPost" element={<CreatePost />} />
                <Route path="/Market" element={<Market />} />
                <Route path="/market_posts/:id" element={<MarketPostDetails />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </div>
        )}
        
      </div>
    </Router>
  );
}

export default App;