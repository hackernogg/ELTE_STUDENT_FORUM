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
  const page = req.query.page || 0;
  const pageSize = req.query.pageSize || 7;
  const category = req.query.category || "";
  const sort = req.query.sort || "newest";
  const user_id = req.query.user_id || "";
  const searchTitle = req.query.searchTitle || "";
  const realPageSize = pageSize * 1;
  const offset = page * pageSize;
  let query = "SELECT posts.post_id, posts.title, posts.content, posts.user_id, posts.category_id, posts.created_time, posts.updated_time, users.user_name FROM posts INNER JOIN users ON posts.user_id = users.user_id";
  let countQuery = "SELECT * FROM posts";
  const params = [];
  const countParams = [];

  if (category) {
    if (category == "my-posts"){
      query += " WHERE posts.user_id = ?";
      countQuery += " WHERE posts.user_id = ?";
      params.push(user_id);
      countParams.push(user_id);
    }
    else{
      query += " WHERE category_id = ?";
      countQuery += " WHERE category_id = ?";
      params.push(category);
      countParams.push(category);
    }
  }
  if (searchTitle){
    query = "SELECT * FROM ("+query+") AS subquery WHERE LOWER(title) LIKE ?"
    params.push("%" + searchTitle.toLowerCase() + "%");
    countQuery = "SELECT * FROM ("+countQuery+") AS subquery1 where LOWER(title) LIKE ?";
    countParams.push("%" + searchTitle.toLowerCase() + "%");
  }
  countQuery = "SELECT COUNT(*) AS count FROM ("+countQuery+") AS subquery2";

  query += " ORDER BY created_time";

  if (sort === "newest") {
    query += " DESC";
  } else if (sort === "oldest") {
    query += " ASC";
  }

  query += " LIMIT ? OFFSET ?";
  params.push(realPageSize, offset);


  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error fetching posts:", err);
      res.status(500).send("Error fetching posts");
    } else {
      db.query(countQuery, countParams, (err, countResult) => {
        if (err) {
          console.error("Error fetching post count:", err);
          res.status(500).send("Error fetching post count");
        } else {
          const totalCount = countResult[0].count;
          res.json({ posts: result, totalCount: totalCount });
        }
      });
    }
  });
});
  
  app.get("/posts/:post_id", (req, res) => {
    const postId = req.params.post_id;
    db.query("SELECT posts.post_id, posts.title, posts.content, posts.user_id, posts.category_id, posts.created_time, posts.updated_time, users.user_name FROM posts INNER JOIN users ON posts.user_id = users.user_id WHERE post_id = ?", [postId], (err, result) => {
      if (err) {
        console.error("Error fetching post:", err);
        res.status(500).send("Error fetching post");
      } else {
        res.json(result[0]); // Send the first result (should be the only one)
      }
    });
  });

  // GET all replies for a post
  app.get('/posts/:postId/replies', (req, res) => {
    const postId = req.params.postId;
    db.query('SELECT replies.reply_id, replies.content, replies.user_id, replies.created_time, replies.updated_time, replies.post_id, users.user_name FROM replies INNER JOIN users ON replies.user_id = users.user_id WHERE replies.post_id = ?', [postId], (err, result) => {
      if (err) {
        console.error('Error fetching replies:', err);
        res.status(500).send('Error fetching replies');
      } else {
        res.json(result);
      }
    });
  });

  // POST a new reply for a post
app.post('/posts/:postId/replies', (req, res) => {
  const postId = req.params.postId;
  const content = req.body.content;
  const userId = req.body.userId;
  const userName = req.body.userName;
  db.query('INSERT INTO replies (content, user_id, post_id) VALUES (?, ?, ?)', [content, userId, postId], (err, result) => {
    if (err) {
      console.error('Error inserting reply:', err);
      res.status(500).send('Error inserting reply');
    } else {
      res.json(result);
    }
  });
});

// Get all categories
  app.get('/categories', (req, res) => {
    db.query('SELECT * FROM post_category', (err, result) => {
      if (err) {
        console.error('Error fetching categories:', err);
        res.status(500).send('Error fetching categories');
      } else {
        res.json(result);
      }
    });
  });

 // New post
  app.post('/createPost', (req, res) => {
    const { title, content, category, user_id} = req.body;
  
    db.query(
      "INSERT INTO posts (title, content, user_id, category_id) VALUES (?, ?, ?, ?)",
      [title, content, user_id, category],
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

