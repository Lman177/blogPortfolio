// src/pages/home.page.jsx

import React, {useState, useEffect, useCallback} from 'react';
import AnimationWrapper from "@/Blog/Common2/page-animation.jsx";
import InPageNavigation from "@/Blog/Component/inpage-navigation.component.jsx";
import Loader from "@/Blog/Component/loader.component.jsx";
import NoDataMessage from "@/Blog/Component/nodata.component.jsx";
import BlogPostCard from "@/Blog/Component/blog-post.component.jsx";
import MinimalBlogPost from "@/Blog/Component/nobanner-blog-post.component.jsx";
import {getAllCategories, getAllPosts, getPostsByCategory} from "@/Blog/Common2/apiFunction.js";

const PAGE_SIZE = 5;

const HomePage = () => {
    const [blogs, setBlogs] = useState(null);
    const [trendingBlogs, setTrendingBlogs] = useState(null);
    const [categories, setCategories] = useState([]);
    const [pageState, setPageState] = useState("home");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchLatestBlogs = useCallback(async (pageToFetch = 0) => {
        setBlogs(null);
        try {
            const blogsData = await getAllPosts(pageToFetch, PAGE_SIZE);
            setBlogs(blogsData.content);
            setTotalPages(blogsData.totalPages);
            setCurrentPage(blogsData.number);
        } catch (error) {
            console.error("Error fetching latest blogs:", error);
            setBlogs([]);
            setTotalPages(0);
        }
    }, []);

    const fetchTrendingSidebarBlogs = async () => {
        setTrendingBlogs(null);
        try {
            const blogsData = await getAllPosts(0, 5, "publishedAt,desc");
            setTrendingBlogs(blogsData.content);
        } catch (error) {
            console.error("Error fetching trending/sidebar blogs:", error);
            setTrendingBlogs([]);
        }
    };

    const fetchCategories = async () => {
        try {
            const categoriesData = await getAllCategories();
            const categoryNames = categoriesData.content.map(category => category.name);
            setCategories(categoryNames);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        }
    };

    const loadBlogByCategory = useCallback(async (categoryName, pageToFetch = 0) => {
        if (!categoryName || typeof categoryName !== 'string') {
            console.error("Tên category không hợp lệ:", categoryName);
            return;
        }
        const category = categoryName.toLowerCase();
        if (pageState === category && pageToFetch === 0) {
            setPageState('home');
            return;
        }
        setPageState(category);
        setBlogs(null);
        try {
            const postsData = await getPostsByCategory(category, pageToFetch, PAGE_SIZE);
            setBlogs(postsData.content);
            setTotalPages(postsData.totalPages);
            setCurrentPage(postsData.number);
        } catch (error) {
            console.error(`Không thể tải bài viết cho category: ${category} on page ${pageToFetch}`, error);
            setBlogs([]);
            setTotalPages(0);
        }
    }, [pageState]);

    // Hàm xử lý khi nhấn nút "Previous Page"
    const handlePreviousPage = () => {
        if (currentPage > 0) {
            const prevPageToFetch = currentPage - 1;
            if (pageState === 'home') {
                fetchLatestBlogs(prevPageToFetch);
            } else {
                loadBlogByCategory(pageState, prevPageToFetch);
            }
        }
    };

    const handleNextPage = () => {
        if (currentPage + 1 < totalPages) {
            const nextPageToFetch = currentPage + 1;
            if (pageState === 'home') {
                fetchLatestBlogs(nextPageToFetch);
            } else {
                loadBlogByCategory(pageState, nextPageToFetch);
            }
        }
    };

    useEffect(() => {
        if (pageState === "home") {
            fetchLatestBlogs(0);
        } else {
            loadBlogByCategory(pageState, 0);
        }
    }, [pageState, fetchLatestBlogs, loadBlogByCategory]);

    useEffect(() => {
        fetchCategories();
        fetchTrendingSidebarBlogs();
    }, []);

    // Tailwind CSS classes for pagination buttons
    const paginationButtonCommonStyle = "px-4 py-2 rounded transition-colors text-sm sm:text-base";
    const paginationButtonActiveStyle = "bg-black text-white hover:bg-opacity-90";
    const paginationButtonDisabledStyle = "bg-gray-200 text-gray-500 cursor-not-allowed";


    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                <div className="w-full">
                    <InPageNavigation routes={[pageState, 'trending posts']} defaultHidden={['trending posts']}>
                        {/* Tab 1: Bài viết theo trang chủ hoặc category */}
                        <>
                            {blogs === null ? (
                                <Loader />
                            ) : blogs.length ? (
                                <>
                                    {blogs.map((blog, i) => (
                                        <AnimationWrapper key={blog.id || blog.blog_id || i} transition={{ duration: 1, delay: i * 0.1 }}>
                                            <BlogPostCard content={blog} />
                                        </AnimationWrapper>
                                    ))}

                                    {/* Pagination Controls START */}
                                    {totalPages > 0 && (
                                        <div className="flex justify-center items-center gap-x-3 sm:gap-x-4 mt-8 mb-4">
                                            {/* Previous Button */}
                                            <button
                                                onClick={handlePreviousPage}
                                                disabled={currentPage === 0}
                                                className={`${paginationButtonCommonStyle} ${currentPage === 0 ? paginationButtonDisabledStyle : paginationButtonActiveStyle}`}
                                            >
                                                Previous
                                            </button>

                                            {/* Page Info */}
                                            <span className="text-sm text-dark-grey whitespace-nowrap">
                                                Page {currentPage + 1} of {totalPages}
                                            </span>

                                            {/* Next Button */}
                                            <button
                                                onClick={handleNextPage}
                                                disabled={currentPage >= totalPages - 1}
                                                className={`${paginationButtonCommonStyle} ${currentPage >= totalPages - 1 ? paginationButtonDisabledStyle : paginationButtonActiveStyle}`}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                    {/* Pagination Controls END */}
                                </>
                            ) : (
                                <NoDataMessage message={`No Blogs published for "${pageState === "home" ? "latest" : pageState}"`} />
                            )}
                        </>

                        {/* Tab 2: Trending Posts */}
                        <>
                            {trendingBlogs === null ? (
                                <Loader />
                            ) : trendingBlogs.length ? (
                                trendingBlogs.map((blog, i) => (
                                    <AnimationWrapper key={blog.id || blog.blog_id || `trending-${i}`} transition={{ duration: 1, delay: i * 0.1 }}>
                                        <MinimalBlogPost blog={blog} index={i} />
                                    </AnimationWrapper>
                                ))
                            ) : (
                                <NoDataMessage message="No Trending Blogs found" />
                            )}
                        </>
                    </InPageNavigation>
                </div>

                {/* Sidebar */}
                <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
                    <div className='flex flex-col gap-10'>
                        <div>
                            <h1 className='font-medium text-xl mb-8'>Stories for all interests</h1>
                            <div className='flex-wrap gap-3 flex'>
                                {categories.map((category) => (
                                    <button
                                        onClick={() => loadBlogByCategory(category)}
                                        className={'tag ' + (pageState === category.toLowerCase() ? "bg-black text-white" : " ")}
                                        key={category}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h1 className='font-medium text-xl mb-8'>
                                Trending Posts
                                <i className='fi fi-rr-arrow-trend-up ml-2'></i>
                            </h1>
                            {trendingBlogs === null ? (
                                <Loader />
                            ) : trendingBlogs.length ? (
                                trendingBlogs.slice(0, 5).map((blog, i) => (
                                    <AnimationWrapper key={blog.id || blog.blog_id || `side-trending-${i}`} transition={{ duration: 1, delay: i * 0.1 }}>
                                        <MinimalBlogPost blog={blog} index={i} />
                                    </AnimationWrapper>
                                ))
                            ) : (
                                <NoDataMessage message="No Trending Blogs found" />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default HomePage;