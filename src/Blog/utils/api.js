import axios from "axios"

export const api = axios.create({
    // baseURL : "http://localhost:8080"
    baseURL : "http://34.41.181.239:8080"	
})


export const getAuthHeader = () => {
    const token = localStorage.getItem("token"); // Giả sử token được lưu với key "token"
    if (token) {
        return {
            Authorization: `Bearer ${token}`,
            
        };
    }
    return {}; // Trả về object rỗng nếu không có token
};

/* ==========================================================================
   AUTHENTICATION API FUNCTIONS (Dựa trên backend của bạn)
   ========================================================================== */

/**
 * Đăng ký người dùng mới.
 * @param {object} userData - Dữ liệu người dùng để đăng ký.
 * Ví dụ: { username, email, password, firstName, lastName }
 * @returns {Promise<object | string>} - Promise trả về message từ backend.
 * @throws {Error} - Ném lỗi nếu đăng ký thất bại.
 */
export async function registerUser(userData) {
    try {
        const response = await api.post("/auth/register-user", userData, {
            headers: {
                // Không cần auth header cho đăng ký
                "Content-Type": "application/json", // Backend Spring Boot thường nhận JSON
            },
        });
        return response.data; // Backend trả về: "Registration successful!" hoặc lỗi
    } catch (error) {
        console.error("Lỗi khi đăng ký người dùng:", error.response?.data || error.message);
        // Backend của bạn trả về message lỗi trực tiếp trong body khi HttpStatus.CONFLICT
        throw error.response?.data || new Error("Không thể đăng ký người dùng.");
    }
}

/**
 * Đăng nhập người dùng (local).
 * @param {object} credentials - Dữ liệu đăng nhập. Ví dụ: { email, password }
 * @returns {Promise<object>} - Promise trả về JwtResponse từ backend.
 * Ví dụ: { token, type, id, username, email, roles }
 * @throws {Error} - Ném lỗi nếu đăng nhập thất bại.
 */
export async function loginUser(credentials) {
    try {
        const response = await api.post("/auth/login/local", credentials, {
            headers: {
                // Không cần auth header cho đăng nhập
                "Content-Type": "application/json",
            },
        });
        return response.data; // Backend trả về JwtResponse
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error.response?.data || error.message);
        throw error.response?.data || new Error("Không thể đăng nhập.");
    }
}

/**
 * Chuyển hướng người dùng đến trang đăng nhập Google của backend.
 * Hàm này không phải là một API call trực tiếp bằng axios mà là điều hướng trình duyệt.
 */
export function googleLoginRedirect() {
    // Đảm bảo api.defaults.baseURL đã được thiết lập chính xác
    window.location.href = `${api.defaults.baseURL}/auth/login/google`;
}


/* ==========================================================================
   IMAGE API FUNCTIONS (Giữ nguyên từ file của bạn)
   ========================================================================== */
