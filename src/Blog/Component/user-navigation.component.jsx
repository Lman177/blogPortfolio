import { Link } from "react-router-dom";
import { useContext } from "react";
import {removeFromSession} from "@/Blog/Common2/session.jsx";
import AnimationWrapper from "@/Blog/Common2/page-animation.jsx";
import {UserContext} from "@/App.jsx";

const UserNavigationPanel =()=>{
    const { setUserAuth}= useContext(UserContext)
    const { userAuth } = useContext(UserContext);
    const email = userAuth.email
    const signOutUser =()=>{
        removeFromSession("user");
        setUserAuth({access_token:null}) 
    }
    return (
        <AnimationWrapper
         transition={{duration:0.2 }}
         className="absolute right=0 z-50" >

            <div className="bg-white absolute right-0 border
             border-grey w-60 overflow-hidden duration-200">
                {userAuth.roles.includes("ROLE_ADMIN")  ? (


                    <Link to={`/user/${email}`} className="link pl-8 py-4">
                        Profile
                    </Link>

            //         <Link to={`/dashboard/blogs`} className="link pl-8 py-4">
            //     Dashboard
            //         </Link>
            //
            // <Link to={`/settings/edit-profile`} className="link pl-8 py-4">
            //     Settings
            // </Link>

                ) : <></> }


                <span className="absolute border-t border-grey  w-[100%]"></span>
                
                <button onClick={signOutUser} className="text-left p-2 hover:bg-grey w-full pl-8 py-3 ">

                    <h1 className="font-bold text-l ">Sign Out</h1>
                    <p className="text-dark-grey">@{email}</p>
                </button>
            </div>

        </AnimationWrapper>
    )
}

export default UserNavigationPanel;