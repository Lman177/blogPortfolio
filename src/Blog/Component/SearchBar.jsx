import React, { useState, useRef } from "react";
import {getAllPosts, getPostByKeyWord} from "../Common2/apiFunction";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const timerRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    setShowResults(!!value);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (value.trim() === "") {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(() => {
      searchPosts(value);
    }, 2000);
  };

  const searchPosts = async (kw) => {
    try {
      // Assuming backend supports 'search' param in getAllPosts
      const data = await getPostByKeyWord(0, 5, "", kw);
      setResults(data.content || []);
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowResults(false), 200); // Delay to allow click
  };

  return (
    <div className="relative w-full md:w-auto">
      <input
        type="text"
        placeholder="Search"
        className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
        value={keyword}
        onChange={handleChange}
        onFocus={() => setShowResults(!!keyword)}
        onBlur={handleBlur}
      />
      <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
      {showResults && (
        <div className="absolute left-0 w-full bg-white shadow-lg rounded-b-lg z-50 mt-1 max-h-80 overflow-y-auto border border-gray-200">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-400">No results found.</div>
          ) : (
            results.map((post) => (
              <Link
                key={post.id || post.slug}
                to={`/blog/${post.slug}`}
                className="block px-4 py-3 hover:bg-gray-100 border-b last:border-b-0 border-gray-200 text-left"
                onClick={() => setShowResults(false)}
              >
                <div className="font-semibold text-gray-900 line-clamp-1">{post.title}</div>
                <div className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

