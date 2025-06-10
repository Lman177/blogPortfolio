import AnimationWrapper from "@/Blog/Common2/page-animation.jsx";

const PaymentSuccessPage = () => {
    return (
        <AnimationWrapper>
            <div className="max-w-xl mx-auto py-20 px-4 text-center">
                <div className="text-green-600 text-4xl mb-4">✔</div>
                <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
                <p className="mb-6">Thank you for your purchase. Your subscription is now active.</p>
                <a href="/blog" className="btn-dark px-6 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition">Go to Home</a>
            </div>
        </AnimationWrapper>
    );
};

export default PaymentSuccessPage;

