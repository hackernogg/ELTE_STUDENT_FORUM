import { useState, useEffect } from "react";
import BlogList from "./MarketList";
import Axios from "axios";

const Market = () => {
  const [blogs, setBlogs] = useState([]);
  const [pageNumber, setPageNumber] = useState(parseInt(sessionStorage.getItem("market_pageNumber"), 10)|| 0);
  const [pageCount,setPageCount] = useState(0);
  const [postsPerPage] = useState(7);
  const [selectedCategory, setSelectedCategory] = useState(sessionStorage.getItem("market_selectedCategory") || "");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState(sessionStorage.getItem("market_sortBy") || "newest");
  const [searchTitle, setSearchTitle] = useState("");
  const storedUserid = localStorage.getItem("loggedInUserid");

  useEffect(() => {
    Axios.get(`http://localhost:3001/market_posts?page=${pageNumber}&pageSize=${postsPerPage}&category=${selectedCategory}&sort=${sortBy}&user_id=${storedUserid}&searchTitle=${searchTitle}`)
      .then((response) => {
        setBlogs(response.data.posts); // Update to set the blogs from the 'posts' property in the response data
        setPageCount(Math.max(1, Math.ceil(response.data.totalCount / postsPerPage)));
        if (pageNumber>Math.max(1, Math.ceil(response.data.totalCount / postsPerPage))-1){
          setPageNumber(Math.max(1, Math.ceil(response.data.totalCount / postsPerPage))-1);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, [pageNumber, postsPerPage, selectedCategory, sortBy, storedUserid, searchTitle]);

  useEffect(() => {
    Axios.get("http://localhost:3001/market_categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    sessionStorage.setItem('market_selectedCategory', selectedCategory);
    sessionStorage.setItem('market_sortBy', sortBy);
    sessionStorage.setItem('market_pageNumber', pageNumber);
  },[selectedCategory, sortBy, pageNumber, pageCount]);

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
  
  const renderPaginationButtons = () => {

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
    <div className= "home">
      <input type="text" onChange={handleSearchChange} placeholder="Search" />
      <div className="controls">
        <div className="filter-bar">
          <select className="category-select" id="category" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_type}
              </option>
            ))}
            <option value="my-posts">My Posts</option>
          </select>
        </div>
        <button className="sort-button" onClick={handleSortToggle}>{sortBy}</button>
      </div>
      <BlogList blogs={blogs} />
      {renderPaginationButtons()}
    </div>
  );
};

export default Market;