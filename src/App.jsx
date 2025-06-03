// prj Portfolio - App.js

import './App.css';
import {Routes, Route} from 'react-router-dom';
import {createContext, useEffect, useState} from "react";
import Lenis from 'lenis';
import {motionValue, useSpring} from "framer-motion";

import MainLayout from "@features/MainLayout .jsx";
import Home from '@features/HomePage/Home.jsx';
import About from './features/About/About';
import Work from './features/Work/Work';
import ProjectDetail from "@features/Work/detail/ProjectDetail.jsx";
import GetIntouch from "@features/GetInTouch/GetIntouch.jsx";
import Header from './features/Header/Header';
import ScrollToTop from "@Common/ScrollToTop.jsx";
import BlogLayout from "@/Blog/BlogLayout.jsx";
import {lookInSession} from "@/Blog/Common2/session.jsx";


export const UserContext = createContext({})

export const LenisContext = createContext(null);

function App() {
    const scrollYProgress = motionValue(0);
    const smoothScrollYProgress = useSpring(scrollYProgress, {stiffness: 400, damping: 90});
    const [lenis, setLenis] = useState(null);

    useEffect(() => {
        const lenisInstance = new Lenis();
        setLenis(lenisInstance);

        const unsubscribe = lenisInstance.on('scroll', ({progress}) => {
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

    const [userAuth, setUserAuth] = useState({});

    useEffect(() => {
        let userInSession = lookInSession("user");
        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({access_token: null})
    }, [])
    return (
        <LenisContext.Provider value={{lenis, scrollYProgress: smoothScrollYProgress}}>

            <UserContext.Provider value={{userAuth, setUserAuth}}>

                <div lang="en">
                    <ScrollToTop/>
                    <Routes>
                        <Route element={<MainLayout/>}>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/about" element={<About/>}/>
                            <Route path="/work" element={<Work/>}/>
                            <Route path="/projectDetail/:slug" element={<ProjectDetail/>}/>
                        </Route>

                        <Route path="/contact" element={
                            <>
                                <Header/>
                                <GetIntouch/>
                            </>
                        }/>
                        <Route path="/blog/*" element={<BlogLayout/>}/>

                    </Routes>
                </div>
            </UserContext.Provider>
        </LenisContext.Provider>

    );
}

export default App;