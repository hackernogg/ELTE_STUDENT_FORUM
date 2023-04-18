import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Axios from "axios";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    console.log(id);
    Axios.get(`http://localhost:3001/posts/${id}`)
      .then((response) => {
        setBlog(response.data);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
      });
  }, [id]);

  return (
    <div className="blog-details">
      {blog ? (
        <>
          <h2>{blog.title}</h2>
          <p>Written by {blog.user_name}</p>
          <p>Created time {blog.created_time}</p>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default BlogDetails;