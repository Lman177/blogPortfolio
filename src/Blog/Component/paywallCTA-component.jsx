import { Link } from 'react-router-dom';

export const PaywallCTA = () => {
    return (
        // Lớp phủ tuyệt đối, che toàn bộ container cha
        <div className="absolute inset-0 flex flex-col items-center  p-6 text-center
                        bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-lg z-10">

            <div className="max-w-md">
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-indigo-600 dark:text-indigo-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                </div>
                <h3 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                    Content Locked
                </h3>
                <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
                    This article is for members only. Join today to unlock it and get full access to our community.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                    {/* Nút chính */}
                    <Link
                        to="/blog/pricing/register"
                        className="btn-dark w-full sm:w-auto flex items-center justify-center px-8 py-3
                                   bg-indigo-600 text-white font-semibold rounded-lg shadow-lg
                                   hover:bg-indigo-700 hover:scale-105 transform transition-all duration-300
                                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Become a Member
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                    </Link>
                </div>

                <div className="mt-6">
                    {/* Nút phụ */}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Already a member?{' '}
                        <Link
                            to="/blog/signin"
                            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
        ;
};