import { useState, useEffect } from "react";
import BlogList from "./BlogList";
import Axios from "axios";

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  const [name, setName] = useState("mario");

  const handleDelete = (id) => {
    const newBlogs = blogs.filter((blog) => blog.id !== id);
    setBlogs(newBlogs);
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/posts")
      .then((response) => {
        setBlogs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  useEffect(() => {
    console.log("use effect ran");
    console.log(name);
  }, [name]);

  return (
    <div className="home">
      <BlogList blogs={blogs} title="All Blogs!" handleDelete={handleDelete} />
      <button onClick={() => setName("luigi")}>change name</button>
      <p>{name}</p>
    </div>
  );
};

export default Home;

