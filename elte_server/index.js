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

app.get("/posts", (req, res) => {
    db.query("SELECT * FROM posts", (err, result) => {
      if (err) {
        console.error("Error fetching posts:", err);
        res.status(500).send("Error fetching posts");
      } else {
        res.json(result);
      }
    });
  });
  
  app.get("/posts/:post_id", (req, res) => {
    const postId = req.params.post_id;
    console.log(postId)
    db.query("SELECT * FROM posts WHERE post_id = ?", [postId], (err, result) => {
      if (err) {
        console.error("Error fetching post:", err);
        res.status(500).send("Error fetching post");
      } else {
        res.json(result[0]); // Send the first result (should be the only one)
      }
    });
  });

  app.post('/createPost', (req, res) => {
    const { title, content, postType, user_id, user_name } = req.body;
  
    db.query(
      "INSERT INTO posts (title, content, user_id, user_name) VALUES (?, ?, ?, ?)",
      [title, content, user_id, user_name],
      (err, result) => {
        if (err) {
          console.error("Error creating post:", err);
          res.status(500).send("Error creating post");
        } else {
          res.json({ message: "Post created successfully" });
        }
      }
    );
  });

app.listen(3001,()=>{
    console.log("running server");
});

