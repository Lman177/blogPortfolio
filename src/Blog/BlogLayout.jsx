import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from "@/Blog/Component/navbar.component.jsx";
import UserAuthForm from "@/Blog/pages/userAuthForm.page.jsx";
import HomePage from "@/Blog/pages/home.page.jsx";
import Editor from "@/Blog/pages/editor.pages.jsx";
import './blog.styles.css';
import {useEffect} from "react";
import DetailBlog from "@/Blog/Component/detail-blog.component.jsx";
import OAuthCallbackPage from "@/Blog/pages/OAuthCallbackPage.jsx";
import ProfileComponent from "@/Blog/Component/profile.component.jsx";
import EditBlogPage from "@/Blog/pages/edit-blog.page.jsx";
import PricingRegisterPage from "@/Blog/pages/PricingRegisterPage.jsx";
import PlanSummaryPage from "@/Blog/pages/PlanSummaryPage.jsx";
import PaymentSuccessPage from "@/Blog/pages/PaymentSuccessPage.jsx";
import PaymentFailurePage from "@/Blog/Component/PaymentFailurePage.jsx";


const BlogLayout = () => {
    useEffect(() => {
        // Khi component được mount (bạn vào trang /blog/*)
        // -> thêm class vào body
        document.body.classList.add('allow-scroll');

        // Hàm cleanup: sẽ được gọi khi component unmount (bạn rời khỏi trang /blog/*)
        // -> xóa class khỏi body để quay về trạng thái overflow: hidden
        return () => {
            document.body.classList.remove('allow-scroll');
        };
    }, []);
    return (
        <div className="blog-section font-inter text-black">
            <Routes>
                <Route path="editor" element={<Editor/>}/>
                <Route  element={<Navbar/>} >
                    <Route index element={<HomePage/>}/>
                    <Route path="signin" element={<UserAuthForm type="sign-in"/>}/>
                    <Route path="signup" element={<UserAuthForm type="sign-up"/>}/>
                    <Route path=":slug" element={<DetailBlog/>}/>
                    <Route path="/oauth-callback" element={<OAuthCallbackPage />} />
                    <Route path="edit-blog/:id" element={<EditBlogPage/>} />
                    <Route path="pricing/register" element={<PricingRegisterPage/>} />
                    <Route path="pricing/summary" element={<PlanSummaryPage/>} />
                    <Route path="pricing/payment-success" element={<PaymentSuccessPage/>} />
                    <Route path="pricing/payment-failure" element={<PaymentFailurePage/>} />
                </Route>
                <Route path="user/:email" element={<ProfileComponent/> } />
            </Routes>
        </div>
    );
};

export default BlogLayout;