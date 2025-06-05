import toast, { Toaster } from "react-hot-toast";
import { useContext, useEffect, useState } from "react"; // Added useEffect and useState
import Tag from "./tags.component"; // Assuming this component is correctly implemented
// Removed direct axios import as API calls will be handled by functions from apiFunction.js
import { useNavigate } from "react-router-dom";
import AnimationWrapper from "@/Blog/Common2/page-animation.jsx";
import { EditorContext } from "@/Blog/pages/editor.pages.jsx";
import { UserContext } from "@/App.jsx";
// Import your API functions
import { createPost, updatePost } from "@/Blog/Common2/apiFunction.js"; // Assuming updatePost will be created in apiFunction.js

// Helper function to generate a simple slug (can be the same as in BlogEditor)
const generateSlug = (title) => {
    if (!title) return "";
    return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

const PublishForm = () => {
    const charLimit = 200;
    const tagLimit = 10;
    const navigate = useNavigate();

    const {
        blog, // The whole blog object from context
        blog: {
            id: blogId, // To check if it's an update or create
            title,
            src, // This is the featuredImage URL
            excerpt,
            tagNames, // Changed from tags
            contentBlocks, // This is the main content
            slug: initialSlug, // Slug from context (might be pre-filled/generated)
            categoryName: initialCategoryName, // Category from context
            // year, color, technologies (if they are part of your blog state in context)
        },
        setEditorState,
        setBlog // To update the blog object in context
    } = useContext(EditorContext);

    // Local state for form fields that can be edited here
    // Initialize with values from context, allowing local edits
    const [currentTitle, setCurrentTitle] = useState(title || "");
    const [currentExcerpt, setCurrentExcerpt] = useState(excerpt || "");
    const [currentTagNames, setCurrentTagNames] = useState(tagNames || []);
    const [currentSlug, setCurrentSlug] = useState(initialSlug || "");
    const [currentCategoryName, setCurrentCategoryName] = useState(initialCategoryName || "");


    useEffect(() => {
        // Update local states if blog context changes (e.g., navigating back from editor)
        setCurrentTitle(title || "");
        setCurrentExcerpt(excerpt || "");
        setCurrentTagNames(tagNames || []);
        setCurrentSlug(initialSlug || (title ? generateSlug(title) : "")); // Auto-generate slug if not present
        setCurrentCategoryName(initialCategoryName || "");
    }, [title, excerpt, tagNames, initialSlug, initialCategoryName]);


    const handleCloseEvent = () => {
        setEditorState("editor");
    }

    const handleBlogTitleChange = (e) => {
        const newTitle = e.target.value;
        setCurrentTitle(newTitle);
        // Optionally, auto-update slug if user hasn't manually set it or if it's empty
        if (!currentSlug || currentSlug === generateSlug(title)) { // Check against old title for auto-slug generation
            const newGeneratedSlug = generateSlug(newTitle);
            setCurrentSlug(newGeneratedSlug);
            setBlog({ ...blog, title: newTitle, slug: newGeneratedSlug });
        } else {
            setBlog({ ...blog, title: newTitle });
        }
    }

    const handleBlogExcerptChange = (e) => {
        const newExcerpt = e.target.value;
        setCurrentExcerpt(newExcerpt);
        setBlog({ ...blog, excerpt: newExcerpt });
    }

    const handleSlugChange = (e) => {
        const newSlug = e.target.value;
        setCurrentSlug(newSlug);
        setBlog({ ...blog, slug: newSlug });
    };

    const handleCategoryNameChange = (e) => {
        const newCategory = e.target.value;
        setCurrentCategoryName(newCategory);
        setBlog({ ...blog, categoryName: newCategory });
    };


    const handleTextKeyDown = (e) => { // Renamed from handleTitleKeyDown for generic use
        if (e.keyCode === 13) { // Enter key
            e.preventDefault();
        }
    }

    const handleTagKeyDown = (e) => {
        if (e.keyCode === 13 || e.keyCode === 188) { // Enter or Comma
            e.preventDefault();
            let tag = e.target.value.trim();
            if (tag.length) {
                if (currentTagNames.length < tagLimit) {
                    if (!currentTagNames.includes(tag)) {
                        const newTagNames = [...currentTagNames, tag];
                        setCurrentTagNames(newTagNames);
                        setBlog({ ...blog, tagNames: newTagNames });
                    }
                } else {
                    toast.error(`Bạn chỉ có thể thêm tối đa ${tagLimit} thẻ.`);
                }
                e.target.value = "";
            }
        }
    }

    const removeTag = (tagToRemove) => {
        const newTagNames = currentTagNames.filter(tag => tag !== tagToRemove);
        setCurrentTagNames(newTagNames);
        setBlog({ ...blog, tagNames: newTagNames });
    };


    const publishBlog = (e) => {
        if (e.target.className.includes("disable")) {
            return;
        }

        // Validate using current local state which reflects user's final input
        if (!currentTitle.length) {
            return toast.error('Vui lòng nhập tiêu đề cho bài viết.');
        }
        if (!currentExcerpt.length || currentExcerpt.length > charLimit) {
            return toast.error(`Vui lòng viết mô tả trong khoảng ${charLimit} ký tự.`);
        }
        if (!currentTagNames.length) {
            return toast.error("Vui lòng nhập ít nhất 1 thẻ (tag).");
        }
        if (!currentSlug.length) {
            return toast.error("Vui lòng nhập slug cho bài viết.");
        }
        if (!currentCategoryName.length) {
            return toast.error("Vui lòng nhập tên danh mục.");
        }
        if (!src || !src.length) { // src is from context, should be set in BlogEditor
            return toast.error("Vui lòng quay lại và tải lên ảnh bìa.");
        }

        let loadingToast = toast.loading("Đang xuất bản...");
        e.target.classList.add('disable');

        // Construct the blog object to be sent to the backend
        const blogObj = {
            title: currentTitle,
            slug: currentSlug,
            status: "PUBLISHED",
            excerpt: currentExcerpt,
            featuredImage: src, // src from context is the featuredImage URL
            contentBlocks: contentBlocks, // contentBlocks from context (transformed by BlogEditor)
            tagNames: currentTagNames,
            categoryName: currentCategoryName,
            year: blog.year || new Date().getFullYear(),
            color: blog.color || "#000000",
        };
        // Add id to blogObj only if it's an update operation,
        // as createPost might not expect an 'id' field.
        // The updatePost function will need the blogId as a separate parameter.

        let apiPromise;

        if (blogId) { // If blogId exists, it's an update
            // Ensure updatePost function exists in apiFunction.js and handles (blogId, data, token)
            // It should internally use a PUT request.
            apiPromise = updatePost(blogId, blogObj); // Assuming updatePost handles auth via getAuthHeader
        } else { // It's a new post
            apiPromise = createPost(blogObj); // createPost handles auth via getAuthHeader
        }

        apiPromise
            .then((response) => { // response is response.data from your API functions
                e.target.classList.remove('disable');
                toast.dismiss(loadingToast);
                toast.success("Đã xuất bản thành công!");

                setBlog(prev => ({ ...prev, ...response, status: "PUBLISHED" })); // Update context with response from API
                setEditorState("editor");

                setTimeout(() => {
                    navigate(response.slug ? `/blog/${response.slug}` : "/");
                }, 2000);
            })
            .catch((error) => { // error is already the processed error from your API functions
                e.target.classList.remove('disable');
                toast.dismiss(loadingToast);
                // Assuming your API functions throw an error with a 'message' property or are the error object itself
                const errorMessage = error.message || "Lỗi khi xuất bản bài viết.";
                return toast.error(errorMessage);
            });
    }

    return (
        <AnimationWrapper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster />
                <button
                    className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%] bg-white rounded-full flex items-center justify-center shadow-md"
                    onClick={handleCloseEvent}
                >
                    <i className="fi fi-br-cross text-xl"></i>
                </button>

                {/* Preview Section */}
                <div className="max-w-[550px] w-11/12 mx-auto center">
                    <p className="text-dark-grey mb-1">Xem trước</p>
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4 border">
                        <img src={src || defaultBanner} alt="Blog Banner Preview" className="w-full h-full object-cover"/>
                    </div>
                    <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{currentTitle}</h1>
                    <p className="font-gelasio line-clamp-3 text-xl leading-7 mt-4">{currentExcerpt}</p>
                </div>

                {/* Form Section */}
                <div className="w-11/12 mx-auto border-grey lg:border-l lg:pl-8">
                    <p className="text-dark-grey mb-2 mt-9">Tiêu đề bài viết</p>
                    <input
                        type="text"
                        placeholder="Tiêu đề bài viết"
                        value={currentTitle}
                        className="input-box pl-4"
                        onChange={handleBlogTitleChange}
                    />

                    <p className="text-dark-grey mb-2 mt-9">Mô tả ngắn (Excerpt)</p>
                    <textarea
                        maxLength={charLimit}
                        value={currentExcerpt}
                        className="h-40 resize-none leading-7 input-box pl-4"
                        onChange={handleBlogExcerptChange}
                        onKeyDown={handleTextKeyDown} // Use generic keydown handler
                    />
                    <p className="mt-1 text-dark-grey text-sm text-right">
                        {charLimit - currentExcerpt.length} ký tự còn lại
                    </p>

                    <p className="text-dark-grey mb-2 mt-9">Slug (Đường dẫn URL)</p>
                    <input
                        type="text"
                        placeholder="vi-du-slug-bai-viet"
                        value={currentSlug}
                        className="input-box pl-4"
                        onChange={handleSlugChange}
                    />
                    <p className="text-xs text-dark-grey mt-1">Slug sẽ được dùng trong URL. Nên dùng chữ thường, không dấu, nối bằng gạch ngang.</p>


                    <p className="text-dark-grey mb-2 mt-9">Danh mục</p>
                    <input
                        type="text"
                        placeholder="Tên danh mục"
                        value={currentCategoryName}
                        className="input-box pl-4"
                        onChange={handleCategoryNameChange}
                    />

                    <p className="text-dark-grey mb-2 mt-9">Thẻ (Tags) - Giúp tìm kiếm và xếp hạng</p>
                    <div className="relative input-box pl-2 py-2 pb-4">
                        <input
                            type="text"
                            placeholder="Nhập thẻ và nhấn Enter"
                            className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
                            onKeyDown={handleTagKeyDown}
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {currentTagNames.map((tag, i) => (
                                <Tag tag={tag} key={i} onRemove={() => removeTag(tag)} />
                            ))}
                        </div>
                    </div>
                    <p className="mt-1 mb-4 text-dark-grey text-right ">{tagLimit - currentTagNames.length} thẻ còn lại</p>

                    <button className="btn-dark px-8 " onClick={publishBlog}>
                        Xuất bản ngay
                    </button>
                </div>
            </section>
        </AnimationWrapper>
    );
}

export default PublishForm;
