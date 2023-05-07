import React, { useState } from 'react';
import Axios from 'axios';

const Settings = () =>{

    const [username, setUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const storedUserName = localStorage.getItem("loggedInUsername");
    const storedUserid = localStorage.getItem("loggedInUserid");

    const handleNameSubmit = (e) => {
        e.preventDefault();
        if ( !username ) {
            console.error('All fields must be filled in');
            return;
          }
        Axios.post("http://localhost:3001/changeName", {
          userid: storedUserid,
          username: username,
        })
          .then((response) => {
            if (response.data.message) {
              console.log(response.data.message);
              localStorage.setItem("loggedInUsername",username);
              window.location.reload();
            } else {
              // ...
            }
          })
          .catch((error) => {
            console.error('Error updating username:', error);
          });
      };

      const handlePWDSubmit = (e) => {
        e.preventDefault();
      
        // Validate input values and handle errors
        if (!currentPassword || !newPassword || !confirmPassword) {
          console.error('All fields must be filled in');
          return;
        }
      
        if (newPassword !== confirmPassword) {
          console.error('New password and confirm password do not match');
          return;
        }
      
        // Verify the user's current password and update it with the new password
        Axios.post("http://localhost:3001/verifyAndUpdatePassword", {
          userid: storedUserid,
          currentPassword: currentPassword,
          newPassword: newPassword,
        })
          .then((response) => {
            if (response.data.message) {
                if (response.data.message ==='Password updated successfully'){
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("loggedInUsername");
                    localStorage.removeItem("isAdmin");
                    window.location.href = "/";
                } else{
                    console.error(response.data.message);
                }
            }
          })
          .catch((error) => {
            console.error('Error updating password:', error);
          });
      };

    return (
        <div>
        <h2>Settings</h2>
        <form onSubmit={handleNameSubmit}>
            <div>
                <label htmlFor="username">New Username:</label>
                <input
                    id="username"
                    type="text"
                    placeholder={storedUserName}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <button type="submit">Save Username</button>
        </form>
        <form onSubmit={handlePWDSubmit}>
            <div>
            <label htmlFor="currentPassword">Current Password:</label>
            <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
            </div>
            <div>
            <label htmlFor="newPassword">New Password:</label>
            <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            </div>
            <div>
            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            </div>
            <button type="submit">Save Password</button>
        </form>
        </div>
    );
}

export default Settings;