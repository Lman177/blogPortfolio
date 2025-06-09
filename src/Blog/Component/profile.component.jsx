import React, {useCallback, useContext, useState, useEffect} from 'react';
import {UserContext} from "@/App.jsx";
import {getAllPosts} from "@/Blog/Common2/apiFunction.js";
import {useNavigate} from 'react-router-dom';
import {formatDate} from "@/Blog/Common2/date.jsx"; // Import useNavigate để điều hướng
import Img from '@assets/background.png'
const ProfileComponent = () => {
    const { userAuth } = useContext(UserContext);
    const [blogs, setBlogs] = useState(null);
    const navigate = useNavigate(); // Khởi tạo hook navigate

    // Giải nén thông tin người dùng từ context và cung cấp giá trị mặc định
    const { email, username, picture } = userAuth || {
        email: 'your.email@example.com',
        username: 'Your Name',
        picture: {Img}
    };

    const fetchAllBlogs = useCallback(async () => {
        setBlogs(null); // Đặt lại blogs về null để hiển thị trạng thái tải
        try {
            // Lấy tất cả bài viết. Bạn có thể muốn lọc theo người dùng nếu API hỗ trợ.
            const blogsData = await getAllPosts(0, 10, "publishedAt,desc"); // Tăng số lượng bài viết để hiển thị nhiều hơn
            setBlogs(blogsData.content);
        } catch (error) {
            console.error("Error fetching user blogs:", error);
            setBlogs([]); // Đặt thành mảng rỗng nếu có lỗi
        }
    }, []);

    useEffect(() => {
        fetchAllBlogs();
    }, [fetchAllBlogs]);

    const handleBlogClick = (blogId) => {
        // Chuyển hướng đến trang chỉnh sửa blog với ID của blog
        navigate(`/blog/${blogId}`);

    };

    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100 p-6 md:p-10 font-sans"> {/* Cải thiện padding tổng thể */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
                {/* Phần thông tin cá nhân bên trái */}
                <div className="md:w-1/3 flex-shrink-0 p-6 bg-neutral-800 rounded-lg shadow-xl flex flex-col items-center border border-neutral-700"> {/* Cải thiện shadow, border và chống co rút */}
                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-neutral-600 mb-6">
                        <img
                            src={Img}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/000000/FFFFFF?text=Error'; }} // Fallback nếu ảnh lỗi
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-50 mb-2">{email}</h1>
                    <p className="text-lg text-neutral-400 mb-4">{username}</p>
                    <div className="text-center text-neutral-300 border-t border-neutral-700 pt-4 mt-4 w-full"> {/* Thêm đường phân cách và padding */}
                        <p className="text-sm">
                            Chào mừng đến với trang profile của tôi! Ở đây bạn có thể tìm thấy thông tin cá nhân và các bài viết gần đây của tôi.
                        </p>
                        {/* Thêm một phần giới thiệu ngắn (bio) */}
                        <p className="text-xs text-neutral-500 mt-2 italic">
                            "Mỗi dòng code là một câu chuyện, mỗi dự án là một cuộc phiêu lưu."
                        </p>
                    </div>
                </div>

                {/* Phần bài viết bên phải */}
                <div className="md:w-2/3 p-6 bg-neutral-800 rounded-lg shadow-xl border border-neutral-700"> {/* Cải thiện shadow và border */}
                    <div className="flex justify-between items-center mb-6 border-b border-neutral-700 pb-3">
                        <h2 className="text-2xl font-bold text-neutral-50">Bài viết của tôi</h2>
                        {/* Nút quay lại */}
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center space-x-2 px-4 py-2 bg-neutral-700 text-neutral-200 rounded-md hover:bg-neutral-600 transition-colors duration-200 text-sm font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            <span>Quay lại</span>
                        </button>
                    </div>

                    {blogs === null ? (
                        <div className="flex flex-col items-center justify-center h-48">
                            {/* Spinner loading đơn giản */}
                            <svg className="animate-spin h-8 w-8 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-4 text-neutral-400 text-center">Đang tải bài viết...</p>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-neutral-400">
                            <p className="text-lg mb-2">Bạn chưa có bài viết nào.</p>
                            <p className="text-sm">Hãy tạo bài viết đầu tiên của bạn!</p>
                            {/* Placeholder hình ảnh cho trạng thái không có blog */}
                            <img src="https://placehold.co/100x100/333333/999999?text=No+Blogs" alt="No Blogs" className="mt-4 opacity-50"/>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {blogs.map((blog) => (
                                <div
                                    key={blog.id}
                                    className="relative bg-neutral-800 p-6 rounded-lg shadow-md border border-neutral-700 group hover:bg-neutral-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                                    onClick={() => handleBlogClick(blog.id)}
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        {/* Hình ảnh đặc trưng của blog */}
                                        {blog.featuredImage && (
                                            <img
                                                src={blog.featuredImage}
                                                alt={blog.title}
                                                className="w-24 h-24 object-cover rounded-lg flex-shrink-0 border border-neutral-600"
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/444444/DDDDDD?text=No+Image'; }}
                                            />
                                        )}
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-1">
                                                {/* Tiêu đề blog */}
                                                <h3 className="text-xl font-semibold text-neutral-50 leading-tight pr-6">{blog.title}</h3>
                                                {/* Icon chỉnh sửa (inline SVG) */}
                                                <svg className="w-5 h-5 text-neutral-400 group-hover:text-neutral-200 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                </svg>
                                            </div>
                                            {/* Mô tả blog với truncation bằng line-clamp-3 (sử dụng excerpt) */}
                                            <p className="text-neutral-300 text-sm line-clamp-3 mb-2">
                                                {blog.excerpt}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-neutral-400 border-t border-neutral-700 pt-3">
                                        {/* Hiển thị category nếu có */}
                                        {blog.category && <span className="px-3 py-1 bg-neutral-700 rounded-full text-neutral-300">#{blog.category}</span>}
                                        {/* Ngày đăng */}
                                        <span>Đăng vào: {formatDate(blog.publishedAt)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileComponent;
