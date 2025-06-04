import {Link} from "react-router-dom";
import {formatDate} from "@/Blog/Common2/date.jsx";


const BLogPostCard =({content})=>{

    let {  title, excerpt, featuredImage, slug, publishedAt, category}= content;
    return (
        <Link to={`/blog/${slug}`} className="flex gap-8 items-center border-b border-grey mb-5 mb-4">
        <div className="w-full ">
            <div className="flex gap-2 items-center mb-7">
                {/*<img src={profile_img} className="w-6 h-6 rounded-full" />*/}
                {/*<p className="line-clamp-1 ">@{author.username}</p>*/}
                <p className="min-w-fit">{formatDate(publishedAt)}</p>
            </div>

            <h1 className="blog-title">{title}</h1>
            <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">{excerpt}</p>
            <div>
                    <div className="flex gap-3 mt-7">

                    <span className="btn-light py-1 px-4">{category}
                    </span>

                    {/*<span className=" ml-3 flex items-center gap-2 text-dark-grey">*/}
                    {/*<i className="fi fi-rr-heart text-xl"/>*/}
                    {/*{total_likes}*/}
                    {/*</span>*/}

                    </div>
            </div>

        </div>

        <div className="h-28 aspect-square bg-grey ">
                <img src={featuredImage} className="w-full h-full aspect-square object-cover " />
        </div>
    </Link>
    )
}

export default BLogPostCard;    