import Navbar from './Navbar';
import Home from './Home';
import LoginReg from './LoginReg';
import React, { useState } from 'react';
import BlogDetails from "./BlogDetails";
import CreatePost from './CreatePost';
import Market from './Market';
import MarketBlogDetails from './MarketBlogDetails';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [loginStatus, setloginStatus] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  console.log(userId);
  const handleChildData = (data1,data2,data3) => {
    setloginStatus(data1);
    setUsername(data2);
    setUserId(data3);
  };
  return (
    <Router>
      <div className="App">
        {(loginStatus === '' || loginStatus !== username) &&(
          <LoginReg onChildData={handleChildData}/>
        )}

        {(loginStatus === username && loginStatus !== "" ) && (
          <div>
            <Navbar username={username}/>
            <div className="content">
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/blogs/:id" element={<BlogDetails />} />
                <Route path="/createPost" element={<CreatePost />} />
                <Route path="/Market" element={<Market />} />
                <Route path="/market_blogs/:id" element={<MarketBlogDetails />} />
              </Routes>
            </div>
          </div>
        )}
        
      </div>
    </Router>
  );
}

export default App;