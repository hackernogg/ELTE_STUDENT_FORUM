import { useState, useEffect } from "react";
import BlogList from "./BlogList";
import Axios from "axios";

const Home = () => {
  const [blogs, setBlogs] = useState([]);


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



  return (
    <div className="home">
      <BlogList blogs={blogs} title="All Blogs!" handleDelete={handleDelete} />
    </div>
  );
};

export default Home;

