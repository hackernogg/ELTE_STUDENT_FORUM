import { useState,useEffect } from "react";
import React from "react";
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [username, setUsername] = useState(localStorage.getItem("loggedInUsername"));
    const loggedInUsername = localStorage.getItem("loggedInUsername");

    useEffect(() => {
      setUsername(loggedInUsername);
    }, [loggedInUsername]);

    const logout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("loggedInUsername");
        localStorage.removeItem("isAdmin");
        window.location.href = "/";
      };

    return (  
        <nav className="navbar">
            <h1>ELTE Student Forum</h1>
            <div className="links">
                <a className="type" href="/">Forum</a>
                <a className="type" href="/market">Market</a>
                <Link to="/createPost">
                    <button className="logout-button">+</button>
                </Link>
                <a href="/settings" className="username">{username}</a>
                <button className="logout-button" onClick={logout} >➮</button>
            </div>
        </nav>
    );
}
 
export default Navbar;