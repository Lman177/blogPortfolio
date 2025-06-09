import { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '@/App.jsx'; // Điều chỉnh đường dẫn nếu cần
import { storeInSession } from '@/Blog/Common2/session.jsx'; // Điều chỉnh đường dẫn
import { toast, Toaster } from 'react-hot-toast';

const OAuthCallbackPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setUserAuth } = useContext(UserContext);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const id = params.get('id');
        const email = params.get('email');
        const username = params.get('username');
        const picture = params.get('picture');
        const role = params.get('role'); // Nếu backend gửi role, có thể là 'admin', 'user', v.v.
        // const rolesString = params.get('roles'); // Nếu backend gửi roles

        if (token && email) { // Kiểm tra token và email là bắt buộc
            const userData = {
                access_token: token,
                id: id || '', // Có thể là null nếu không được gửi hoặc không có trong User entity
                username: decodeURIComponent(email), // Giải mã nếu cần (thường trình duyệt tự làm)
                email: username ? decodeURIComponent(username) : 'User', // Cung cấp giá trị mặc định
                picture: picture ? decodeURIComponent(picture) : '', // URL ảnh
                role: role ? decodeURIComponent(role) : ''
            };

            // Lưu trữ vào session và cập nhật context
            storeInSession('user', JSON.stringify(userData));
            setUserAuth(userData);

            toast.success('Logged in successfully with Google!');
            // Điều hướng đến trang chính sau khi đăng nhập
            // Bạn có thể lưu lại trang người dùng muốn truy cập trước khi redirect sang Google
            // và điều hướng về đó, hoặc mặc định là trang chủ/blog
            navigate('/blog');
        } else {
            console.error("OAuth callback error: Missing token or essential user info.");
            toast.error('Google login failed. Please try again.');
            navigate('/blog/signin'); // Điều hướng về trang đăng nhập
        }
    }, [location, navigate, setUserAuth]);

    return (
        <div className="h-cover flex items-center justify-center">
            <Toaster />
            <p className="text-xl">Processing Google login...</p>
            {/* Bạn có thể thêm một spinner ở đây */}
        </div>
    );
};

export default OAuthCallbackPage;