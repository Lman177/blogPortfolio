import { useEffect, useState } from "react";
import { getAllPlans } from "@/Blog/Common2/apiFunction";
import AnimationWrapper from "@/Blog/Common2/page-animation.jsx";
import { useNavigate } from "react-router-dom";

const PricingRegisterPage = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getAllPlans()
            .then(data => {
                setPlans(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || "Failed to fetch plans");
                setLoading(false);
            });
    }, []);

    const handleSelect = (plan) => {
        const userStr = sessionStorage.getItem("user");
        if (!userStr) {
            navigate("/blog/signin");
            return;
        }
        navigate("/blog/pricing/summary", { state: { plan } });
    };

    if (loading) return <div className="p-8 text-center">Loading plans...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <AnimationWrapper>
        <div className="max-w-3xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Membership Plan</h1>
            <div className="grid gap-8 md:grid-cols-3">
                {plans && plans.length > 0 ? plans.map(plan => (
                    <div key={plan.id} className="border rounded-lg shadow p-6 flex flex-col items-center bg-white dark:bg-gray-900">
                        <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
                        <div className="text-3xl font-bold mb-4">{plan.price}VND</div>
                        <div className="mb-4 text-gray-600 dark:text-gray-300">{plan.description}</div>
                        {/* Add more plan details if available */}
                        {plan.price === 0 ? (
                            <button
                                className="mt-auto btn-light bg-gray-400 text-white px-6 py-2 rounded cursor-not-allowed opacity-70"
                                disabled
                            >
                                Current Plan
                            </button>
                        ) : (
                            <button
                                className="mt-auto btn-dark bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                                onClick={() => handleSelect(plan)}
                            >
                                Select
                            </button>
                        )}
                    </div>
                )) : (
                    <div className="col-span-3 text-center text-gray-500">No plans available.</div>
                )}
            </div>
        </div>
        </AnimationWrapper>
    );
};

export default PricingRegisterPage;
