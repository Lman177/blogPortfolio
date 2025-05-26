import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/input.component";
import googleicon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { toast, Toaster } from "react-hot-toast";
// Bỏ axios import ở đây vì đã dùng trong ApiFunctions.js
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
// Import các hàm API mới
import { registerUser, loginUser, googleLoginRedirect } from "./ApiFunctions"; // Điều chỉnh đường dẫn nếu cần

const UserAuthForm = ({ type }) => {
    let { userAuth: { access_token } = {}, setUserAuth } = useContext(UserContext);

    // Bỏ hàm userAuthThroughServer vì logic gọi API đã chuyển vào ApiFunctions.js

    const handleSubmit = async (e) => { // Thêm async ở đây
        e.preventDefault();

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

        const formElement = document.getElementById("formElement");
        if (!formElement) {
            toast.error("Lỗi: Không tìm thấy form element.");
            return;
        }
        const form = new FormData(formElement);
        let formDataObject = {};
        for (let [key, value] of form.entries()) {
            formDataObject[key] = value;
        }

        let { fullname, email, password } = formDataObject;

        // Client-side validation
        if (type !== "sign-in" && fullname) {
            if (fullname.toString().length < 3) {
                return toast.error("Họ tên đầy đủ nên có ít nhất 3 ký tự.");
            }
        }
        if (!email || !email.length) return toast.error("Vui lòng nhập Email.");
        if (!emailRegex.test(email)) return toast.error("Email không hợp lệ.");
        if (!passwordRegex.test(password)) return toast.error("Mật khẩu phải từ 6-20 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 số.");

        let payload = {};
        let apiFunction;

        if (type === "sign-in") {
            payload = { email, password };
            apiFunction = loginUser;
        } else { // Đăng ký
            const nameParts = fullname ? fullname.split(" ") : ["", ""];
            payload = {
                username: email,
                email,
                password,
                firstName: nameParts[0] || email.split('@')[0],
                lastName: nameParts.slice(1).join(" ") || "User"
            };
            apiFunction = registerUser;
        }

        try {
            const data = await apiFunction(payload); // Gọi hàm API tương ứng

            if (type === "sign-in") { // Xử lý sau khi đăng nhập thành công
                // Giả sử JwtResponse từ backend của bạn có dạng:
                // { token: "jwt_string", type: "Bearer", id: 1, username: "user@example.com", email: "user@example.com", roles: ["ROLE_USER"] }
                const userDataForContext = {
                    access_token: data.token, // Quan trọng!
                    email: data.email,
                    fullname: data.username, // Hoặc tên bạn muốn hiển thị
                    id: data.id,
                    roles: data.roles
                };
                storeInSession("user", JSON.stringify(userDataForContext));
                setUserAuth(userDataForContext);
                toast.success("Đăng nhập thành công!");
            } else { // Xử lý sau khi đăng ký thành công
                toast.success(data.message || data || "Đăng ký thành công! Vui lòng đăng nhập.");
                // Tùy chọn: Chuyển hướng đến trang đăng nhập
                // navigate("/signin"); // Nếu bạn dùng useNavigate từ react-router-dom
            }
        } catch (error) {
            // Hàm API đã console.error, ở đây chỉ cần hiển thị toast
            // error đã là message lỗi từ backend hoặc message mặc định từ ApiFunctions
            toast.error(typeof error === 'string' ? error : (error.message || "Đã có lỗi xảy ra."));
        }
    };

    const handleGoogleAuth = (e) => {
        e.preventDefault();
        googleLoginRedirect(); // Gọi hàm điều hướng từ ApiFunctions.js
    };

    if (access_token) {
        return <Navigate to="/" />;
    }

    return (
        <AnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <Toaster />
                <form id="formElement" className="w-[80%] max-w-[400px]" onSubmit={handleSubmit}>
                    {/* ... JSX của form giữ nguyên ... */}
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                        {type === "sign-in" ? "Chào mừng trở lại" : "Tham gia ngay"}
                    </h1>
                    {
                        type !== "sign-in" ?
                            <InputBox name="fullname" type="text" placeholder="Họ tên đầy đủ" icon="fi-rr-user" />
                            : ""
                    }
                    <InputBox name="email" type="email" placeholder="Email" icon="fi-rr-at" />
                    <InputBox name="password" type="password" placeholder="Mật khẩu" icon="fi-rr-key" />
                    <button className="btn-dark center mt-10" type="submit">
                        {type.replace("-", " ")}
                    </button>
                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        <p>hoặc</p>
                        <hr className="w-1/2 border-black" />
                    </div>
                    <button type="button" className="btn-dark flex items-center justify-center gap-4 w-[90%] center" onClick={handleGoogleAuth}>
                        <img src={googleicon} className="w-5" alt="Google icon" />Tiếp tục với Google
                    </button>
                    {
                        type === "sign-in" ?
                            <p className="mt-6 text-dark-grey text-xl text-center">
                                Chưa có tài khoản?
                                <Link to="/signup" className="underline text-black text-xl ml-1">Đăng ký ngay</Link>
                            </p>
                            :
                            <p className="mt-6 text-dark-grey text-xl text-center">
                                Đã là thành viên?
                                <Link to="/signin" className="underline text-black text-xl ml-1">Đăng nhập tại đây.</Link>
                            </p>
                    }
                </form>
            </section>
        </AnimationWrapper>
    );
};

export default UserAuthForm;