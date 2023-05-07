const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');

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

app.get("/admins/:userId", (req, res) => {
  const userId = req.params.userId;
  
  // Query the admins table to check if the user is an admin
  db.query("SELECT * FROM admins WHERE user_id = ?", [userId], (err, result) => {
    if (err) {
      console.error("Error checking admin status:", err);
      res.status(500).json({ message: "Error checking admin status" });
    } else {
      res.json(result);
    }
  });
});

app.post('/changeName', (req, res) => {
  const userid = req.body.userid;
  const username = req.body.username;

  db.query(
    "UPDATE users SET user_name = ? WHERE user_id = ?",
    [username, userid],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "Error updating username" });
      } else {
        res.send({ message: "Username updated successfully" });
      }
    }
  );
});

app.post('/verifyAndUpdatePassword', (req, res) => {
  const { userid, currentPassword, newPassword } = req.body;

  // Retrieve the stored hash for the user's current password
  db.query("SELECT user_pwd FROM users WHERE user_id = ?", [userid], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error retrieving password hash' });
      return;
    }

    if (result.length === 0) {
      res.status(404).send({ message: 'User not found' });
      return;
    }

    const storedHash = result[0].user_pwd;

    // Verify the user's current password
    bcrypt.compare(currentPassword, storedHash, (err, isMatch) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: 'Error verifying current password' });
        return;
      }

      if (!isMatch) {
        res.send({ message: 'Incorrect current password' });
        return;
      }

      // Update the user's password
      bcrypt.hash(newPassword, saltRounds, (err, newHash) => {
        if (err) {
          console.error(err);
          res.status(500).send({ message: 'Error hashing new password' });
          return;
        }

        // Update the password hash in the database
        db.query("UPDATE users SET user_pwd = ? WHERE user_id = ?", [newHash, userid], (err, result) => {
          if (err) {
            console.error('Error updating password in database:', err);
            res.status(500).send({ message: 'Failed to update password' });
            return;
          }
          
          res.send({ message: 'Password updated successfully' });
        });
      });
    });
  });
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

