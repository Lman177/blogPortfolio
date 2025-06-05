import axios from "axios"
import error from "eslint-plugin-react/lib/util/error.js";

export const api = axios.create({
    baseURL : "http://localhost:8080"
    // baseURL : "http://34.41.181.239:8080"
})


export const getAuthHeader = () => {
    const userStr = sessionStorage.getItem("user");
    // console.log("[getAuthHeader] userStr từ sessionStorage:", userStr); // DEBUG

    if (!userStr) {
        // console.warn("[getAuthHeader] Không tìm thấy 'user' trong sessionStorage.");
        return {};
    }

    try {
        const user = JSON.parse(userStr);
        // console.log("[getAuthHeader] user sau khi JSON.parse:", user); // DEBUG

        if (user && user.access_token) {
            // console.log("[getAuthHeader] Tìm thấy token:", user.access_token); // DEBUG
            return {
                Authorization: `Bearer ${user.access_token}`,
            };
        } else {
            console.warn("[getAuthHeader] Object 'user' không hợp lệ hoặc không có 'token'.", user);
        }
    } catch (e) {
        console.error("[getAuthHeader] Lỗi khi parse JSON từ sessionStorage:", e);
        // Xóa item bị lỗi khỏi sessionStorage để tránh lỗi lặp lại
        // sessionStorage.removeItem("user"); // Cân nhắc nếu muốn tự động xóa
    }
    return {};
};




/* ==========================================================================
   AUTHENTICATION API FUNCTIONS
   ========================================================================== */

/**
 * Đăng ký người dùng mới.
 * @param {object} userData - Dữ liệu người dùng. Ví dụ: { fullname, email, password }
 * @returns {Promise<object>} - Promise trả về JwtResponse từ backend nếu đăng ký thành công và backend hỗ trợ auto-login.
 * Hoặc một thông báo/dữ liệu khác tùy theo thiết kế backend.
 * @throws {Error|object} - Ném lỗi (có thể là object lỗi từ backend) nếu đăng ký thất bại.
 */
export async function registerUser(userData) {
    try {
        // Axios tự động đặt 'Content-Type': 'application/json' khi payload là object
        const response = await api.post("/auth/register-user", userData);
        // Backend ĐÃ ĐƯỢC CẬP NHẬT để trả về JwtResponse sau khi đăng ký thành công (auto-login).
        // Nếu backend chỉ trả về message dạng string, thì comment cũ ("Registration successful!") sẽ đúng hơn.
        return response.data;
    } catch (error) {
        console.error("Lỗi khi đăng ký người dùng:", error.response?.data || error.message);
        // Ném lỗi từ backend (nếu có) hoặc tạo một Error mới
        throw error.response?.data || new Error("Không thể đăng ký người dùng. Vui lòng thử lại.");
    }
}

/**
 * Đăng nhập người dùng (local).
 * @param {object} credentials - Dữ liệu đăng nhập. Ví dụ: { email, password }
 * @returns {Promise<object>} - Promise trả về JwtResponse từ backend.
 * Ví dụ: { token, type, id, username, email, roles }
 * @throws {Error|object} - Ném lỗi (có thể là object lỗi từ backend) nếu đăng nhập thất bại.
 */
export async function loginUser(credentials) {
    try {
        // Axios tự động đặt 'Content-Type': 'application/json' khi payload là object
        const response = await api.post("/auth/login/local", credentials);
        return response.data; // Backend trả về JwtResponse
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error.response?.data || error.message);
        // Ném lỗi từ backend (nếu có) hoặc tạo một Error mới
        throw error.response?.data || new Error("Không thể đăng nhập. Vui lòng kiểm tra thông tin và thử lại.");
    }
}

/**
 * Chuyển hướng người dùng đến trang đăng nhập Google của backend.
 * Hàm này không phải là một API call trực tiếp bằng axios mà là điều hướng trình duyệt.
 */
// export function handleGoogleAuth() {
//     // Đảm bảo api.defaults.baseURL đã được thiết lập chính xác
//     window.location.href = `${api.defaults.baseURL}/auth/login/google`;
// }
export const GoogleAuthUrl = `${api.defaults.baseURL}/auth/login/google`;


/* ==========================================================================
   IMAGE API FUNCTIONS
   ========================================================================== */
