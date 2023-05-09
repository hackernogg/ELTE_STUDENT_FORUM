import Navbar from './Navbar';
import Home from './Home';
import LoginReg from './LoginReg';
import React, { useState } from 'react';
import BlogDetails from "./BlogDetails";
import CreatePost from './CreatePost';
import Market from './Market';
import MarketBlogDetails from './MarketBlogDetails';
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
                <Route path="/blogs/:id" element={<BlogDetails />} />
                <Route path="/createPost" element={<CreatePost />} />
                <Route path="/Market" element={<Market />} />
                <Route path="/market_blogs/:id" element={<MarketBlogDetails />} />
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