app.get("/market_posts", (req, res) => {
  const page = req.query.page || 0;
  const pageSize = req.query.pageSize || 7;
  const category = req.query.category || "";
  const sort = req.query.sort || "newest";
  const user_id = req.query.user_id || "";
  const searchTitle = req.query.searchTitle || "";
  const realPageSize = pageSize * 1;
  const offset = page * pageSize;
  let query = "SELECT market_posts.post_id, market_posts.title, market_posts.price, market_posts.content, market_posts.user_id, market_posts.category_id, market_posts.created_time, market_posts.updated_time, users.user_name FROM market_posts INNER JOIN users ON market_posts.user_id = users.user_id";
  let countQuery = "SELECT * FROM market_posts";
  const params = [];
  const countParams = [];

  if (category) {
    if (category == "my-posts"){
      query += " WHERE market_posts.user_id = ?";
      countQuery += " WHERE market_posts.user_id = ?";
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
      console.error("Error fetching market_posts:", err);
      res.status(500).send("Error fetching market_posts");
    } else {
      db.query(countQuery, countParams, (err, countResult) => {
        if (err) {
          console.error("Error fetching market_posts count:", err);
          res.status(500).send("Error fetching market_posts count");
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

  app.get("/market_posts/:post_id", (req, res) => {
    const postId = req.params.post_id;
    db.query("SELECT market_posts.post_id, market_posts.title, market_posts.price, market_posts.content, market_posts.user_id, market_posts.category_id, market_posts.created_time, market_posts.updated_time, users.user_name FROM market_posts INNER JOIN users ON market_posts.user_id = users.user_id WHERE post_id = ?", [postId], (err, result) => {
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

  app.get('/market_posts/:postId/replies', (req, res) => {
    const postId = req.params.postId;
    db.query('SELECT market_replies.reply_id, market_replies.content, market_replies.user_id, market_replies.created_time, market_replies.updated_time, market_replies.post_id, users.user_name FROM market_replies INNER JOIN users ON market_replies.user_id = users.user_id WHERE market_replies.post_id = ?', [postId], (err, result) => {
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
    
    db.query('SELECT * FROM posts WHERE post_id = ?', [postId], (err, result) => {
      if (err) {
        console.error('Error checking post:', err);
        res.status(500).send('Error checking post');
      } else {
        const post = result[0];
        if (!post) {
          res.status(404).send('Post not found');
        } else {
          db.query('INSERT INTO replies (content, user_id, post_id) VALUES (?, ?, ?)', [content, userId, postId], (err, result) => {
            if (err) {
              console.error('Error inserting reply:', err);
              res.status(500).send('Error inserting reply');
            } else {
              res.json(result);
            }
          });
        }
      }
    });
  });

  app.post('/market_posts/:postId/replies', (req, res) => {
    const postId = req.params.postId;
    const content = req.body.content;
    const userId = req.body.userId;
    
    db.query('SELECT * FROM market_posts WHERE post_id = ?', [postId], (err, result) => {
      if (err) {
        console.error('Error checking market_posts:', err);
        res.status(500).send('Error checking market_posts');
      } else {
        const post = result[0];
        if (!post) {
          res.status(404).send('Post not found');
        } else {
          db.query('INSERT INTO market_replies (content, user_id, post_id) VALUES (?, ?, ?)', [content, userId, postId], (err, result) => {
            if (err) {
              console.error('Error inserting market_replies:', err);
              res.status(500).send('Error inserting market_replies');
            } else {
              res.json(result);
            }
          });
        }
      }
    });
  });

  app.delete('/replies/:replyId', (req, res) => {
    const replyId = req.params.replyId;
  
    // Execute the query to remove the reply with the given replyId
    db.query('DELETE FROM replies WHERE reply_id = ?', [replyId], (err, result) => {
      if (err) {
        console.error('Error removing reply:', err);
        res.status(500).send('Error removing reply');
      } else {
        res.status(200).send('Reply removed successfully');
      }
    });
  });

  app.delete('/market_replies/:replyId', (req, res) => {
    const replyId = req.params.replyId;
  
    // Execute the query to remove the reply with the given replyId
    db.query('DELETE FROM market_replies WHERE reply_id = ?', [replyId], (err, result) => {
      if (err) {
        console.error('Error removing reply:', err);
        res.status(500).send('Error removing reply');
      } else {
        res.status(200).send('Reply removed successfully');
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

  app.get('/market_categories', (req, res) => {
    db.query('SELECT * FROM market_category', (err, result) => {
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

  app.post('/market_createPost', (req, res) => {
    const { title, price, content, category, user_id} = req.body;
  
    db.query(
      "INSERT INTO market_posts (title, price, content, user_id, category_id) VALUES (?, ?, ?, ?, ?)",
      [title, price, content, user_id, category],
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

  //remove post
  app.delete('/posts/:postId', (req, res) => {
    const postId = req.params.postId;
  
 
          // User is authorized, proceed with removing the post and its replies
          db.query('DELETE FROM replies WHERE post_id = ?', [postId], (err, result) => {
            if (err) {
              console.error('Error removing replies:', err);
              res.status(500).send('Error removing replies');
            } else {
              db.query('DELETE FROM posts WHERE post_id = ?', [postId], (err, result) => {
                if (err) {
                  console.error('Error removing post:', err);
                  res.status(500).send('Error removing post');
                } else {
                  res.status(200).send('Post removed successfully');
                }
              });
            }
          });
  });

  app.delete('/market_posts/:postId', (req, res) => {
    const postId = req.params.postId;
  
 
          // User is authorized, proceed with removing the post and its replies
          db.query('DELETE FROM market_replies WHERE post_id = ?', [postId], (err, result) => {
            if (err) {
              console.error('Error removing market_replies:', err);
              res.status(500).send('Error removing market_replies');
            } else {
              db.query('DELETE FROM market_posts WHERE post_id = ?', [postId], (err, result) => {
                if (err) {
                  console.error('Error removing market_post:', err);
                  res.status(500).send('Error removing market_post');
                } else {
                  res.status(200).send('Market_Post removed successfully');
                }
              });
            }
          });
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

