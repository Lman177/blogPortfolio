import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './header.module.css';
import { useLocation } from 'react-router-dom'; // Thay thế usePathname
import { AnimatePresence } from 'framer-motion';
import Nav from './nav/Nav.jsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Rounded from '../../Common/RoundedButton/RoundedButton';
import Magnetic from '../../Common/Magnetic';

export default function Header() {
  const header = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const location = useLocation(); // Dùng React Router để lấy đường dẫn hiện tại
  const button = useRef(null);
  const isHome = location.pathname === '/' || location.pathname === '/contact'; // Kiểm tra nếu đường dẫn là trang chủ
    const isContact = location.pathname === '/contact'; // Kiểm tra nếu đường dẫn là trang liên hệ

  // Đóng menu khi đường dẫn thay đổi
  useEffect(() => {
    if (isActive) setIsActive(false);
  }, [location.pathname]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(button.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: 118,
        onLeave: () => {
          gsap.to(button.current, { scale: 1, duration: 0.25, ease: 'power1.out' });
        },
        onEnterBack: () => {
          gsap.to(button.current, { scale: 0, duration: 0.25, ease: 'power1.out' });
          setIsActive(false);
        },
      },
    });
  }, []);

  return (
    <>
      <div ref={header} className={`${styles.header} ${isHome ? styles.header : styles.black}`}>
        <a className={styles.logo} href="/" >
          <p className={styles.copyright}>©</p>
          <div className={`${styles.name} ${isContact ? styles.name : styles.black}`} >
            <p className={styles.codeBy}>Code by</p>
            <p className={styles.nam}>Nam</p>
            <p className={styles.hoang}>Hoang</p>
          </div>
        </a>
        <div className={styles.nav}>
          <Magnetic>
            <div className={styles.el}>
              <a href="/work">Work</a>
              <div className={styles.indicator}></div>
            </div>
          </Magnetic>
          <Magnetic>
            <div className={styles.el}>
              <a href="/about">About</a>
              <div className={styles.indicator}></div>
            </div>
          </Magnetic>
          <Magnetic>
            <div className={styles.el}>
              <a href="/contact">Contact</a>
              <div className={styles.indicator}></div>
            </div>
          </Magnetic>
        </div>
      </div>
      <div ref={button} className={styles.headerButtonContainer}>
        <Rounded onClick={() => setIsActive(!isActive)} className={styles.button}>
          <div className={`${styles.burger} ${isActive ? styles.burgerActive : ''}`}></div>
        </Rounded>
      </div>
      <AnimatePresence mode="wait">{isActive && <Nav />}</AnimatePresence>
    </>
  );
}
