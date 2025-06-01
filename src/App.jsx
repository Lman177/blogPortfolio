// prj Portfolio
import './App.css'; // giữ nguyên nếu là global css
import Header from './features/Header/Header'
import Home from '@features/HomePage/Home.jsx'; // đây là phần page chuyển từ `page.js`
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import About from './features/About/About';
import Work from './features/Work/Work';
import ProjectDetail from "@features/Work/detail/ProjectDetail.jsx";
import ScrollToTop from "@Common/ScrollToTop.jsx";
import {motionValue, useSpring} from "framer-motion";
import {createContext, useEffect, useState} from "react";
import Lenis from 'lenis';
import Footer from "@features/Contact/Footer.jsx";
import GetIntouch from "@features/GetInTouch/GetIntouch.jsx";
import MainLayout from "@features/MainLayout .jsx";

export const LenisContext = createContext(null);

function App() {

    const scrollYProgress = motionValue(0);
    const smoothScrollYProgress = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });
    const [lenis, setLenis] = useState(null);

    useEffect(() => {
        const lenisInstance = new Lenis();
        setLenis(lenisInstance);

        const unsubscribe = lenisInstance.on('scroll', ({ progress }) => {
            scrollYProgress.set(progress);
        });

        function raf(time) {
            lenisInstance.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            unsubscribe();
            lenisInstance.destroy();
            setLenis(null);
        };
    }, []);
    return (
        <LenisContext.Provider value={{ lenis, scrollYProgress: smoothScrollYProgress }}>

        <div lang="en">

            <ScrollToTop />
            <Routes>
                {/* Nhóm các route sử dụng layout có Header và Footer */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/work" element={<Work />} />
                    <Route path="/projectDetail/:slug" element={<ProjectDetail />} />
                </Route>

                {/* Route /contact nằm ngoài nhóm, sẽ không có layout chung */}
                <Route path="/contact" element={
                    <>
                        <Header /> {/* Bạn vẫn có thể thêm Header nếu muốn */}
                        <GetIntouch />
                        {/* Không có Footer ở đây */}
                    </>
                } />
            </Routes>
        </div>
        </LenisContext.Provider>

    );
}

export default App;
