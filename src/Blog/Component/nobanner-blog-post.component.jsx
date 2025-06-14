import { Link } from "react-router-dom";
import {formatDate} from "@/Blog/Common2/date.jsx";
import profile_img from "@/assets/avatar.jpg";

const MinimalBlogPost =({blog,index})=>{
    let {title, slug , author , publishedAt, accessLevel}= blog;

    return (
        <Link to={`/blog/${slug}`} className="flex gap-5 mb-10  ">
            <h1 className="blog-index">{ index<10 ?"0"+(index+1): index+1}</h1>
            <div>
                <div className="flex gap-2 items-center mb-4">
                    <img src={profile_img} className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1 ">{author.username}</p>
                    <p className="min-w-fit">{formatDate(publishedAt)}</p>
                    {accessLevel === "MEMBER" ? (
                        <span className="ml-3 flex items-center gap-2 text-dark-grey">
                                <i className="fi fi-rr-lock text-xl bold" style={{color: "#FFD600"}}/>

                            </span>
                    ) : null}
                </div>
                    <h1 className="blog-title">{title}</h1>

            </div>
        </Link>
    )
}
export default MinimalBlogPost;