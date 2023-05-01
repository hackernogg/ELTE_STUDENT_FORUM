import { Link } from "react-router-dom";

const BlogList = ({ blogs }) => {
  return (
    <div className="blog-list">
      {blogs.map((blog) => (
        <Link key={blog.post_id} to={`/blogs/${blog.post_id}`}>
          <div className="blog-preview" key={blog.post_id}>
            <h2>{blog.title}</h2>
            <div className="preview-info">
              <p>Written by {blog.user_name}</p>
              <p>Created time: {new Date(blog.created_time).toLocaleString()}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BlogList;