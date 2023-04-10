import { Link } from "react-router-dom";

const BlogList = ({ blogs, title, handleDelete }) => {
  return (
    <div className="blog-list">
      <h2>{title}</h2>
      {blogs.map((blog) => (
        <div className="blog-preview" key={blog.post_id}>
          <Link to={`/blogs/${blog.post_id}`}>
            <h2>{blog.title}</h2>
          </Link>
          <p>Written by {blog.user_name}</p>
          <p>Created time {blog.created_time}</p>
          <button onClick={() => handleDelete(blog.id)}>delete blog</button>
        </div>
      ))}
    </div>
  );
};

export default BlogList;