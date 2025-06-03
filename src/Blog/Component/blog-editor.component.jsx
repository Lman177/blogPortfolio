import {Link, useNavigate, useParams} from "react-router-dom";
import logo from "../imgs/logo.png";
import defaultBanner from "../imgs/blog banner.png"; // Đảm bảo đường dẫn này chính xác
import { useContext, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component"; // Đảm bảo file này tồn tại và export 'tools'
import axios from "axios"; // Axios sẽ được dùng trong handleSaveDraft
import AnimationWrapper from "@/Blog/Common2/page-animation.jsx"; // Đảm bảo đường dẫn này chính xác
import { EditorContext } from "@/Blog/pages/editor.pages.jsx"; // Đảm bảo đường dẫn này chính xác
import { UserContext } from "@/App.jsx"; // Đảm bảo đường dẫn này chính xác
import { uploadImage } from "@/Blog/Common2/apiFunction.js"; // Đảm bảo đường dẫn này chính xác

// Helper function to generate a simple slug (bạn có thể cải thiện nó)
const generateSlug = (title) => {
    if (!title) return "";
    return title
        .toLowerCase()
        .normalize("NFD") // Chuẩn hóa Unicode, tách dấu
        .replace(/[\u0300-\u036f]/g, "") // Xóa dấu thanh
        .replace(/[đĐ]/g, "d") // Chuyển đ, Đ thành d
        .replace(/[^a-z0-9\s-]/g, "") // Xóa các ký tự đặc biệt trừ khoảng trắng và gạch nối
        .trim() // Xóa khoảng trắng đầu cuối
        .replace(/\s+/g, "-") // Thay thế một hoặc nhiều khoảng trắng bằng một gạch nối
        .replace(/-+/g, "-"); // Thay thế nhiều gạch nối bằng một gạch nối
};

// Helper function to transform EditorJS blocks
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
            case 'quote':
                contentBlocksResult.push({
                    type: 'QUOTE',
                    content: block.data.text,
                    caption: block.data.caption || ''
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
            case 'delimiter':
                contentBlocksResult.push({ type: 'DELIMITER' });
                break;
            default:
                console.warn("Block type không được hỗ trợ hoặc chưa được ánh xạ:", block.type, block.data);
        }
    });
    return contentBlocksResult;
};

// Helper function to generate excerpt
const generateExcerptFromContentBlocks = (blocks, maxLength = 250) => {
    if (!blocks || blocks.length === 0) return "";
    let textContent = "";
    for (const block of blocks) {
        if (block.type === "PARAGRAPH" && block.content) {
            textContent += block.content + " ";
        } else if (block.type === "HEADING" && block.content) {
            textContent += block.content + " "; // Có thể thêm cả heading vào excerpt
        }
        if (textContent.length >= maxLength * 1.5) break; // Dừng sớm nếu quá dài
    }
    if (textContent.length > maxLength) {
        return textContent.substring(0, maxLength).trim() + "...";
    }
    return textContent.trim();
};


