import Navbar from './Navbar';
import Home from './Home';
import LoginReg from './LoginReg';
import React, { useState } from 'react';
import BlogDetails from "./BlogDetails";
import CreatePost from './CreatePost';
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

function App() {
  const [loginStatus, setloginStatus] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
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
                <Route path="/createPost" element={<CreatePost userId={userId} userName={username} />} />
              </Routes>
            </div>
          </div>
        )}
        
      </div>
    </Router>
  );
}

export default App;