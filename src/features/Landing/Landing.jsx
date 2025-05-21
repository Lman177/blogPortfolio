import { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import styles from './landing.module.css';
import { slideUp } from './animation'; // đảm bảo file này export đúng variants
import backgroundImage from '@assets/background.png'; // Vite dùng import ảnh như vậy

const Landing = () => {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  const xPercentRef = useRef(0);
  let direction = -1;

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.25,
        start: 0,
        end: window.innerHeight,
        onUpdate: (e) => (direction = e.direction * -1),
      },
      x: '-500px',
    });

    requestAnimationFrame(animate);
  }, []);

  const animate = () => {
    xPercentRef.current += 0.04 * direction;

    if (xPercentRef.current < -100) {
      xPercentRef.current = 0;
    } else if (xPercentRef.current > 0) {
      xPercentRef.current = -100;
    }

    gsap.set(firstText.current, { xPercent: xPercentRef.current });
    gsap.set(secondText.current, { xPercent: xPercentRef.current });

    requestAnimationFrame(animate);
  };

  return (
    <motion.main
      // variants={slideUp}
      initial="initial"
      animate="enter"
      className={styles.landing}
    >
      <img
        src={backgroundImage}
        alt="background"
        className={styles.background}
      />

      <div className={styles.sliderContainer}>
        <div ref={slider} className={styles.slider}>
          <p ref={firstText}>Hoang Nam -</p>
          <p ref={secondText}>Developer -</p>
        </div>
      </div>

      <div data-scroll data-scroll-speed={0.1} className={styles.description}>
        <svg
          width="9"
          height="9"
          viewBox="0 0 9 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          
        </svg>
        <p>Nguyen Hoang Nam</p>
        <p>Fullstack Developer</p>
      </div>
    </motion.main>
  );
};

export default Landing;
