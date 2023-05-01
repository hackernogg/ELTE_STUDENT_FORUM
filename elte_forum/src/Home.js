import { useState, useEffect } from "react";
import BlogList from "./BlogList";
import Axios from "axios";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(7);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [searchTitle, setSearchTitle] = useState("");
  const storedUserid = localStorage.getItem("loggedInUserid");

  useEffect(() => {
    Axios.get(`http://localhost:3001/posts?page=${pageNumber}&pageSize=${postsPerPage}&category=${selectedCategory}&sort=${sortBy}&user_id=${storedUserid}&searchTitle=${searchTitle}`)
      .then((response) => {
        setBlogs(response.data.posts); // Update to set the blogs from the 'posts' property in the response data
        setTotalCount(response.data.totalCount); // Set the total count of posts
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, [pageNumber, postsPerPage, selectedCategory, sortBy, searchTitle]);

  useEffect(() => {
    Axios.get("http://localhost:3001/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchTitle(e.target.value);
    setPageNumber(0);
  };


  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPageNumber(0); // Reset page number when category changes
  };

  const handleSortToggle = () => {
    setSortBy((prevSortBy) => (prevSortBy === "newest" ? "oldest" : "newest"));
  };

  const handlePageClick = (pageNumber) => {
    setPageNumber(pageNumber);
  };


  let pageCount = Math.ceil(totalCount / postsPerPage);

  const renderPaginationButtons = () => {
    if (pageCount<=0){
      pageCount = 1
    }
    const isFirstPage = pageNumber === 0;
    const isLastPage = pageNumber === pageCount - 1;

    return (
      <div className="pagination">
        <button onClick={() => handlePageClick(0)} disabled={isFirstPage}>
          Page 1
        </button>
        <button onClick={() => handlePageClick(pageNumber - 1)} disabled={isFirstPage}>
          ⮨
        </button>
        <span>Page {pageNumber + 1}</span>
        <button onClick={() => handlePageClick(pageNumber + 1)} disabled={isLastPage}>
          ⮩
        </button>
        <button onClick={() => handlePageClick(pageCount - 1)} disabled={isLastPage}>
          Page {pageCount}
        </button>
      </div>
    );
  };

  return (
    <div className="home">
      <input type="text" onChange={handleSearchChange} placeholder="Search" />
      <div className="filter-bar">
        <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_type}
            </option>
          ))}
          <option value="my-posts">My Posts</option>
        </select>
      </div>
      <button onClick={handleSortToggle}>{sortBy}</button>
      <BlogList blogs={blogs} />
      {renderPaginationButtons()}
    </div>
  );
};

export default Home;