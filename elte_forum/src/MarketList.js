import { Link } from "react-router-dom";

const BlogList = ({ blogs }) => {
  return (
    <div className="blog-list">
      {blogs.map((blog) => (
        <Link key={blog.post_id} to={`/market_blogs/${blog.post_id}`} style={{ textDecoration: "none" }}>
          <div className="blog-preview" key={blog.post_id}>
            <h2>{blog.title}</h2>
            <div className="preview-info">
              <div className="price-box">
                <p className="price">{blog.price} HUF</p>
                <p>Written by {blog.user_name}</p>
              </div>
              <p>Created time: {new Date(blog.created_time).toLocaleString()}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BlogList;