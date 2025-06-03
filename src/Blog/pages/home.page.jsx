import React, {useState, useEffect, useRef, useContext} from 'react'; // Added useRef
import { fakeLatestBlogsData, fakeTrendingBlogsData, allFakeBlogsPool } from './fake-data';
import AnimationWrapper from "@/Blog/Common2/page-animation.jsx";
import InPageNavigation, {activeTabRef} from "@/Blog/Component/inpage-navigation.component.jsx";
import Loader from "@/Blog/Component/loader.component.jsx";
import NoDataMessage from "@/Blog/Component/nodata.component.jsx";
import MinimalBlogPost from "@/Blog/Component/nobanner-blog-post.component.jsx";
import BlogPostCard from "@/Blog/Component/blog-post.component.jsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {UserContext} from "@/App.jsx";
import {storeInSession} from "@/Blog/Common2/session.jsx";
// If pasting directly, ensure the fake data generation code from above is here.
// For this example, I'll assume the data generation code is directly above this component.

const HomePage = () => {
    let categories = ["programming", "anime", "finance", "Travel", "Social media", "Cooking", "Tech", "Bollywood"];

    let [blogs, setBlogs] = useState(null);
    let [trendingBlogs, setTrendingBlogs] = useState(null);
    let [pageState, setPageState] = useState("home");

    // Use activeTabRef from the import if it's correctly exported and managed by InPageNavigation
    // If activeTabRef is local to InPageNavigation, you might need a different way to trigger the first tab
    // For now, assuming activeTabRef is accessible and works as intended.
    // If not, you might need to pass a ref to InPageNavigation or manage it internally.
    // If activeTabRef from import is problematic, you can manage one locally:
    // const localActiveTabRef = useRef();


    const fetchLatestBlogs = () => {
        console.log("Fetching latest blogs (fake)");
        setTimeout(() => {
            console.log("Received fake latest blogs:", fakeLatestBlogsData);
            setBlogs(fakeLatestBlogsData);
        }, 500); // Simulate network delay
    };

    const fetchTrendingBlogs = () => {
        console.log("Fetching trending blogs (fake)");
        setTimeout(() => {
            console.log("Received fake trending blogs:", fakeTrendingBlogsData);
            setTrendingBlogs(fakeTrendingBlogsData);
        }, 700); // Simulate network delay
    };

    const fetchBlogsByCategory = () => {
        console.log(`Workspaceing blogs for category: ${pageState} (fake)`);
        setTimeout(() => {
            const filteredBlogs = allFakeBlogsPool.filter(blog =>
                blog.tags.map(tag => tag.toLowerCase()).includes(pageState.toLowerCase())
            );
            console.log(`Received fake blogs for ${pageState}:`, filteredBlogs);
            setBlogs(filteredBlogs);
        }, 500); // Simulate network delay
    };

    const loadBlogByCategory = (e) => {
        let category = e.target.innerText.toLowerCase();
        setBlogs(null); // Show loader while "fetching"

        if (pageState === category) {
            setPageState('home'); // Go back to home if clicking current category
            return;
        }
        setPageState(category);
    };

    useEffect(() => {
        // Ensure the InPageNavigation's active tab is clicked/set correctly.
        // This depends on how activeTabRef is implemented and exported from InPageNavigation.
        // If it's a ref to a button, .click() should work.
        if (activeTabRef && activeTabRef.current && typeof activeTabRef.current.click === 'function') {
            activeTabRef.current.click();
        } else {
            console.warn("activeTabRef.current.click is not available. InPageNavigation might not initialize correctly.");
        }


        if (pageState === "home") {
            fetchLatestBlogs();
        } else {
            fetchBlogsByCategory();
        }

        if (!trendingBlogs) { // Fetch trending blogs only once
            fetchTrendingBlogs();
        }
    }, [pageState]); // Removed trendingBlogs from dependency array to avoid re-fetching if it's already loaded

    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* Main Content Area */}
                <div className="w-full">
                    {/* Pass the ref to InPageNavigation if it accepts one, e.g., ref={localActiveTabRef} */}
                    <InPageNavigation routes={[pageState, 'trending blogs']} defaultHidden={['trending blogs']}>
                        {/* Latest/Category Blogs Tab */}
                        <>
                            {blogs === null ? (
                                <Loader />
                            ) : blogs.length ? (
                                blogs.map((blog, i) => (
                                    <AnimationWrapper key={blog.blog_id || i} transition={{ duration: 1, delay: i * 0.1 }}>
                                        <BlogPostCard content={blog} author={blog.author.personal_info} />
                                    </AnimationWrapper>
                                ))
                            ) : (
                                <NoDataMessage message={`No Blogs published for "${pageState === "home" ? "latest" : pageState}"`} />
                            )}
                        </>

                        {/* Trending Blogs Tab */}
                        <>
                            {trendingBlogs === null ? (
                                <Loader />
                            ) : trendingBlogs.length ? (
                                trendingBlogs.map((blog, i) => (
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
                                        onClick={loadBlogByCategory}
                                        className={'tag ' + (pageState === category.toLowerCase() ? "bg-black text-white" : " ")}
                                        key={i}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Trending Blogs in Sidebar */}
                        <div>
                            <h1 className='font-medium text-xl mb-8'>
                                Trending Blogs
                                <i className='fi fi-rr-arrow-trend-up ml-2'></i>
                            </h1>
                            {trendingBlogs === null ? (
                                <Loader />
                            ) : trendingBlogs.length ? (
                                trendingBlogs.map((blog, i) => (
                                    <AnimationWrapper key={blog.blog_id || `side-trending-${i}`} transition={{ duration: 1, delay: i * 0.1 }}>
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