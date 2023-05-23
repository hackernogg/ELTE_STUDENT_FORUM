CREATE DATABASE elte_forum_db;
use elte_forum_db;

CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_pwd VARCHAR(255) NOT NULL
);

CREATE TABLE admins (
  user_id VARCHAR(255) NOT NULL PRIMARY KEY
);

CREATE TABLE posts (
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  user_id VARCHAR(255),
  category_id INT,
  created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (category_id) REFERENCES post_category(category_id)
);

CREATE TABLE market_posts (
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  user_id VARCHAR(255),
  category_id INT,
  price INT NOT NULL,
  created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (category_id) REFERENCES market_category(category_id)
);


CREATE TABLE post_category (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_type VARCHAR(255) NOT NULL
);

CREATE TABLE market_category (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_type VARCHAR(255) NOT NULL
);

CREATE TABLE replies (
  reply_id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  user_id VARCHAR(255),
  created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  post_id INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id)
);

CREATE TABLE market_replies (
  reply_id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  user_id VARCHAR(255),
  created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  post_id INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (post_id) REFERENCES market_posts(post_id)
);


INSERT INTO admins (user_id) VALUES ('admin');

INSERT INTO post_category (category_type) VALUES
  ('Studies'),
  ('Tips'),
  ('Events'),
  ('Games'),
  ('Others');


INSERT INTO market_category (category_type) VALUES
  ('Electronics'),
  ('Books'),
  ('Clothing'),
  ('Furniture'),
  ('Instruments'),
  ('Others');

pm2 stop all
pm2 restart index.js

ubuntu
mysql -u root -p

sudo systemctl start nginx 
sudo systemctl stop nginx 
sudo systemctl restart nginx

SELECT replies.reply_id, replies.content, replies.user_id, replies.created_time, replies.updated_time, users.user_name
FROM replies
INNER JOIN users ON replies.user_id = users.user_id;



TABLE users {
    user_id VARCHAR(255)
    user_name VARCHAR(255)
    user_pwd VARCHAR(255)
}

TABLE posts {
  post_id INT
  title VARCHAR(255)
  content TEXT
  user_id VARCHAR(255)
  category_id INT
  created_time TIMESTAMP
  updated_time TIMESTAMP
}

TABLE market_posts {
  post_id INT
  title VARCHAR(255)
  content TEXT
  user_id VARCHAR(255)
  category_id INT
  price INT
  created_time TIMESTAMP
  updated_time TIMESTAMP
}

TABLE post_category {
  category_id INT
  category_type VARCHAR(255)
}

TABLE market_category {
  category_id INT
  category_type VARCHAR(255)
}

TABLE replies {
  reply_id INT
  content TEXT
  user_id VARCHAR(255)
  created_time TIMESTAMP
  updated_time TIMESTAMP
  post_id INT
}

TABLE market_replies {
  reply_id INT
  content TEXT
  user_id VARCHAR(255)
  created_time TIMESTAMP
  updated_time TIMESTAMP 
  post_id INT
}
TABLE admins {
  user_id VARCHAR(255)
}
