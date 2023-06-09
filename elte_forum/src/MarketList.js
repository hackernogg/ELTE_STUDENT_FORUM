import { Link } from "react-router-dom";

const PostList = ({ posts }) => {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <Link key={post.post_id} to={`/market_posts/${post.post_id}`} style={{ textDecoration: "none" }}>
          <div className="post-preview" key={post.post_id}>
            <h2>{post.title}</h2>
            <div className="preview-info">
              <div className="price-box">
                <p className="price">{post.price} HUF</p>
                <p>Written by {post.user_name}</p>
              </div>
              <p>Created time: {new Date(post.created_time).toLocaleString()}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostList;