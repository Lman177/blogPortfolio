// src/pages/home.page.jsx

import React, {useState, useEffect} from 'react';
import AnimationWrapper from "@/Blog/Common2/page-animation.jsx";
import InPageNavigation from "@/Blog/Component/inpage-navigation.component.jsx";
import Loader from "@/Blog/Component/loader.component.jsx";
import NoDataMessage from "@/Blog/Component/nodata.component.jsx";
import BlogPostCard from "@/Blog/Component/blog-post.component.jsx";
import MinimalBlogPost from "@/Blog/Component/nobanner-blog-post.component.jsx";
import {getAllCategories, getAllPosts, getPostsByCategory} from "@/Blog/Common2/apiFunction.js";

const HomePage = () => {
    const [blogs, setBlogs] = useState(null);
    const [categories, setCategories] = useState([]);
    const [pageState, setPageState] = useState("home");
    const [trendingBlogs, setTrendingBlogs] = useState(null);
    // Hàm tải các bài viết mới nhất (cho trang chủ)
    const fetchLatestBlogs = async () => {
        setBlogs(null); // Hiển thị loader trước khi gọi API
        try {
            const blogsData = await getAllPosts(0, 5);
            setBlogs(blogsData.content);
        } catch (error) {
            console.error("Error fetching latest blogs:", error);
            setBlogs([]);
        }
    };
    const fetchLatestBlogs2 = async () => {
        setTrendingBlogs(null); // Hiển thị loader trước khi gọi API
        try {
            const blogsData = await getAllPosts(0, 5, "publishedAt,desc");
            setTrendingBlogs(blogsData.content);
        } catch (error) {
            console.error("Error fetching latest blogs:", error);
            setBlogs([]);
        }
    };

    // Hàm tải danh sách các category
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

    // Hàm tải bài viết theo category (được gọi khi click vào button)
    const loadBlogByCategory = async (categoryName) => {
        // Kiểm tra đầu vào hợp lệ
        if (!categoryName || typeof categoryName !== 'string') {
            console.error("Tên category không hợp lệ:", categoryName);
            return;
        }
        const category = categoryName.toLowerCase();

        // Nếu click vào category đang active, quay về trang chủ
        if (pageState === category) {
            setPageState('home');
            fetchLatestBlogs(); // Tải lại dữ liệu cho trang chủ
            return;
        }

        // Nếu click vào category mới
        setPageState(category);
        setBlogs(null); // Hiển thị loader

        try {
            const postsData = await getPostsByCategory(category);
            setBlogs(postsData.content);
        } catch (error) {
            console.error(`Không thể tải bài viết cho category: ${category}`, error);
            setBlogs([]);
        }
    };

    // FIX: useEffect chỉ chạy một lần khi component được mount để tải dữ liệu ban đầu
    useEffect(() => {
        fetchCategories();
        fetchLatestBlogs();
        fetchLatestBlogs2();
    }, []); // <-- Dependency rỗng đảm bảo nó chỉ chạy một lần

    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* Main Content Area */}
                <div className="w-full">
                    {/* routes[0] sẽ là pageState, ví dụ "home" hoặc "programming" */}
                    <InPageNavigation routes={[pageState, 'latest blogs']} defaultHidden={['latest blogs']}>
                        {/* Tab hiển thị bài viết theo category hoặc bài mới nhất */}
                        <>
                            {blogs === null ? (
                                <Loader />
                            ) : blogs.length ? (
                                blogs.map((blog, i) => (
                                    <AnimationWrapper key={blog.blog_id || i} transition={{ duration: 1, delay: i * 0.1 }}>
                                        <BlogPostCard content={blog} />
                                    </AnimationWrapper>
                                ))
                            ) : (
                                <NoDataMessage message={`No Blogs published for "${pageState === "home" ? "latest" : pageState}"`} />
                            )}
                        </>

                        {/* Tab Trending Blogs - Bạn có thể thêm logic fetch trending ở đây nếu cần */}
                        <>
                            {/* Phần này bạn có thể giữ nguyên hoặc thay đổi logic fetch cho trending blogs  */}
                            {blogs === null ? (
                                <Loader />
                            ) : blogs.length ? (
                                blogs.map((blog, i) => (
                                    <AnimationWrapper key={blog.blog_id || `trending-${i}`} transition={{ duration: 1, delay: i * 0.1 }}>
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
                        {/* Categories Filter */}
                        <div>
                            <h1 className='font-medium text-xl mb-8'>Stories for all interests</h1>
                            <div className='flex-wrap gap-3 flex'>
                                {categories.map((category, i) => (

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

                        {/* Trending Blogs in Sidebar */}
                        <div>
                            <h1 className='font-medium text-xl mb-8'>
                                Latest Blogs
                                <i className='fi fi-rr-arrow-trend-up ml-2'></i>
                            </h1>
                            {/* Phần này cũng sẽ hiển thị các bài viết từ state `blogs` */}
                            {trendingBlogs === null ? (
                                <Loader />
                            ) : trendingBlogs.length ? (
                                trendingBlogs.slice(0, 5).map((blog, i) => ( // Dùng slice để giới hạn số lượng nếu cần
                                    <AnimationWrapper key={blog.blog_id || `side-trending-${i}`} transition={{ duration: 1, delay: i * 0.1 }}>
                                        <MinimalBlogPost blog={blog} index={i} />
                                    </AnimationWrapper>
                                ))
                            ) : (
                                <NoDataMessage message="No Latest Blogs found" />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default HomePage;