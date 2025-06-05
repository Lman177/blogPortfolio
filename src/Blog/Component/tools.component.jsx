// src/components/tools.component.jsx (Hoặc đường dẫn tương tự của bạn)

import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph'; // Mặc dù thường là mặc định, thêm vào cho rõ ràng
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';

// Import hàm uploadImage của bạn (đã bao gồm logic gọi API và xử lý access_token)
// Đường dẫn này cần phải chính xác đến file apiFunction.js của bạn
import { uploadImage as uploadImageApi } from '@/Blog/Common2/apiFunction.js';

/**
 * Hàm này lấy access_token từ localStorage.
 * Đây là một cách phổ biến để cung cấp token cho cấu hình uploader tĩnh của EditorJS.
 * Hãy đảm bảo rằng bạn lưu access_token vào localStorage với key 'user' khi người dùng đăng nhập.
 * Hoặc, bạn có thể điều chỉnh hàm này để lấy token từ một nguồn khác nếu cần.
 */
const getAccessTokenFromSession = () => {
    const userStr = sessionStorage.getItem("user");
    if (!userStr) return {};
    try {
        const user = JSON.parse(userStr);
        if (user.token) {
            return {
                Authorization: `Bearer ${user.token}`,
            };
        }
    } catch (e) {
        // Invalid JSON, ignore
    }
    return {};
};

export const tools = {
    paragraph: {
        class: Paragraph,
        inlineToolbar: true, // Cho phép các định dạng inline như bold, italic
        config: {
            placeholder: 'Nhập nội dung đoạn văn...'
        }
    },
    header: {
        class: Header,
        inlineToolbar: true,
        config: {
            placeholder: 'Nhập tiêu đề',
            levels: [2, 3, 4], // Cho phép H2, H3, H4
            defaultLevel: 2    // Mặc định là H2
        }
    },
    image: {
        class: ImageTool,
        config: {
            // Cấu hình uploader để tải ảnh lên server của bạn
            uploader: {
                /**
                 * Hàm uploadByFile sẽ được gọi khi người dùng chọn một file ảnh.
                 * @param {File} file - File ảnh người dùng đã chọn.
                 * @return {Promise<{success: number, file: {url: string, caption?: string}}}>}
                 * - success: 1 nếu thành công, 0 nếu thất bại.
                 * - file.url: URL của ảnh đã được tải lên.
                 * - file.caption (tùy chọn): Chú thích mặc định cho ảnh.
                 */
                uploadByFile(file) {
                    const accessToken = getAccessTokenFromSession();

                    // Nếu không có accessToken, bạn có thể từ chối việc upload
                    // Hoặc hàm uploadImageApi của bạn sẽ tự xử lý việc thiếu token.
                    // Ở đây, chúng ta vẫn gọi uploadImageApi và để nó xử lý lỗi nếu có.

                    return uploadImageApi(file, accessToken) // Sử dụng hàm uploadImage của bạn
                        .then(imageUrl => {
                            if (imageUrl && typeof imageUrl.url === 'string') {
                                return {
                                    success: 1,
                                    file: {
                                        url: imageUrl.url,
                                        // Bạn có thể để trống caption ở đây, người dùng sẽ tự nhập
                                        // caption: file.name // Hoặc đặt tên file làm caption mặc định
                                    }
                                };
                            } else {
                                console.error("uploadImageApi không trả về URL hợp lệ:", imageUrl);
                                return {
                                    success: 0,
                                    message: "Không thể tải ảnh lên hoặc URL không hợp lệ."
                                };
                            }
                        })
                        .catch(err => {
                            console.error("Lỗi upload ảnh trong EditorJS ImageTool:", err);
                            return {
                                success: 0,
                                message: err.message || "Lỗi không xác định khi tải ảnh."
                            };
                        });
                },

                /**
                 * (Tùy chọn) Xử lý khi người dùng dán URL ảnh.
                 * uploadByUrl(url) {
                 * // Logic để server của bạn tải ảnh từ URL này về và lưu trữ,
                 * // sau đó trả về URL mới trên server của bạn.
                 * // return fetch('/api/fetch-image-by-url', { method: 'POST', body: JSON.stringify({url}) })
                 * //   .then(res => res.json())
                 * //   .then(data => ({ success: 1, file: { url: data.url } }));
                 * }
                 */
            },
            // (Tùy chọn) Các nút chức năng cho block ảnh
            // actions: [
            //     {
            //         name: 'new_button',
            //         icon: '<svg>...</svg>',
            //         title: 'New Button',
            //         action: (name) => {
            //             alert(`${name} button clicked`);
            //         }
            //     }
            // ]
        }
    },
    list: {
        class: List,
        inlineToolbar: true, // Cho phép các định dạng inline trong mục danh sách
        config: {
            defaultStyle: 'unordered' // 'ordered' (có số) hoặc 'unordered' (dấu chấm)
        }
    },
    // quote: {
    //     class: Quote,
    //     inlineToolbar: true,
    //     config: {
    //         quotePlaceholder: 'Nhập trích dẫn',
    //         captionPlaceholder: 'Tác giả trích dẫn',
    //     },
    // },
    // embed: Embed, // Cho phép nhúng video YouTube, Vimeo, etc.
    // delimiter: Delimiter, // Thêm một đường kẻ ngang phân cách
    // Bạn có thể thêm các tools khác tại đây
    // Ví dụ: Table, Code, Checklist, Raw HTML, etc.
};
