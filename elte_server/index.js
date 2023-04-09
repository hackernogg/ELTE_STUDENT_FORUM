const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "87694748",
    database: "elte_forum_db"
});
app.post('/register',(req, res)=>{

    const username = req.body.username;
    const password = req.body.password;
    db.query(
        "INSERT INTO users (user_name, user_pwd, user_profile_pic_index) VALUES (?, ?, 1)",
        [username, password], 
        (err,result)=>{
            console.log(err);
        });
});

app.post('/login', (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    db.query(
        "SELECT * FROM users WHERE user_name = ? AND user_pwd = ?",
        [username, password], 
        (err,result)=>{
            if (err){
                res.send({err: err});
            }

            if (result.length > 0){
                res.send(result);
            } else{
                res.send({message: "Wrong username/password combination!"});
            }
        });
});

app.listen(3001,()=>{
    console.log("running server");
});

