import React, {useContext, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import EditorJS from "@editorjs/editorjs";
import {toast, Toaster} from 'react-hot-toast';
import {UserContext} from "@/App.jsx";
import AnimationWrapper from "@/Blog/Common2/page-animation.jsx";
import defaultBanner from "../imgs/blog banner.png";
import {getPost, updatePost, uploadImage} from "@/Blog/Common2/apiFunction.js";
import {tools} from "@/Blog/Component/tools.component.jsx";

const transformDbBlocksToEditorJsData = (dbBlocks) => {
    if (!dbBlocks || !Array.isArray(dbBlocks)) return [];

    const editorJsData = {
        time: Date.now(),
        blocks: dbBlocks.map(block => {
            switch (block.type) {
                case 'HEADING':
                    return {
                        type: 'header',
                        data: { text: block.content, level: block.level }
                    };
                case 'PARAGRAPH':
                    return {
                        type: 'paragraph',
                        data: { text: block.content }
                    };
                case 'IMAGE':
                    return {
                        type: 'image',
                        data: {
                            file: { url: block.content },
                            caption: block.caption || '',
                            withBorder: false,
                            stretched: false,
                            withBackground: false
                        }
                    };
                case 'LIST_ITEM':
                    // EditorJS xử lý list khác, chúng ta cần nhóm các LIST_ITEM lại.
                    // Logic này cần cải tiến nếu bạn muốn xử lý nhiều list xen kẽ.
                    // Đây là một cách tiếp cận đơn giản:
                    return {
                        // Đây là một sự đơn giản hóa, vì EditorJS có block 'list' riêng.
                        // Một cách tiếp cận tốt hơn là xử lý nhóm chúng lại trước khi map.
                        type: 'paragraph', // Tạm thời hiển thị như paragraph
                        data: { text: `• ${block.content}` }
                    };
                case 'EMBED':
                    return {
                        type: 'embed',
                        data: {
                            service: block.service,
                            source: block.source,
                            embed: block.embed,
                            width: block.width,
                            height: block.height,
                            caption: block.caption || ''
                        }
                    };
                default:
                    // Bỏ qua các block không xác định
                    return null;
            }
        }).filter(Boolean), // Lọc ra các giá trị null
        version: "2.29.1" // Có thể cần phiên bản EditorJS của bạn
    };


    // Cần một logic phức tạp hơn để xử lý đúng 'list'
    // Đây là ví dụ về cách nhóm các LIST_ITEM lại
    const processedBlocks = [];
    let currentList = null;

    editorJsData.blocks.forEach(block => {
        if (block.type === 'paragraph' && block.data.text.startsWith('• ')) {
            if (!currentList) {
                currentList = {
                    type: 'list',
                    data: { style: 'unordered', items: [] }
                };
            }
            currentList.data.items.push(block.data.text.substring(2));
        } else {
            if (currentList) {
                processedBlocks.push(currentList);
                currentList = null;
            }
            processedBlocks.push(block);
        }
    });

    if (currentList) {
        processedBlocks.push(currentList);
    }

    editorJsData.blocks = processedBlocks;
    return editorJsData;
};
const transformEditorDataToContentBlocks = (editorBlocks) => {
    if (!editorBlocks || !Array.isArray(editorBlocks)) return [];
    const contentBlocksResult = [];
    editorBlocks.forEach(block => {
        switch (block.type) {
            case 'header':
                contentBlocksResult.push({
                    type: 'HEADING', // Chuyển thành type mong muốn
                    content: block.data.text,
                    level: block.data.level
                });
                break;
            case 'paragraph':
                contentBlocksResult.push({
                    type: 'PARAGRAPH',
                    content: block.data.text
                });
                break;
            case 'image':
                contentBlocksResult.push({
                    type: 'IMAGE',
                    content: block.data.file.url, // URL của ảnh
                    altText: block.data.caption || '', // Sử dụng caption làm altText nếu không có trường riêng
                    caption: block.data.caption || ''
                });
                break;
            case 'list':
                block.data.items.forEach(itemText => {
                    contentBlocksResult.push({
                        type: 'LIST_ITEM', // Mỗi mục là một block LIST_ITEM
                        content: itemText
                    });
                });
                break;

            case 'embed':
                contentBlocksResult.push({
                    type: 'EMBED',
                    service: block.data.service,
                    source: block.data.source,
                    embed: block.data.embed,
                    width: block.data.width,
                    height: block.data.height,
                    caption: block.data.caption || ''
                });
                break;
            default:
                console.warn("Block type không được hỗ trợ hoặc chưa được ánh xạ:", block.type, block.data);
        }
    });
    return contentBlocksResult;
};

const BlogEditor = () => {
    const { id: blogId } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate();
    const { userAuth: { access_token } } = useContext(UserContext);

    // State cho dữ liệu blog
    const [blog, setBlog] = useState({
        title: '',
        src: '', // Banner image
        content: null, // Dữ liệu cho EditorJS
    });
    const [loading, setLoading] = useState(false);
    const editorInstanceRef = useRef(null); // Ref để giữ instance của EditorJS

    // Fetch dữ liệu khi ở chế độ Edit
    useEffect(() => {
        if (blogId) {
            setLoading(true);
            toast.loading("Đang tải dữ liệu bài viết...");

            getPost(blogId) // Hàm gọi API GET /api/posts/{id}
                .then(postData => {
                    toast.dismiss();
                    // Chuyển đổi dữ liệu contentBlocks sang định dạng EditorJS
                    const editorReadyData = transformDbBlocksToEditorJsData(postData.contentBlocks);

                    setBlog({
                        id: postData.id,
                        title: postData.title,
                        src: postData.featuredImage,
                        content: editorReadyData, // Dữ liệu đã sẵn sàng cho EditorJS
                        slug: postData.slug,
                        status: postData.status,
                        tagNames: postData.tags,
                        categoryNames: postData.categoryNames || [],
                    });

                })
                .catch(err => {
                    toast.dismiss();
                    toast.error("Không thể tải dữ liệu bài viết.");
                    console.error(err);
                    navigate("/blog"); // Điều hướng đi nếu lỗi
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [blogId]); // Chỉ chạy khi có blogId
    useEffect(() => {
        // useEffect này sẽ chỉ chạy KHI VÀ CHỈ KHI state `blog` đã thay đổi và component đã re-render xong.
        // Đây là cách chính xác để xem giá trị state mới nhất.
        if (blog && blog.id) { // Chỉ log khi blog đã có dữ liệu
            console.log("Blog state đã được cập nhật:", blog);
        }
    }, [blog]); // <-- Dependency là `blog`
    // Khởi tạo EditorJS
    useEffect(() => {
        // Chỉ khởi tạo khi chưa có instance và đã có dữ liệu (cho edit mode) hoặc là trang tạo mới
        if (!editorInstanceRef.current && (!blogId || (blogId && blog.content))) {
            editorInstanceRef.current = new EditorJS({
                holder: "textEditor",
                data: blog.content || {blocks: []}, // Dùng dữ liệu đã fetch hoặc mảng rỗng
                tools: tools,
                placeholder: "Bắt đầu viết một câu chuyện tuyệt vời!",
            });
        }

        // Hàm dọn dẹp để hủy instance khi component unmount
        return () => {
            if (editorInstanceRef.current && typeof editorInstanceRef.current.destroy === 'function') {
                editorInstanceRef.current.destroy();
                editorInstanceRef.current = null;
            }
        };
    }, [blog.content]); // Chạy lại khi blog.content (dữ liệu fetch) thay đổi

    const handleTitleChange = (e) => {
        setBlog(prev => ({ ...prev, title: e.target.value }));
    };


    const handleBannerUpload = (e) => {
        let imgFile = e.target.files[0];
        if (imgFile) {
            let loadingToast = toast.loading("Uploading banner image...");
            uploadImage(imgFile) // Giả sử hàm này không cần token hoặc tự lấy
                .then((response) => {
                    toast.dismiss(loadingToast);
                    toast.success("Banner has been uploaded successfully!");
                    setBlog(prev => ({ ...prev, src: response.url }));
                })
                .catch(err => {
                    toast.dismiss(loadingToast);
                    toast.error("Error uploading banner image.");
                });
        }
    }


    const handlePublish = () => {
        if (!blog.title.trim()) {
            return toast.error("Vui lòng nhập tiêu đề.");
        }
        if (!blog.src) {
            return toast.error("Vui lòng tải lên ảnh bìa.");
        }

        const editor = editorInstanceRef.current;
        if (editor) {
            editor.save()
                .then(editorData => {
                    if (editorData.blocks.length === 0) {
                        return toast.error("Vui lòng viết nội dung.");
                    }

                    const finalContentBlocks = transformEditorDataToContentBlocks(editorData.blocks);

                    const postPayload = {
                        title: blog.title,
                        featuredImage: blog.src,
                        contentBlocks: finalContentBlocks,
                        slug: blog.slug || blog.title.toLowerCase().replace(/\s+/g, '-'), // Tạo slug từ tiêu đề nếu không có
                        status: blog.status || 'DRAFT', // Mặc định là DRAFT nếu không có
                        tagNames: blog.tagNames || [], // Mảng rỗng nếu không có
                        categoryNames: blog.categoryNames || [], // Mảng rỗng nếu không có
                        // Nếu bạn cần thêm các trường khác, hãy thêm vào đây

                    };
                    // console.log("Post Payload:", postPayload);
                    // const apiMethod = blogId ? 'put' : 'post';
                    // const apiUrl = blogId ? `/api/posts/${blogId}` : '/api/posts';
                    //
                    const loadingToast = toast.loading(blogId ? "Đang cập nhật..." : "Đang xuất bản...");
                    // console.log(blogId, postPayload);
                    updatePost(blogId, postPayload)
                        .then(() => {
                            toast.dismiss(loadingToast);
                            toast.success(blogId ? "Cập nhật thành công!" : "Xuất bản thành công!");

                            setTimeout(() => {
                                navigate(`/blog/${blogId}`); // Điều hướng đến trang xem bài viết
                            }, 1000);
                        })
                        .catch(({ response }) => {
                            toast.dismiss(loadingToast);
                            toast.error(response?.data?.message || "Đã có lỗi xảy ra.");
                        });
                })
                .catch(err => {
                    console.error("Lỗi khi lưu từ EditorJS:", err);
                    toast.error("Không thể lấy nội dung từ trình soạn thảo.");
                });
        }
    };


    if (loading) {
        return <div>Đang tải trình soạn thảo...</div>;
    }

    return (
        <AnimationWrapper>
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
            <Toaster/>
            <section className="mx-auto max-w-[900px] w-full">
                {/* Giao diện JSX (banner, title, div#textEditor) của bạn ở đây */}
                <div className="relative aspect-video bg-gray-100 border-4 border-gray-200 rounded-md overflow-hidden">
                    <label htmlFor="uploadBanner">
                        <img src={blog.src || defaultBanner} alt="banner"/>
                    </label>
                    <input id="uploadBanner" type="file" accept=".png, .jpg, .jpeg" hidden
                           onChange={handleBannerUpload}/>
                </div>
                <textarea
                    value={blog.title}
                    placeholder="Title..."
                    className="text-4xl font-medium w-full h-auto outline-none resize-none mt-10"
                    onChange={handleTitleChange}
                />
                <hr className="w-full opacity-20 my-5"/>
                <div id="textEditor"  className="font-gelasio prose prose-lg max-w-none"></div>

                <button onClick={handlePublish} className="btn-dark mt-4">
                    {blogId ? 'Cập nhật bài viết' : 'Xuất bản'}
                </button>
            </section>
        </AnimationWrapper>
    );
};

export default BlogEditor;