import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import AnimationWrapper from "@/Blog/Common2/page-animation.jsx";
import { createVnpayPayment } from "@/Blog/Common2/apiFunction";

const PlanSummaryPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const plan = location.state?.plan;
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    if (!plan) {
        return (
            <div className="p-8 text-center text-red-500">
                No plan selected. <button className="underline" onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    const handleCreatePayment = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await createVnpayPayment(plan.id);
            if (res && res.paymentUrl) {
                window.location.href = res.paymentUrl;
            } else {
                setError("Could not get payment URL.");
            }
        } catch (e) {
            setError(e.message || "Payment failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimationWrapper>
        <div className="max-w-xl mx-auto py-12 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Plan Summary</h1>
            <div className="border rounded-lg shadow p-6 bg-white dark:bg-gray-900 mb-6">
                <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
                <div className="text-2xl font-bold mb-2">{plan.price} VND</div>
                <div className="mb-2 text-gray-600 dark:text-gray-300">{plan.description}</div>
            </div>
            {!success ? (
                <>
                {error && <div className="text-red-500 text-center mb-2">{error}</div>}
                <button
                    className="w-full btn-dark bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                    onClick={handleCreatePayment}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Make Transaction'}
                </button>
                </>
            ) : (
                <div className="text-green-600 text-center font-semibold">Transaction successful! Thank you for your purchase.</div>
            )}
        </div>
        </AnimationWrapper>
    );
};

export default PlanSummaryPage;
