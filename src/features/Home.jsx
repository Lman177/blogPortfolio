// src/pages/Home.jsx
import {useContext, useEffect, useState} from 'react';
import {AnimatePresence, motion, useScroll, useTransform} from 'framer-motion';
import styles from './page.module.css'; // giữ nguyên nếu dùng SCSS Modules
import { useRef } from "react";
import Lenis from 'lenis';
import Preloader from './PreLoader/PreLoader';
import Landing from './Landing/Landing';
import Project from './Project/Project';
import Description from './Description/Description'
import SlidingImages from './SlidingImage/SlidingImg';
import Contact from './Contact/Contact';
import {LenisContext} from "@/App.jsx";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const { scrollYProgress } = useContext(LenisContext) || {};
  const height = useTransform(scrollYProgress, [0, 1], [30, -2]);






  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = 'default';
      window.scrollTo(0, 0);
    }, 2000);

    return () => clearTimeout(timer); // cleanup nếu component bị unmount
  }, []);

  return (
      <main className={styles.main}>


        <Landing/>
        <Description scrollYProgress={scrollYProgress}/>
        <Project/>
        <SlidingImages/>
        <motion.div style={{height}} className={styles.circleContainer}>
          <div className={styles.circle}></div>
        </motion.div>
      </main>
  );
}
