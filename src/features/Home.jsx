// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { AnimatePresence, useScroll } from 'framer-motion';
import styles from './page.module.css'; // giữ nguyên nếu dùng SCSS Modules
import { useRef } from "react";
import Lenis from 'lenis';
// import Preloader from '../components/Preloader';
import Landing from './Landing/Landing';
import Project from './Project/Project';
import Description from './Description/Description'
import SlidingImages from './SlidingImage/SlidingImg';
import Contact from './Contact/Contact';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  
  const container = useRef();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"]
  }) 



  // useEffect(() => {
  //   (async () => {
  //     const LocomotiveScroll = (await import('locomotive-scroll')).default;
  //   //   const locomotiveScroll = new LocomotiveScroll();

  //     setTimeout(() => {
  //       setIsLoading(false);
  //       document.body.style.cursor = 'default';
  //       window.scrollTo(0, 0);
  //     }, 2000);
  //   })();
  // }, []);

  return (
    <main className={styles.main}>
      {/* <AnimatePresence mode="wait">
        {isLoading && <Preloader />}
      </AnimatePresence> */}
      
      
      <Landing />
      <Description scrollYProgress={scrollYProgress}/>
      <Project />
      <SlidingImages />
        
    </main>
  );
}
