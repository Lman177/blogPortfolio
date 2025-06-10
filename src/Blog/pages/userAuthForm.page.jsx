import { Link, Navigate, useNavigate } from "react-router-dom";
import googleicon from "../imgs/google.png";
import { useContext } from "react";
import { toast, Toaster } from "react-hot-toast";
import {storeInSession} from "@/Blog/Common2/session.jsx";
import {handleGoogleAuth, loginUser, registerUser} from "@/Blog/Common2/apiFunction.js";
import AnimationWrapper from "@/Blog/Common2/page-animation.jsx";
import InputBox from "@Common/input.component.jsx";
import {UserContext} from "@/App.jsx";
const UserAuthForm = ({ type }) => {
    // const authForm = useRef(); // This ref was not used in the provided code.
    const navigate = useNavigate(); // <-- THÊM DÒNG NÀY

    let { userAuth: {access_token }, setUserAuth } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Regular expressions for email and password validation
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

        //form data from the form with id="formElement"
        let formElement = document.getElementById("formElement");
        if (!formElement) {
            toast.error("Form element not found!");
            return;
        }
        let form = new FormData(formElement);
        let formData = {};
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { username, email, password } = formData;

        // Frontend Validations
        // if (type !== "sign-in") { // Sign-up specific validation
        //     if (!username || username.toString().length < 3) {
        //         return toast.error("User Name must be at least 3 letters long");
        //     }
        // }
        //
        // if (!email || !email.length) {
        //     return toast.error("Enter Email");
        // }
        // if (!emailRegex.test(email)) {
        //     return toast.error("Enter a valid email address");
        // }
        // if (!password || !passwordRegex.test(password)) {
        //     return toast.error("Password must be 6-20 characters long, with at least one uppercase letter, one lowercase letter, and one digit.");
        // }

        // API Call
        try {
            let response;
            if (type === "sign-in") {
                response = await loginUser({ email, password });
                toast.success("Login successful!");
            } else { // sign-up
                // Ensure the backend DTO for registration expects 'username', 'email', 'password'
                response = await registerUser({ username, email, password });
                toast.success("Registration successful! Logged in.");
            }


            // --- Bắt đầu đoạn mã đã được sửa ---
            const jwtResponseData = response; // SỬA Ở ĐÂY: Nếu response đã là response.data từ hàm API


            console.log("Dữ liệu phản hồi để xử lý:", jwtResponseData);

            if (jwtResponseData && jwtResponseData.token) { // Kiểm tra jwtResponseData và token có hợp lệ

                const userDataForState = {
                    access_token: jwtResponseData.token, // Lấy JWT làm access_token
                    id: jwtResponseData.id,
                    email: jwtResponseData.email,
                    roles: jwtResponseData.roles,
                    username: jwtResponseData.userName || "",
                    currentPlan: jwtResponseData.currentPlan
                };
                storeInSession("user", JSON.stringify(userDataForState));

                setUserAuth(userDataForState);

                // toast.success("Đăng nhập/Đăng ký thành công!"); // Có thể thêm thông báo
            } else {
                let errorMessage = "Xác thực thành công, nhưng không nhận được dữ liệu session hợp lệ.";
                if (!jwtResponseData) {
                    errorMessage = "Không nhận được dữ liệu phản hồi.";
                } else if (!jwtResponseData.token) {
                    errorMessage = "Dữ liệu phản hồi không chứa token.";
                    console.error("jwtResponseData thiếu token:", jwtResponseData);
                }
                toast.error(errorMessage);
            }

        } catch (error) {
            let errorMessage = "An unexpected error occurred.";
            if (error.response) {
                // Server responded with a status code out of 2xx range
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data && typeof error.response.data.error === 'string') {
                    // For custom error objects like { "error": "message" }
                    errorMessage = error.response.data.error;
                } else if (error.response.data && Array.isArray(error.response.data.errors)) {
                    // For Spring @Valid errors (often an array of field errors)
                    errorMessage = error.response.data.errors.map(err => `${err.defaultMessage || err.msg}`).join('; '); // err.field can also be used
                } else if (error.response.data && typeof error.response.data.message === 'string') {
                    // For Spring default error objects with a 'message' field
                    errorMessage = error.response.data.message;
                } else if (error.response.status === 409) {
                    errorMessage = "This email is already registered."; // More specific for 409
                } else if (error.response.status === 401) {
                    errorMessage = "Invalid email or password."; // More specific for 401 on login
                }
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = "No response from server. Please check your network connection.";
            } else {
                // Something happened in setting up the request
                errorMessage = error.message;
            }
            toast.error(errorMessage);
            console.error("Authentication error:", error);
        }
    };


    // If user is already logged in (access_token exists), navigate to home.
    if (access_token) {
        return <Navigate to="/blog" />;
    }

    return (
        <AnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center ">
                <Toaster />
                <form id="formElement" className="w-[80%] max-w-[400px]">
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                        {type === "sign-in" ? "Welcome back" : "Join us today"}
                    </h1>
                    {
                        type !== "sign-in" ?
                            <InputBox name="username"
                                      type="text"
                                      placeholder="Full name"
                                      icon="fi-rr-user"
                            />
                            : ""
                    }
                    <InputBox name="email"
                              type="email"
                              placeholder="Email"
                              icon="fi-rr-at"
                    />
                    <InputBox name="password"
                              type="password"
                              placeholder="Password"
                              icon="fi-rr-key"
                    />
                    <button
                        className="btn-dark center mt-10"
                        type="submit"
                        onClick={handleSubmit} // onClick is fine for button type="submit", but usually onSubmit is on the form itself.
                        // However, with e.preventDefault(), this works.
                    >
                        {type.replace("-", " ")}
                    </button>

                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        <p>or</p>
                        <hr className="w-1/2 border-black" />
                    </div>

                    <a className="btn-dark flex items-center justify-center gap-4 w-[90%] mx-auto"
                       href={handleGoogleAuth}>
                        <img src={googleicon} className="w-5" alt="Google icon"/>Continue with Google
                    </a>

                    {
                        type === "sign-in" ?
                            <p className="mt-6 text-dark-grey text-xl text-center">
                                Don't have an account?
                                <Link to="/blog/signup" className="underline text-black text-xl ml-1">
                                    Join us today
                                </Link>
                            </p>
                            :
                            <p className="mt-6 text-dark-grey text-xl text-center">
                                Already a member?
                                <Link to="/blog/signin" className="underline text-black text-xl ml-1">
                                    Sign in here.
                                </Link>
                            </p>
                    }
                </form>
            </section>
        </AnimationWrapper>
    );
};

export default UserAuthForm;