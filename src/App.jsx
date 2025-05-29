// src/App.jsx
import './App.css'; // giữ nguyên nếu là global css
import Header from './features/Header/Header'
import Home from './features/Home'; // đây là phần page chuyển từ `page.js`
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import About from './features/About/About';
import Work from './features/Work/Work';
import Contact from './features/Contact/Contact';
import {useEffect} from 'react';
import {useRef} from "react";
import Lenis from 'lenis';
import {AnimatePresence} from 'framer-motion';
import {ScrollProvider} from '@context/ScrollProvider';
import ProjectDetail from "@features/Work/detail/ProjectDetail.jsx";  // đảm bảo đường dẫn đúng
function App() {

    useEffect(() => {
        const lenis = new Lenis()

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
    }, [])
    return (
        <div lang="en">
            <ScrollProvider>
                <BrowserRouter>
                    <Header/>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/work" element={<Work/>}/>
                        <Route path="/projectDetail/:slug" element={<ProjectDetail/>}/>

                    </Routes>
                    {/*<Contact/>*/}
                </BrowserRouter>
            </ScrollProvider>
        </div>
    );
}

export default App;
