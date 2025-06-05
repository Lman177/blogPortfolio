// src/pages/Home.jsx
import {useContext, useEffect, useState} from 'react';
import {AnimatePresence, motion, useScroll, useTransform} from 'framer-motion';
import styles from './page.module.css'; // giữ nguyên nếu dùng SCSS Modules
import { useRef } from "react";
import Lenis from 'lenis';
import Preloader from '../PreLoader/PreLoader.jsx';
import Landing from '../Landing/Landing.jsx';
import Project from '../Project/Project.jsx';
import Description from '../Description/Description.jsx'
import SlidingImages from '../SlidingImage/SlidingImg.jsx';
import Contact from '../Contact/Footer.jsx';
import {LenisContext} from "@/App.jsx";
import AnimationWrapper from "@/Blog/Common2/page-animation.jsx";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const { scrollYProgress } = useContext(LenisContext) || {};


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = 'default';
      window.scrollTo(0, 0);
    }, 2000);

    return () => clearTimeout(timer); // cleanup nếu component bị unmount
  }, []);

  return (
      <AnimationWrapper>


        <Landing/>
        <Description scrollYProgress={scrollYProgress}/>
        <Project/>
        <SlidingImages/>


      </AnimationWrapper>
  );
}
