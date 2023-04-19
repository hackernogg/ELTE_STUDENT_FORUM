import { Link } from "react-router-dom";

const BlogList = ({ blogs, title }) => {
  return (
    <div className="blog-list">
      <h2>{title}</h2>
      {blogs.map((blog) => (
        <Link key={blog.post_id} to={`/blogs/${blog.post_id}`}>
          <div className="blog-preview" key={blog.post_id}>
            <h2>{blog.title}</h2>
            <p>Written by {blog.user_name}</p>
            <p>Created time {blog.created_time}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BlogList;