import React, {useState, useEffect, useContext} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {deletePost, getPost, getRelatedPosts} from "@/Blog/Common2/apiFunction.js";
import {formatDate} from "@/Blog/Common2/date.jsx";
import AnimationWrapper from "@/Blog/Common2/page-animation.jsx";
import {UserContext} from "@/App.jsx";
import toast from "react-hot-toast"; // Cần cài đặt react-router-dom




// Helper để render các khối nội dung
const ContentBlock = ({ block }) => {
    if (!block || !block.type) {
        // console.warn("ContentBlock: block không hợp lệ hoặc thiếu type.", block);
        return null; // Không render gì nếu block không hợp lệ
    }
    switch (block.type) {
        case 'HEADING':
            // Xác định level của heading, mặc định là h2 nếu không có level hoặc level không hợp lệ
            const level = block.level && [1, 2, 3, 4, 5, 6].includes(block.level) ? block.level : 2;
            const Tag = `h${level}`; // Tạo tag động (h1, h2, ...)
            // Điều chỉnh kích thước chữ dựa trên level
            let textSizeClass = 'text-2xl md:text-3xl'; // Mặc định cho h2
            if (level === 1) textSizeClass = 'text-3xl md:text-4xl';
            else if (level === 3) textSizeClass = 'text-xl md:text-2xl';
            else if (level >= 4) textSizeClass = 'text-lg md:text-xl';

            return <Tag className={`${textSizeClass} font-bold text-gray-900 mt-8 mb-4`}>{block.content}</Tag>;
        case 'PARAGRAPH':
            return <p className="text-base md:text-lg text-gray-800 leading-relaxed mb-4">{block.content}</p>;
        case 'IMAGE':
            return (
                <figure className="my-8">
                    <img
                        src={block.content || "https://placehold.co/600x400/e2e8f0/cbd5e0?text=Invalid+Image+URL"}
                        alt={block.altText || 'Hình ảnh trong bài viết'}
                        className="w-full h-auto object-cover rounded-lg shadow-md"
                        // Xử lý lỗi nếu URL ảnh không tải được
                        onError={(e) => {
                            e.target.onerror = null; // Ngăn vòng lặp lỗi nếu ảnh placeholder cũng lỗi
                            e.target.src="https://placehold.co/600x400/e2e8f0/cbd5e0?text=Image+Not+Found";
                        }}
                    />
                    {block.caption && (
                        <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
                            {block.caption}
                        </figcaption>
                    )}
                </figure>
            );
        case 'LIST_ITEM':
            return <li className="text-base md:text-lg text-gray-800 leading-relaxed mb-2">{block.content}</li>;
        default:
            // console.warn("ContentBlock: Kiểu block không được hỗ trợ:", block.type, block);
            return null; // Hoặc có thể render một thông báo lỗi nhỏ
    }
};

// Component Card cho bài viết liên quan
const RelatedPostCard = ({ post }) => {
    if (!post || !post.slug || !post.title) {
        // console.warn("RelatedPostCard: Dữ liệu bài viết liên quan không hợp lệ.", post);
        return null; // Không render nếu thiếu thông tin cơ bản
    }
    return (
        <Link
            to={`/blog/${post.slug}`}
            className="block group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
        >
            {post.featuredImage && (
                <img
                    src={post.featuredImage}
                    alt={post.title || "Ảnh bài viết liên quan"}
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"

                />
            )}
            <div className="p-4">
                {post.category && <p className="text-xs font-semibold text-indigo-600 uppercase mb-1">{post.category}</p>}
                <h3 className="text-md font-semibold text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors line-clamp-2" title={post.title}>
                    {post.title}
                </h3>
                <p className="text-xs text-gray-500">{formatDate(post.publishedAt)}</p>
            </div>
        </Link>
    );
};


