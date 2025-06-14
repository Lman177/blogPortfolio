import { Link, Outlet } from "react-router-dom";
import logo from "../imgs/logo.png";
import { useContext, useState } from "react";
import UserNavigationPanel from "@/Blog/Component/user-navigation.component.jsx";
import image from "@assets/avatar.jpg"
import {UserContext} from "@/App.jsx";
import SearchBar from "./SearchBar.jsx";
const Navbar =()  =>{

    const [searchBoxVisibility,setSearchBoxVisibility] = useState(false)
    const[UserNavPanel,setUserNavPanel] =useState(false);
// 1. Lấy object userAuth từ context
    const { userAuth } = useContext(UserContext);
    // console.log("access_token",userAuth.access_token);
    // 2. Lấy token và profile_img từ userAuth một cách an toàn
    //    Sử dụng optional chaining (?.): nếu userAuth hoặc userAuth.token không tồn tại,
    //    thì token sẽ là undefined mà không gây lỗi.
    const access_token = userAuth?.access_token;
    const profile_img = userAuth?.picture;
    const handleUserNavPanel=()=>{
        setUserNavPanel(currentVal =>!currentVal);
    }
    const handleBlur =()=>{
        setTimeout(()=>{
            setUserNavPanel(false);

        },200);

    }
    return (
        <>
        <nav className="navbar">
            <Link to="/blog" className="flex-none w-10">
            <img src={logo} className="w-full" />
            </Link>

            <div className={"absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw]  md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " + (searchBoxVisibility ? "show" : "hide" ) }>
                <SearchBar />
            </div>


            <div className="flex items-centre justify-center align-middle gap-3 md:gap-6 ml-auto">
                <button className=" bg-grey w-12 h-12 rounded-full flex items-center justify-center"
                        onClick={() => setSearchBoxVisibility(currentVal => !currentVal)}>
                    <i className="fi fi-rr-search  text-xl"></i>
                </button>

                {!userAuth?.roles?.includes("ROLE_ADMIN") &&
                (!userAuth?.currentPlan || userAuth?.currentPlan?.name === 'Free') ? (
                    <Link to="/blog/pricing/register"
                          className="btn-pro flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition font-semibold">
                        <i className="fi fi-rr-crown text-lg"></i>
                        Join Pro
                    </Link>
                ) : null
                }

                {userAuth?.roles?.includes("ROLE_ADMIN") ? (
                    <Link to="/blog/editor" className="hidden md:flex fap-2 link">
                        <i className="fi fi-rr-file-edit"></i>
                        <p>Write</p>
                    </Link>
                ) : null
                }

                {
                    access_token ?
                        <>
                            {/*<Link to="dashboard/notifications">*/}
                            {/*    <button className=" w-12 h-12 mt-1 flex justify-center items-center rounded-full bg-grey relative hover:bg-black/10">*/}
                            {/*        <i className="fi fi-rr-bell text-2xl block mt-1"></i>*/}
                            {/*    </button>*/}
                            {/*</Link>*/}

                            <div className="realtive" onClick={handleUserNavPanel} onBlur={handleBlur}>
                                <button className="w-12 h-12 mt-1">
                                    <img src={profile_img ? profile_img : image}
                                         className="w-full h-full object-cover rounded-full"/>
                                </button>
                                {
                                    UserNavPanel ? <UserNavigationPanel/>
                                        : ""
                                }
                            </div>
                        </>
                        :
                        <>
                            <Link className="btn-dark py-2" to="/blog/signin">
                                Sign In
                            </Link>
                            <Link className="btn-light hidden py-2 md:block" to="/blog/signup">
                                Sign Up
                            </Link>
                        </>
                }

            </div>
        </nav>
            <Outlet/>
        </>

    )
}

export default Navbar