export async function uploadImage(imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
        const response = await api.post("/api/images/upload", formData, {
            headers: {
                ...getAuthHeader(), // Token có thể cần nếu upload ảnh yêu cầu đăng nhập
                "Content-Type": "multipart/form-data", // Quan trọng cho việc upload file
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tải ảnh lên:", error.response?.data || error.message);
        throw error.response?.data || new Error("Không thể tải ảnh lên.");
    }
}

/* ==========================================================================
   IMAGE API FUNCTIONS
   ========================================================================== */

/**
 * Tải một file ảnh lên server.
 * @param {File} imageFile - File ảnh cần tải lên.
 * @returns {Promise<object>} - Promise trả về object chứa URL của ảnh đã tải lên (ví dụ: { url: "..." }).
 * @throws {Error} - Ném lỗi nếu upload thất bại.
// export async function uploadImage(imageFile) {
//     const formData = new FormData();
//     formData.append("file", imageFile); // "file" phải khớp với @RequestParam("file") ở backend

//     try {
//         const response = await api.post("/api/images/upload", formData, {
//             headers: {
//                 ...getAuthHeader(), // Gửi kèm token nếu API yêu cầu xác thực
//                 "Content-Type": "multipart/form-data", // Quan trọng cho việc upload file
//             },
//         });
//         return response.data; // Backend trả về { url: "..." }
//     } catch (error) {
//         console.error("Lỗi khi tải ảnh lên:", error.response?.data || error.message);
//         throw error.response?.data || new Error("Không thể tải ảnh lên.");
//     }
// }


/* ==========================================================================
   POST API FUNCTIONS
   ========================================================================== */

/**
 * Tạo một bài viết mới.
 * @param {object} postData - Dữ liệu bài viết, khớp với PostRequest DTO ở backend.
 * Ví dụ: { title, slug, authorId, status, excerpt, featuredImage, contentBlocks, tagNames, categoryName }
 * @returns {Promise<object>} - Promise trả về dữ liệu của bài viết đã tạo (PostResponse DTO).
 * @throws {Error} - Ném lỗi nếu tạo bài viết thất bại.
 */
export async function createPost(postData) {
    try {
        const response = await api.post("/api/posts", postData, {
            headers: {
                ...getAuthHeader(),
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo bài viết:", error.response?.data || error.message);
        throw error.response?.data || new Error("Không thể tạo bài viết.");
    }
}

/**
 * Lấy tất cả bài viết, có hỗ trợ phân trang và sắp xếp.
 * @param {number} page - Số trang (bắt đầu từ 0).
 * @param {number} size - Số lượng bài viết trên mỗi trang.
 * @param {string} sort - Chuỗi sắp xếp (ví dụ: "createdAt,desc" hoặc "title,asc").
 * @returns {Promise<object>} - Promise trả về đối tượng Page chứa danh sách bài viết.
 * @throws {Error} - Ném lỗi nếu không lấy được danh sách.
 */
export async function getAllPosts(page = 0, size = 10, sort = "publishedAt,desc") {
    try {
        const response = await api.get("/api/posts", {
            params: {
                page,
                size,
                sort,
            },
            headers: {
                ...getAuthHeader(), // Có thể không cần token nếu API này public
            },
        });
        return response.data; // Dữ liệu dạng Page<PostResponse>
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bài viết:", error.response?.data || error.message);
        throw error.response?.data || new Error("Không thể lấy danh sách bài viết.");
    }
}

/**
 * Lấy chi tiết một bài viết bằng ID hoặc slug.
 * @param {string | number} idOrSlug - ID (số) hoặc slug (chuỗi) của bài viết.
 * @returns {Promise<object>} - Promise trả về dữ liệu chi tiết của bài viết (PostResponse DTO).
 * @throws {Error} - Ném lỗi nếu không tìm thấy bài viết hoặc có lỗi khác.
 */
export async function getPost(idOrSlug) {
    try {
        const response = await api.get(`/api/posts/${idOrSlug}`, {
            headers: {
                ...getAuthHeader(), // Có thể không cần token nếu API này public
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi lấy bài viết "${idOrSlug}":`, error.response?.data || error.message);
        throw error.response?.data || new Error(`Không thể lấy bài viết "${idOrSlug}".`);
    }
}

/**
 * Cập nhật một bài viết đã có.
 * @param {number} postId - ID của bài viết cần cập nhật.
 * @param {object} postData - Dữ liệu cập nhật cho bài viết, khớp với PostRequest DTO.
 * @returns {Promise<object>} - Promise trả về dữ liệu của bài viết đã cập nhật (PostResponse DTO).
 * @throws {Error} - Ném lỗi nếu cập nhật thất bại.
 */
export async function updatePost(postId, postData) {
    try {
        const response = await api.put(`/api/posts/${postId}`, postData, {
            headers: {
                ...getAuthHeader(),
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Lỗi khi cập nhật bài viết ID ${postId}:`, error.response?.data || error.message);
        throw error.response?.data || new Error(`Không thể cập nhật bài viết ID ${postId}.`);
    }
}

/**
 * Xóa một bài viết.
 * @param {number} postId - ID của bài viết cần xóa.
 * @returns {Promise<string | object>} - Promise trả về thông báo thành công hoặc một object rỗng.
 * @throws {Error} - Ném lỗi nếu xóa thất bại.
 */
export async function deletePost(postId) {
    try {
        const response = await api.delete(`/api/posts/${postId}`, {
            headers: {
                ...getAuthHeader(),
            },
        });
        // Backend có thể trả về 204 No Content (không có body) hoặc một JSON message
        return response.data || "Bài viết đã được xóa thành công.";
    } catch (error) {
        console.error(`Lỗi khi xóa bài viết ID ${postId}:`, error.response?.data || error.message);
        throw error.response?.data || new Error(`Không thể xóa bài viết ID ${postId}.`);
    }
}

/* ==========================================================================
   (Tùy chọn) USER, TAG, CATEGORY API FUNCTIONS
   Nếu bạn có các API CRUD cho User, Tag, Category, bạn có thể thêm chúng ở đây.
   Ví dụ:

   export async function getAllTags() { ... }
   export async function getPostsByTag(tagSlug, page, size) { ... }
   export async function getAllCategories() { ... }
   export async function getPostsByCategory(categorySlug, page, size) { ... }
   ========================================================================== */