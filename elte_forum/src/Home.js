import { useState, useEffect } from "react";
import BlogList from "./BlogList";
import Axios from "axios";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(7);
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    Axios.get(`http://localhost:3001/posts?page=${pageNumber}&pageSize=${postsPerPage}`)
      .then((response) => {
        setBlogs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, [pageNumber, postsPerPage]);

  useEffect(() => {
    Axios.get("http://localhost:3001/posts/count")
      .then((response) => {
        setTotalCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching post count:", error);
      });
  }, []);

  const pageCount = Math.ceil(totalCount / postsPerPage);

  const handlePageClick = (pageNumber) => {
    setPageNumber(pageNumber);
    
  };

  const pageNumbers = [];
  for (let i = 0; i < pageCount; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="home">
      <BlogList blogs={blogs} title="All Blogs!" />

      <div className="pagination">
        {pageNumbers.map((number) => (
          <button key={number} onClick={() => handlePageClick(number)}>
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;