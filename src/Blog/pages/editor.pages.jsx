import { createContext, useContext, useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "@/Blog/Component/blog-editor.component.jsx";
import PublishForm from "@/Blog/Component/publish-form.component.jsx";
import {UserContext} from "@/App.jsx";

// THAY ĐỔI: Thêm `id: null` vào cấu trúc để nhất quán
const BlogStructure = {
    id: null,
    title: "",
    slug: "",
    status: "DRAFT",
    year: new Date().getFullYear(),
    color: "#000000",
    excerpt: "",
    src: "",
    contentBlocks: [],
    tagNames: [],
    categoryName: "",
};

export const EditorContext = createContext({});

const Editor = () => {
    const { slug: blogSlug } = useParams();
    const [blog, setBlog] = useState(BlogStructure);

    // THAY ĐỔI: State `textEditor` giờ sẽ lưu instance của EditorJS hoặc null.
    // Giá trị khởi tạo là null.
    const [textEditor, setTextEditor] = useState(null);

    const [editorState, setEditorState] = useState("editor");
    const [loading, setLoading] = useState(true);
    const { userAuth: { access_token } } = useContext(UserContext);

    useEffect(() => {
        // Mỗi khi slug trên URL thay đổi, chúng ta cần reset lại mọi thứ.
        // Hủy instance editor cũ đi (nếu có) trước khi làm bất cứ điều gì khác.
        if (textEditor && typeof textEditor.destroy === 'function') {
            textEditor.destroy();
            setTextEditor(null); // Reset state trong context
        }

        if (blogSlug) {
            setLoading(true);
            console.log("Chế độ chỉnh sửa cho slug:", blogSlug);
            // TODO: API call to fetch existing blog data
            // Ví dụ: getBlogBySlug(blogSlug).then(data => setBlog(data)).finally(() => setLoading(false));

            // Giả lập tải dữ liệu
            setTimeout(() => {
                setBlog({ ...BlogStructure, id: 'temp-id-from-server', title: 'Blog đang chỉnh sửa', slug: blogSlug });
                setLoading(false);
            }, 500);

        } else {
            // Chế độ tạo mới
            setBlog(BlogStructure);
            setLoading(false);
        }
    }, [blogSlug]); // QUAN TRỌNG: Effect này chỉ chạy khi slug trên URL thay đổi.

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        // Cung cấp state và hàm set mới cho context
        <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}>
            {
                access_token === null
                    ? <Navigate to="/blog/signin" />
                    : editorState === "editor"
                        // QUAN TRỌNG NHẤT: Thuộc tính `key`
                        // Khi key thay đổi, React sẽ UNMOUNT component cũ và MOUNT một component mới.
                        // Điều này đảm bảo useEffect bên trong BlogEditor sẽ được reset đúng cách.
                        // - Khi tạo mới, key là 'new-blog'.
                        // - Khi sửa, key là slug của bài viết.
                        // - Khi lưu nháp lần đầu và được điều hướng, key sẽ đổi từ 'new-blog' -> slug mới,
                        //   kích hoạt việc tạo mới component.
                        ? <BlogEditor key={blogSlug || 'new-blog'} />
                        : <PublishForm />
            }
        </EditorContext.Provider>
    );
};

export default Editor;