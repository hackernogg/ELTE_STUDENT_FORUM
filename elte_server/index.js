const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
//this V

const app = express();
const saltRounds = 10;

app.use(express.json());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "87694748",
    database: "elte_forum_db"
});

app.post('/register',(req, res)=>{
  const userid = req.body.userid;
  const username = req.body.username;
  const password = req.body.password;
  
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
      res.send({ message: "Error hashing password" });
    } else {
      db.query(
        "INSERT INTO users (user_id, user_name, user_pwd) VALUES (?, ?, ?)",
        [userid, username, hash],
        (err,result)=>{
          console.log(err);
          if (err){
            res.send({message: "This user id has already been used, please re-enter a new one."});
          }else{
            res.send(result);
          }
        }
      );
    }
  });
});

app.post('/login', (req,res)=>{
  const userid = req.body.userid;
  const password = req.body.password;
  db.query(
    "SELECT * FROM users WHERE user_id = ?",
    [userid],
    (err,result)=>{
      if (err){
        res.send({err: err});
      }
      if (result.length > 0){
        bcrypt.compare(password, result[0].user_pwd, (err, isMatch) => {
          if (err) {
            console.log(err);
            res.send({ message: "Error comparing password" });
          }
          if (isMatch) {
            res.send(result);
          } else {
            res.send({ message: "Wrong userid/password combination!" });
          }
        });
      } else {
        res.send({ message: "Wrong userid/password combination!" });
      }
    }
  );
});

app.get("/posts", (req, res) => {
  const page = req.query.page;
  const pageSize = req.query.pageSize;
  console.log(page);
  console.log(pageSize);
  const realpageSize = pageSize * 1;
  const offset = page * pageSize;
  db.query("SELECT * FROM posts LIMIT ? OFFSET ?",
  [realpageSize, offset],(err, result) => {
    if (err) {
    console.error("Error fetching posts:", err);
    res.status(500).send("Error fetching posts");
    } else {
      res.json(result);
    }
    }
    );
  });

  app.get("/posts/count", (req, res) => {
    db.query("SELECT COUNT(*) AS count FROM posts", (err, result) => {
      if (err) {
        console.error("Error fetching post count:", err);
        res.status(500).send("Error fetching post count");
      } else {
        res.json(result[0]);
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

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  
  app.post('/uploadImage', upload.single('image'), (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
    // Here you can perform any additional processing on the uploaded image,
    // such as resizing, cropping, or compressing.
    // Then return the URL where the image can be accessed.
    res.json({ url: `http://localhost:3001/${file.path}` });
  });
  

app.listen(3001,()=>{
    console.log("running server");
});