const BlogEditor = () => {
    let navigate = useNavigate();
    let { userAuth: { access_token } } = useContext(UserContext);
    const { slug: blogSlug } = useParams(); // Lấy slug để kiểm tra


    console.log("access_token:", access_token);
    let {
        blog,
        blog: {
            title,
            src, // featuredImage
            // excerpt, // Sẽ được tạo tự động hoặc nhập ở PublishForm
            contentBlocks: initialContentBlocks, // Dữ liệu ban đầu cho EditorJS
            // Các trường khác sẽ được quản lý ở PublishForm hoặc có giá trị mặc định từ Editor.jsx
        },
        setBlog,
        textEditor,
        setTextEditor,
        setEditorState
    } = useContext(EditorContext);

    useEffect(() => {
        // Chỉ khởi tạo nếu trong context chưa có instance nào (`textEditor` là null).
        // `key` ở component cha đã đảm bảo component này là mới khi cần.
        if (!textEditor) {
            const editor = new EditorJS({
                holder: "textEditor",
                data: { blocks: initialContentBlocks || [] },
                tools: tools,
                placeholder: "Hãy bắt đầu viết câu chuyện tuyệt vời của bạn...",
                onReady: () => {
                    console.log("EditorJS đã sẵn sàng.");
                }
            });
            // Lưu instance vừa tạo vào context để các hàm khác có thể dùng.
            setTextEditor(editor);
        }

        // Hàm cleanup: Sẽ chạy KHI VÀ CHỈ KHI component này bị unmount.
        // (VD: khi `key` ở component cha thay đổi).
        return () => {
            if (textEditor && typeof textEditor.destroy === 'function') {
                textEditor.destroy();
                // Reset context để báo rằng không còn instance nào tồn tại.
                setTextEditor(null);
            }
        };
    }, []);  // <-- THAY ĐỔI QUAN TRỌNG: Dependency rỗng

    const handleTitleKeyDown = (e) => {
        if (e.keyCode === 13) e.preventDefault();
    }

    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px";
        setBlog(prevBlog => ({ ...prevBlog, title: input.value }));
    }

    const handleBannerUpload = (e) => {
        let imgFile = e.target.files[0];
        if (imgFile) {
            let loadingToast = toast.loading("Đang tải lên banner...");
            uploadImage(imgFile, access_token) // uploadImage nên trả về { url: "..." }
                .then((response) => {
                    if (response && typeof response.url === 'string' && response.url.trim() !== '') {
                        toast.dismiss(loadingToast);
                        toast.success("Banner đã được tải lên!");
                        setBlog(prevBlog => ({ ...prevBlog, src: response.url })); // src là featuredImage
                    } else {
                        toast.dismiss(loadingToast);
                        toast.error("Không nhận được URL hợp lệ cho banner.");
                    }
                })
                .catch (err => {
                    toast.dismiss(loadingToast);
                    return toast.error(err.message || "Lỗi khi tải lên banner.");
                });
        }
    }

    const handleError = (e) => {
        const erroredSrc = e.target.currentSrc || e.target.src;
        if (erroredSrc !== defaultBanner) e.target.src = defaultBanner;
    }

    // Xử lý khi nhấn nút "Xuất bản"
    const handlePublishEvent = () => {
        if (!src || !src.length) return toast.error("Vui lòng tải lên ảnh bìa (featuredImage).");
        if (!title || !title.length) return toast.error("Vui lòng nhập tiêu đề.");

        if (textEditor && typeof textEditor.save === 'function') {
            textEditor.save()
                .then(editorData => { // editorData.blocks là output của EditorJS
                    if (editorData.blocks.length) {
                        const transformedBlocks = transformEditorDataToContentBlocks(editorData.blocks);
                        const generatedExcerpt = generateExcerptFromContentBlocks(transformedBlocks);

                        setBlog(prevBlog => ({
                            ...prevBlog,
                            contentBlocks: transformedBlocks, // Lưu content đã chuyển đổi
                            excerpt: prevBlog.excerpt || generatedExcerpt, // Ưu tiên excerpt đã có, nếu không thì dùng cái tự tạo

                        }));
                        setEditorState("publish"); // Chuyển sang PublishForm
                    } else {
                        return toast.error("Vui lòng viết nội dung cho bài viết.");
                    }
                })
                .catch(err => toast.error("Không thể lưu nội dung từ trình soạn thảo."));
        } else {
            toast.error("Trình soạn thảo chưa sẵn sàng.");
        }
    }

    // Xử lý khi nhấn nút "Lưu nháp"
    const handleSaveDraft = (e) => {
        if (e.target.className.includes("disable")) return;
        if (!title || !title.length) return toast.error("Vui lòng nhập tiêu đề để lưu nháp.");

        let loadingToast = toast.loading("Đang lưu nháp...");
        e.target.classList.add('disable');

        if (textEditor && typeof textEditor.save === 'function') {
            textEditor.save()
                .then(editorData => {
                    const transformedBlocks = transformEditorDataToContentBlocks(editorData.blocks);
                    const generatedExcerpt = blog.excerpt || generateExcerptFromContentBlocks(transformedBlocks);
                    const generatedBlogSlug = blog.slug || generateSlug(title); // Ưu tiên slug đã có (nếu edit)

                    const blogToSave = {
                        // Lấy các trường từ state 'blog' hiện tại trong context
                        ...blog, // Bao gồm year, color, categoryName, tagNames nếu đã có từ trước (khi edit)
                        title: title,
                        slug: generatedBlogSlug,
                        status: "DRAFT",
                        excerpt: generatedExcerpt,
                        featuredImage: src, // 'src' từ state chính là 'featuredImage'
                        contentBlocks: transformedBlocks,
                        // Các trường như tagNames, categoryName có thể được cập nhật ở PublishForm
                        // nhưng nếu đã có giá trị trong 'blog' (khi edit draft), thì giữ lại
                        tagNames: blog.tagNames || [],
                        categoryName: blog.categoryName || "",
                    };
                    // Xóa các trường không cần thiết hoặc không có trong API request nếu cần
                    // delete blogToSave.src; // Nếu API chỉ nhận featuredImage

                    const apiEndpoint = blog.id
                        ? `localhost:8080/api/posts/${blog.id}` // Endpoint cập nhật (PUT)
                        : `localhost:8080/api/posts`;      // Endpoint tạo mới (POST)
                    const apiMethod = blog.id ? 'put' : 'post';

                    axios[apiMethod](apiEndpoint, blogToSave, {
                        headers: { "Authorization": `Bearer ${access_token}` }
                    })
                        .then((response) => {
                            e.target.classList.remove('disable');
                            toast.dismiss(loadingToast);
                            toast.success("Đã lưu nháp!");

                            // Cập nhật lại state blog trong context với dữ liệu từ server (bao gồm id, slug nếu mới tạo)
                            setBlog(prev => ({ ...prev, ...response.data }));

                            // Nếu là tạo mới, có thể điều hướng đến trang edit với slug mới
                            if (apiMethod === 'post' && response.data.slug) {
                                setTimeout(() => {
                                    navigate(`/editor/${response.data.slug}`); // Điều hướng đến trang edit với slug
                                }, 500);
                            }
                            // Nếu là cập nhật, có thể không cần navigate hoặc navigate về trang xem bài viết
                        })
                        .catch(({ response }) => {
                            e.target.classList.remove('disable');
                            toast.dismiss(loadingToast);
                            const errorMessage = response?.data?.message || response?.data?.error || "Lỗi khi lưu nháp.";
                            return toast.error(errorMessage);
                        });
                })
                .catch(err => {
                    e.target.classList.remove('disable');
                    toast.dismiss(loadingToast);
                    toast.error("Không thể lấy nội dung để lưu nháp.");
                });
        } else {
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            toast.error("Trình soạn thảo chưa sẵn sàng.");
        }
    }

    return (
        <>
            <Toaster position="top-right" />
            <nav className="navbar">
                <Link to="/blog" className="flex-none w-10">
                    <img src={logo} alt="Logo trang chủ"/>
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {title && title.length ? title : "Bài viết mới"}
                </p>
                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2" onClick={handlePublishEvent}>Xuất bản</button>
                    <button className="btn-light py-2" onClick={handleSaveDraft}>Lưu nháp</button>
                </div>
            </nav>
            <AnimationWrapper>
                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                        <div className="relative aspect-video bg-gray-100 border-4 border-gray-200 rounded-md overflow-hidden">
                            <label htmlFor="uploadBanner" className="z-10 absolute top-0 left-0 w-full h-full cursor-pointer flex items-center justify-center">
                                <img
                                    key={src || defaultBanner} // Key để re-render khi src thay đổi
                                    src={src && src.length ? src : defaultBanner}
                                    className="z-20 w-full h-full object-cover"
                                    onError={handleError}
                                    alt="Blog Banner"
                                />
                            </label>
                            <input id="uploadBanner" type="file" accept=".png, .jpg, .jpeg" hidden onChange={handleBannerUpload} />
                        </div>
                        <textarea
                            value={title || ""}
                            placeholder="Tiêu đề bài viết..."
                            className="text-4xl font-medium w-full h-auto min-h-[80px] outline-none resize-none mt-10 leading-tight placeholder:opacity-60"
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        />
                        <hr className="w-full opacity-20 my-5 border-gray-300"/>
                        <div id="textEditor" className="font-gelasio prose prose-lg max-w-none"></div>
                    </div>
                </section>
            </AnimationWrapper>
        </>
    )
}

export default BlogEditor;