export async function uploadImage(imageFile) {
    if (!imageFile) {
        console.error("[uploadImage] imageFile không được cung cấp.");
        throw new Error("Vui lòng chọn một file ảnh.");
    }

    const formData = new FormData();
    formData.append("file", imageFile); // "file" phải khớp với @RequestParam("file") ở backend

    const authHeader = getAuthHeader();
    // console.log("[uploadImage] Auth Header sẽ được sử dụng:", authHeader); // DEBUG

    const headers = {
        ...authHeader, // Gửi kèm token nếu API yêu cầu xác thực
        // "Content-Type": "multipart/form-data" sẽ được Axios tự động đặt đúng khi bạn truyền FormData.
        // Tuy nhiên, nếu bạn gặp vấn đề, bạn có thể thử bỏ comment dòng dưới, nhưng thường là không cần thiết.
        // "Content-Type": "multipart/form-data",
    };
    // console.log("[uploadImage] Toàn bộ headers sẽ được gửi:", headers); // DEBUG


    try {
        // Giả sử 'api' là một instance của Axios đã được cấu hình
        // import api from './axiosConfig'; // Ví dụ
        const response = await api.post("/api/images/upload", formData, {
            headers: headers,
        });
        // console.log("[uploadImage] Phản hồi thành công từ server:", response.data);
        return response.data; // Backend thường trả về { url: "..." } hoặc cấu trúc mới như đã thảo luận
    } catch (error) {
        console.error("[uploadImage] Lỗi khi tải ảnh lên:", error);
        if (error.response) {
            // Request đã được gửi và server phản hồi với mã lỗi
            // console.error("[uploadImage] Data lỗi từ server:", error.response.data);
            // console.error("[uploadImage] Status lỗi từ server:", error.response.status);
            // console.error("[uploadImage] Headers lỗi từ server:", error.response.headers);
            // Nếu lỗi 401 hoặc 403, rất có thể là do token không hợp lệ hoặc thiếu quyền
            if (error.response.status === 401 || error.response.status === 403) {
                throw new Error(`Lỗi xác thực (${error.response.status}): Token không hợp lệ hoặc bạn không có quyền thực hiện hành động này. Vui lòng đăng nhập lại.`);
            }
            throw error.response.data || new Error(`Không thể tải ảnh lên. Lỗi server: ${error.response.status}`);
        } else if (error.request) {
            // Request đã được gửi nhưng không nhận được phản hồi
            // console.error("[uploadImage] Không nhận được phản hồi từ server:", error.request);
            throw new Error("Không thể kết nối đến server để tải ảnh lên. Vui lòng kiểm tra kết nối mạng.");
        } else {
            // Có lỗi xảy ra khi thiết lập request
            // console.error("[uploadImage] Lỗi khi thiết lập request:", error.message);
            throw new Error(`Lỗi khi chuẩn bị tải ảnh: ${error.message}`);
        }
    }
}


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
export async function getAllPosts(page = 0, size = 5, sort = "") {
    try {
        const response = await api.get("/api/posts/get", {
            params: {
                page,
                size,
                sort,
            },
            headers: {
                // ...getAuthHeader(), // Có thể không cần token nếu API này public
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
        const response = await api.get(`/api/posts`, {
            params: {
                idOrSlug // Gửi ID hoặc slug bài viết qua query parameter
            },
            headers: {
                // ...getAuthHeader(), // Có thể không cần token nếu API này public
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
        const response = await api.put(`/api/posts/update`, postData, {
            params: {
                postId, // Gửi ID bài viết qua query parameter
            },
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
        const response = await api.delete(`/api/posts/delete`, {
            params: {
                postId, // Gửi ID bài viết qua query parameter
            },
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

/* Lấy danh sách các bài viết liên quan đến một bài viết cụ thể.
*
* @param {number|string} postId ID của bài viết hiện tại.
* @param {object} [options] Các tùy chọn cho việc lấy bài viết liên quan.
* @param {number} [options.limit=3] Số lượng bài viết liên quan tối đa muốn lấy.
* @param {string} [options.category] Tên category của bài viết hiện tại (để tìm kiếm chính xác hơn).
* @param {string[]} [options.tags] Một mảng các tên tag của bài viết hiện tại.
* @returns {Promise<Array<object>>} Một Promise giải quyết với một mảng các đối tượng bài viết liên quan.
* @throws {Error} Nếu yêu cầu API thất bại hoặc trả về lỗi.
*/
export async function getRelatedPosts(postId, options = {}) {
    if (!postId) {
        // Nhất quán với việc throw Error object
        // const error = new Error('postId là bắt buộc để lấy bài viết liên quan.');
        console.error('Lỗi khi lấy bài viết liên quan:', error.message);
        throw error;
    }

    const { limit = 3, category, tags } = options;

    // Xây dựng URL với các query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());

    if (postId){
        queryParams.append('postId', postId.toString());
    }
    if (category) {
        queryParams.append('category', category);
    }

    if (tags && Array.isArray(tags) && tags.length > 0) {
        tags.forEach(tag => queryParams.append('tags', tag));
    }

    const endpoint = `/api/posts/related?${queryParams.toString()}`;
    // Nếu bạn có BASE_URL và đối tượng `api` không tự động thêm nó:
    // const fullEndpoint = `${BASE_URL}/api/posts/${postId}/related?${queryParams.toString()}`;

    // console.log(`Đang gọi API lấy bài viết liên quan: ${endpoint}`);

    try {

        const response = await api.get(endpoint, { // Thay thế 'api.get' bằng cách gọi API của bạn
            headers: {
                // ...getAuthHeader(), // Có thể không cần token nếu API này public
                'Content-Type': 'application/json', // Thường không cần cho GET request với Axios, nhưng để cho rõ ràng
            },
        });
        return response.data;

    } catch (error) {
        // Xử lý lỗi theo cấu trúc của getPost
        // error.response?.data là cấu trúc lỗi phổ biến từ Axios khi server trả về lỗi HTTP
        const errorMessage = `Không thể lấy danh sách bài viết liên quan cho postId "${postId}".`;
        console.error(`Lỗi khi lấy bài viết liên quan cho postId "${postId}":`, error.response?.data || error.message || error);

        // Ném lỗi theo cấu trúc mong muốn
        // Nếu error.response.data đã là một object lỗi chuẩn từ backend, dùng nó.
        // Nếu không, tạo một Error object mới.
        if (error.response?.data) {
            // Nếu backend trả về một cấu trúc lỗi cụ thể (ví dụ: { message: "...", details: "..." })
            // bạn có thể muốn ném lại error.response.data hoặc một phần của nó.
            // Để đơn giản và nhất quán với ví dụ getPost, chúng ta có thể làm như sau:
            throw error.response.data; // Giả định backend trả về lỗi có thể throw được
        } else {
            throw new Error(errorMessage);
        }
    }
}

/**
 * Lấy danh sách các bài viết theo category.
 * @param {string} name - Slug của tag muốn lấy bài viết.
 * @param {number} [page=0] - Số trang (bắt đầu từ 0).
 * @param {number} [size=8] - Số lượng bài viết trên mỗi trang.
 * @returns {Promise<object>} - Promise trả về đối tượng Page chứa danh sách bài viết.
 * @throws {Error} - Ném lỗi nếu không lấy được danh sách.
 */
export async function getPostsByCategory(name, page = 0, size = 8) {
    if (!name) {
        console.error("Lỗi khi lấy bài viết theo category: 'name' là bắt buộc.");
        throw new Error("'name' là bắt buộc để lấy bài viết theo category.");
    }

    try {
        const response = await api.get(`/api/posts/category`, {
            params: {
                name,
                page,
                size,
            },
            headers: {
                // ...getAuthHeader(), // Có thể không cần token nếu API này public
            },
        });
        return response.data; // Dữ liệu dạng Page<PostResponse>
    } catch (error) {
        console.error(`Lỗi khi lấy bài viết theo category "${name}":`, error.response?.data || error.message);
        throw error.response?.data || new Error(`Không thể lấy danh sách bài viết theo category "${name}".`);
    }
}



 // Lấy danh sách Category
export async function getAllCategories() {
    try {
        const response = await api.get("/api/categories", {
            headers: {
            },
        });
        return response.data; // Giả sử backend trả về danh sách category
    } catch (error) {
        console.error("Lỗi khi lấy danh sách category:", error.response?.data || error.message);
        throw error.response?.data || new Error("Không thể lấy danh sách category.");
    }
}

