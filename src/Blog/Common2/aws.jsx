// import axios from "axios";
//
// export const uploadImage = async (imgFile) => {
//     // imgFile ở đây là đối tượng File lấy từ input
//     if (!imgFile) {
//         throw new Error("No image file provided for upload.");
//     }
//
//     // 1. Tạo đối tượng FormData
//     // FormData được sử dụng để gửi dữ liệu dưới dạng multipart/form-data,
//     // rất cần thiết khi upload file.
//     const formData = new FormData();
//
//     // 2. Thêm file vào FormData
//     // Key 'file' phải khớp với @RequestParam("file") trong controller Spring Boot của bạn.
//     formData.append('file', imgFile);
//
//     try {
//         // 3. Gửi request POST đến backend
//         // Endpoint là "/upload" như trong @PostMapping của bạn.
//         // Headers 'Content-Type': 'multipart/form-data' sẽ được axios tự động đặt khi bạn truyền FormData.
//         const response = await axios.post(
//             import.meta.env.VITE_SERVER_DOMAIN + "/upload", // Đảm bảo VITE_SERVER_DOMAIN trỏ đúng đến backend của bạn
//             formData,
//             {
//                 headers: {
//                     // 'Content-Type': 'multipart/form-data' // Axios sẽ tự động đặt header này khi data là FormData
//                     // Bạn có thể thêm các headers khác nếu cần, ví dụ như Authorization token
//                     // 'Authorization': `Bearer ${your_access_token}`
//                 }
//             }
//         );
//
//         // 4. Xử lý response từ backend
//         // Backend của bạn trả về { "url": "your-file-url" }
//         if (response.data && response.data.url) {
//             return response.data.url; // Trả về URL của ảnh đã được upload
//         } else {
//             // Trường hợp backend không trả về URL như mong đợi
//             throw new Error("Server did not return a valid image URL.");
//         }
//
//     } catch (error) {
//         console.error("Error uploading image:", error);
//         // Xử lý lỗi chi tiết hơn nếu có response từ server
//         if (error.response) {
//             console.error("Server responded with error:", error.response.data);
//             throw new Error(error.response.data.message || "Could not upload the image. Server error.");
//         } else if (error.request) {
//             // Request được tạo nhưng không nhận được response
//             console.error("No response received from server:", error.request);
//             throw new Error("Could not upload the image. No response from server.");
//         } else {
//             // Lỗi xảy ra khi thiết lập request
//             console.error("Error setting up the request:", error.message);
//             throw new Error("Could not upload the image. Request setup error.");
//         }
//     }
// };
