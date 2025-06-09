import React, { useState, useEffect, useCallback } from 'react';
import AnimationWrapper from "@/Blog/Common2/page-animation.jsx";
import InPageNavigation from "@/Blog/Component/inpage-navigation.component.jsx";
import Loader from "@/Blog/Component/loader.component.jsx";
import NoDataMessage from "@/Blog/Component/nodata.component.jsx";
import BlogPostCard from "@/Blog/Component/blog-post.component.jsx";
import MinimalBlogPost from "@/Blog/Component/nobanner-blog-post.component.jsx";
import { getAllCategories, getAllPosts, getPostsByCategory } from "@/Blog/Common2/apiFunction.js";

const PAGE_SIZE = 5;

const HomePage = () => {
    const [blogs, setBlogs] = useState(null);
    const [trendingBlogs, setTrendingBlogs] = useState(null);
    const [categories, setCategories] = useState([]);
    const [pageState, setPageState] = useState("home"); // "home" hoặc tên category
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const updateBlogState = useCallback((data) => {
        setBlogs(data.content);
        setTotalPages(data.totalPages);
        setCurrentPage(data.number);
    }, []);

    const fetchLatestBlogs = useCallback(async (pageToFetch = 0) => {
        setBlogs(null); // Show loader
        try {
            const blogsData = await getAllPosts(pageToFetch, PAGE_SIZE);
            updateBlogState(blogsData);
        } catch (error) {
            console.error("Error fetching latest blogs:", error);
            setBlogs([]);
            setTotalPages(0);
            setCurrentPage(0);
        }
    }, [updateBlogState]);

    const fetchTrendingSidebarBlogs = useCallback(async () => {
        setTrendingBlogs(null); // Show loader
        try {
            const blogsData = await getAllPosts(0, 5, "publishedAt,desc");
            setTrendingBlogs(blogsData.content);
        } catch (error) {
            console.error("Error fetching trending/sidebar blogs:", error);
            setTrendingBlogs([]);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const categoriesData = await getAllCategories();
            const categoryNames = categoriesData.content.map(category => category.name);
            setCategories(categoryNames);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        }
    }, []);

    // HÀM TẢI DỮ LIỆU CHÍNH DỰA TRÊN pageState VÀ pageToFetch
    const loadContentBasedOnPageState = useCallback(async (currentState, pageToFetch) => {
        setBlogs(null); // Luôn hiển thị loader khi tải nội dung mới

        if (currentState === "home") {
            await fetchLatestBlogs(pageToFetch);
        } else {
            // Đảm bảo category hợp lệ trước khi gọi API
            if (!currentState || typeof currentState !== 'string') {
                console.error("Invalid category name in pageState:", currentState);
                setBlogs([]);
                setTotalPages(0);
                setCurrentPage(0);
                return;
            }
            try {
                const postsData = await getPostsByCategory(currentState, pageToFetch, PAGE_SIZE);
                updateBlogState(postsData);
            } catch (error) {
                console.error(`Failed to load posts for category: "${currentState}" on page ${pageToFetch}`, error);
                setBlogs([]);
                setTotalPages(0);
                setCurrentPage(0);
            }
        }
    }, [fetchLatestBlogs, updateBlogState]); // Dependencies

    // HÀM XỬ LÝ KHI CLICK VÀO BUTTON CATEGORY
    const handleCategoryClick = useCallback((categoryName) => {
        const normalizedCategory = categoryName.toLowerCase();
        // Nếu click vào category đang active, hoặc nếu đã ở category đó và click lại trang 0,
        // thì chuyển về home. Ngược lại, set pageState là category mới.
        if (pageState === normalizedCategory) {
            setPageState('home');
        } else {
            setPageState(normalizedCategory);
        }
        setCurrentPage(0); // Luôn reset về trang đầu khi đổi category hoặc về home
    }, [pageState]); // Dependency on pageState

    // Hàm xử lý khi nhấn nút "Previous Page"
    const handlePreviousPage = useCallback(() => {
        if (currentPage > 0) {
            loadContentBasedOnPageState(pageState, currentPage - 1);
        }
    }, [currentPage, pageState, loadContentBasedOnPageState]);

    const handleNextPage = useCallback(() => {
        if (currentPage + 1 < totalPages) {
            loadContentBasedOnPageState(pageState, currentPage + 1);
        }
    }, [currentPage, totalPages, pageState, loadContentBasedOnPageState]);

    // Effect chính để tải dữ liệu khi pageState hoặc currentPage thay đổi
    useEffect(() => {
        // Khi pageState thay đổi hoặc khi chuyển trang, tải nội dung tương ứng
        loadContentBasedOnPageState(pageState, currentPage);
    }, [pageState, currentPage, loadContentBasedOnPageState]); // Dependencies

    // Effect để fetch categories và trending blogs một lần khi component được mount
    useEffect(() => {
        fetchCategories();
        fetchTrendingSidebarBlogs();
    }, [fetchCategories, fetchTrendingSidebarBlogs]);

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
                                        onClick={() => handleCategoryClick(category)} // Dùng hàm mới handleCategoryClick
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