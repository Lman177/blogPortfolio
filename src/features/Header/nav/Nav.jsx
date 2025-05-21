import React, { useState, useEffect } from 'react';
import styles from './nav.module.css';
import { motion } from 'framer-motion';
import { menuSlide } from './animation';
import LinkComponent from './Link/LinkComponent';
import CurveComponent from './Curve/CurveComponent';



const navItems = [
  { title: "Home", href: "/" },
  { title: "Work", href: "/work" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [pathname, setPathname] = useState('/');
  const [selectedIndicator, setSelectedIndicator] = useState('/');

  useEffect(() => {
    // Lấy pathname khi component mount
    setPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    setSelectedIndicator(pathname);
  }, [pathname]);

  return (

    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className={styles.menu}
    >
      <div className={styles.body}>
        <div
          onMouseLeave={() => { setSelectedIndicator(pathname); }}
          className={styles.nav}>

          <div className={styles.header}>
            <p>Navigation</p>
          </div>
          {navItems.map((data, index) => (
            <LinkComponent
              key={index}
              data={{ ...data, index }}
              isActive={selectedIndicator === data.href}
              setSelectedIndicator={setSelectedIndicator}
            />
          ))}
        </div>
      </div>
      <CurveComponent />
    </motion.div>
  );
}