const DetailBlog = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const { userAuth } = useContext(UserContext);


    useEffect(() => {
        const fetchPostData = async () => {
            if (!slug) {
                setError("Không có slug bài viết. Vui lòng kiểm tra lại đường dẫn.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            setPost(null);
            setRelatedPosts([]);

            try {
                const mainPostData = await getPost(slug);
                // Kiểm tra xem mainPostData có phải là object và có các thuộc tính cần thiết không
                if (typeof mainPostData === 'object' && mainPostData !== null && mainPostData.id) {
                    setPost(mainPostData);
                    // Sau khi có bài viết chính, lấy bài viết liên quan
                    const relatedData = await getRelatedPosts(mainPostData.id);
                    console.log("relatedData",relatedData)
                    setRelatedPosts(relatedData || []); // Đảm bảo relatedData không phải là undefined
                } else {
                    // console.error("Dữ liệu bài viết chính không hợp lệ:", mainPostData);
                    setError('Không tìm thấy nội dung bài viết hoặc dữ liệu không hợp lệ.');
                }

            } catch (err) {
                // console.error("Lỗi khi tải dữ liệu bài viết:", err);
                setError(err.message || 'Đã có lỗi xảy ra khi tải bài viết. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchPostData();
        // Cuộn lên đầu trang khi slug thay đổi
        window.scrollTo(0, 0);

    }, [slug]); // Chạy lại khi slug thay đổi

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowCopiedMessage(true);
            setTimeout(() => setShowCopiedMessage(false), 2000); // Ẩn thông báo sau 2 giây
        } catch (err) {
            // console.error('Không thể sao chép liên kết:', err);
            alert('Không thể sao chép liên kết. Vui lòng thử lại.'); // Fallback cho trường hợp lỗi
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white text-gray-900 text-xl p-4 text-center">
                Đang tải nội dung bài viết, vui lòng chờ...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-white text-red-600 p-6 text-center">
                <h2 className="text-2xl font-semibold mb-3">Rất tiếc, đã có lỗi xảy ra!</h2>
                <p className="text-lg mb-6">{error}</p>
                <button
                    onClick={() => navigate('/')} // Điều hướng về trang chủ hoặc trang blog chính
                    className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Về trang chủ
                </button>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-white text-gray-700 p-6 text-center">
                <h2 className="text-2xl font-semibold mb-3">Không tìm thấy bài viết</h2>
                <p className="text-lg mb-6">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                <button
                    onClick={() => navigate('/')} // Điều hướng về trang chủ hoặc trang blog chính
                    className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Về trang chủ
                </button>
            </div>
        );
    }
    const handleDeletePost = () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.")) {
            const loadingToast = toast.loading("Đang xóa bài viết...");
            deletePost(post.id)
                .then(() => {
                    toast.dismiss(loadingToast);
                    toast.success("Đã xóa bài viết thành công!", { duration: 2000 });
                    setTimeout(() => {
                        navigate("/blog");
                    }, 1000);
                })
                .catch(err => {
                    toast.dismiss(loadingToast);
                    toast.error("Có lỗi xảy ra khi xóa bài viết. Vui lòng thử lại.");
                    console.error(err);
                });
        }
    };
    // Xử lý contentBlocks để nhóm các LIST_ITEM lại với nhau
    const processedContentBlocks = [];
    let currentListItems = [];

    // Đảm bảo post.contentBlocks là một mảng trước khi duyệt
    if (Array.isArray(post.contentBlocks)) {
        post.contentBlocks.forEach((block) => {
            if (block.type === 'LIST_ITEM') {
                currentListItems.push(block);
            } else {
                if (currentListItems.length > 0) {
                    processedContentBlocks.push({ type: 'LIST_GROUP', items: [...currentListItems], id: `list-${processedContentBlocks.length}` });
                    currentListItems = [];
                }
                // Thêm id duy nhất cho mỗi block để làm key
                processedContentBlocks.push({...block, id: `block-${processedContentBlocks.length}-${block.type}`});
            }
        });
        if (currentListItems.length > 0) {
            processedContentBlocks.push({ type: 'LIST_GROUP', items: [...currentListItems], id: `list-${processedContentBlocks.length}` });
        }
    } else {
        // console.warn("post.contentBlocks không phải là một mảng:", post.contentBlocks);
    }
    const isAuthor = userAuth?.email === post.author?.username;
    console.log(post)
    return (
        <AnimationWrapper>

        <div className="bg-white text-gray-900 font-sans antialiased">
            {/* Nút trở về nổi ở góc trên bên trái */}

                <button
                    onClick={() => navigate(-1)}
                    className="fixed flex items-center space-x-2 px-4 py-2 bg-neutral-700 text-neutral-200 rounded-md hover:bg-neutral-600 transition-colors duration-200 text-sm font-medium"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    <span>Quay lại</span>
                </button>
            {isAuthor && (
                <div className="absolute top-100 right-0 flex gap-2">
                    <Link
                        to={`/blog/edit-blog/${post.id}`} // Dùng ID để đảm bảo tính duy nhất
                        className="px-3 py-1.5 bg-gray-200 text-gray-800 text-xs font-semibold rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Chỉnh sửa
                    </Link>
                    <button
                        onClick={handleDeletePost}
                        className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-md hover:bg-red-200 transition-colors"
                    >
                        Xóa
                    </button>
                </div>
            )}

            <article className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <header className="mb-10">
                    {post.category && (
                        <p className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider transition-colors">
                            {post.category}
                        </p>
                    )}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 my-3 leading-tight">
                        {post.title || "Tiêu đề bài viết không có"}
                    </h1>
                    <div className="flex flex-wrap items-center text-sm text-gray-600 gap-x-4 gap-y-1 mt-3">
                        <span>Bởi <span
                            className="font-semibold text-gray-800">{post.author?.username || 'Tác giả ẩn danh'}</span></span>
                        <span className="hidden sm:inline text-gray-400">•</span>
                        <time dateTime={post.publishedAt ? new Date(post.publishedAt[0], post.publishedAt[1]-1, post.publishedAt[2]).toISOString() : undefined}>
                            {formatDate(post.publishedAt)}
                        </time>
                        {post.status === "PUBLISHED" && (
                            <>
                                <span className="hidden sm:inline text-gray-400">•</span>
                                <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Đã xuất bản</span>
                            </>
                        )}
                    </div>
                </header>

                {post.featuredImage && (
                    <img
                        src={post.featuredImage}
                        alt={`Ảnh bìa cho bài viết: ${post.title || 'Không có tiêu đề'}`}
                        className="w-full h-auto max-h-[480px] object-cover rounded-xl mb-10 shadow-lg"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src="https://placehold.co/800x450/e2e8f0/cbd5e0?text=Featured+Image+Not+Found";
                        }}
                    />
                )}

                {/* Nội dung bài viết */}
                <div className="prose prose-lg sm:prose-xl max-w-none text-gray-800 selection:bg-indigo-100 selection:text-indigo-800">
                    {processedContentBlocks.map((block) => {
                        if (block.type === 'LIST_GROUP') {
                            return (
                                <ul key={block.id} className="list-disc space-y-1 pl-5 mb-4">
                                    {block.items.map((item, itemIndex) => (
                                        // Sử dụng id của item nếu có, hoặc index làm fallback
                                        <ContentBlock key={item.id || `listitem-${block.id}-${itemIndex}`} block={item} />
                                    ))}
                                </ul>
                            );
                        }
                        return <ContentBlock key={block.id} block={block} />;
                    })}
                </div>


                {/* Tags */}
                {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                    <div className="mt-10 pt-6 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3 text-base">Thẻ liên quan:</h3>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Link key={tag} to={`/tags/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))}`} className="bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full hover:bg-gray-200 hover:text-gray-900 transition-colors">
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Nút chia sẻ */}
                <div className="mt-10 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3 text-base">Chia sẻ bài viết này:</h3>
                    <div className="flex items-center space-x-3">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" title="Chia sẻ lên Facebook" className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-blue-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                        </a>
                        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title || "")}`} target="_blank" rel="noopener noreferrer" title="Chia sẻ lên Twitter (X)" className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-800">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                        <button onClick={handleCopyLink} title="Sao chép liên kết" className="relative p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                            </svg>
                            {showCopiedMessage && (
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap">
                                    Đã sao chép!
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Bài viết liên quan */}
                {relatedPosts && Array.isArray(relatedPosts) && relatedPosts.length > 0 && (
                    <section className="mt-16 pt-10 border-t border-gray-200">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Có thể bạn cũng thích</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                            {relatedPosts.map(relatedPost => (
                                <RelatedPostCard key={relatedPost.id || relatedPost.slug} post={relatedPost} />
                            ))}
                        </div>
                    </section>
                )}
            </article>
        </div>

        </AnimationWrapper>
    );
};

export default DetailBlog;