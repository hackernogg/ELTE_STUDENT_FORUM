import Navbar from './Navbar';
import Home from './Home';
import LoginReg from './LoginReg';
import React, { useState } from 'react';


function App() {
  const [loginStatus, setloginStatus] = useState("");
  const [username, setUsername] = useState("");
  const handleChildData = (data1,data2) => {
    setloginStatus(data1);
    setUsername(data2);
  };
  return (
    <div className="App">
      {(loginStatus === '' ||loginStatus != username) &&(
        <LoginReg onChildData={handleChildData}/>
      )}

      {(loginStatus === username && loginStatus != "" )&& (
        <div>
          <Navbar username={username}/>
          <div className='content'>
            <Home/>
        
          </div>
        </div>
      )}
      
    </div>
  );
}

export default App;
