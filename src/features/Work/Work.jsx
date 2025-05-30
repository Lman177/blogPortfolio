import React, {useContext, useEffect, useRef, useState} from 'react';
import styles from './style.module.scss';
// import Rounded from "@Common/RoundedButton/RoundedButton.jsx"; // Gỡ bỏ nếu không dùng trong file này
import { projectsItem } from "@Common/projects.js"; // Đảm bảo đường dẫn đúng
import {motion, useScroll, useTransform} from "framer-motion";
import gsap from "gsap";
import {useNavigate} from "react-router-dom";
import {LenisContext} from "@/App.jsx";



const Work = () => {
  const [activeButton, setActiveButton] = useState('All');
  const cursorLabel = useRef(null);
  const cursor = useRef(null);
  const navigate = useNavigate(); // <--- Call useNavigate at the top level
  const { scrollYProgress } = useContext(LenisContext) || {};

  // State để điều khiển animation của cursor và cursorLabel
  const [cursorVariant, setCursorVariant] = useState("initial"); // "initial", "enter", "closed"

  // GSAP refs cho quickTo
  const xMoveCursor = useRef(null);
  const yMoveCursor = useRef(null);
  const xMoveCursorLabel = useRef(null);
  const yMoveCursorLabel = useRef(null);

  const height = useTransform(scrollYProgress, [0,1], [300, 0]);

  useEffect(() => {
    xMoveCursor.current = gsap.quickTo(cursor.current, "left", { duration: 0.5, ease: "power3" });
    yMoveCursor.current = gsap.quickTo(cursor.current, "top", { duration: 0.5, ease: "power3" });
    xMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "left", { duration: 0.45, ease: "power3" });
    yMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "top", { duration: 0.45, ease: "power3" });
  }, []);

  const moveItems = (x, y) => {
    if (xMoveCursor.current && yMoveCursor.current) {
      xMoveCursor.current(x);
      yMoveCursor.current(y);
    }
    if (xMoveCursorLabel.current && yMoveCursorLabel.current) {
      xMoveCursorLabel.current(x);
      yMoveCursorLabel.current(y);
    }
  };

  const scaleAnimation = {
    initial: { scale: 0, x: "-50%", y: "-50%" },
    enter: { scale: 1, x: "-50%", y: "-50%", transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } },
    closed: { scale: 0, x: "-50%", y: "-50%", transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] } }
  };

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const filterButtons = [
    { id: 'All', label: 'All', isRounded: true },
    { id: 'Design', label: 'Design', count: 1 },
    { id: 'Development', label: 'Development', count: 3 },
  ];

  const handleProjectClick = (slug) => {
    // Now 'navigate' is available from the component's scope
    navigate(`/projectDetail/${slug}`);
  };



  return (
      // Loại bỏ onMouseMove khỏi container cha nếu không muốn nó điều khiển cursor mặc định
      <div className={styles.container} >
        <div className={styles.work_container}>
          <div className={styles.top}>
            <h1 className={styles.work_title}>
              Creating next level
              <br/>
              digital products
            </h1>
            <div className={styles.button_section}>
              {filterButtons.map(btn => {
                const isActive = activeButton === btn.id;
                const buttonClassName = `${styles.button} ${isActive ? styles.active : ''}`;
                // ... (render button như cũ)
                if (btn.isRounded) {
                  return (
                      <button
                          key={btn.id}
                          className={buttonClassName}
                          onClick={() => handleButtonClick(btn.id)}
                      >
                        <p>
                          {btn.label}
                        </p>
                      </button>
                  );
                } else {
                  return (
                      <button
                          key={btn.id}
                          className={buttonClassName}
                          onClick={() => handleButtonClick(btn.id)}
                      >
                        <p>
                          {btn.label}
                          {btn.count && <sup>{btn.count}</sup>}
                        </p>
                      </button>
                  );
                }
              })}
            </div>
          </div>

          <div className={styles.project_container}>
            {projectsItem
                .filter(project => {
                  if (activeButton === 'All') return true;
                  // ... (logic filter như cũ)
                  if (activeButton === 'Design') {
                    return project.tagNames && project.tagNames.some(tag => tag.toLowerCase().includes('thiết kế'));
                  }
                  if (activeButton === 'Development') {
                    return project.tagNames && project.tagNames.some(tag => tag.toLowerCase().includes('phát triển web') || tag.toLowerCase().includes('lập trình'));
                  }
                  return true;
                })
                .map(project => (
                    <div
                        key={project.slug}
                        className={styles.project_item}
                        onMouseEnter={() => {
                          setCursorVariant("enter");
                        }}
                        onMouseLeave={() => {
                          setCursorVariant("closed");
                        }}
                        onMouseMove={(e) => {
                          // Chỉ di chuyển cursor/label khi nó đang "enter" hoặc sẽ "enter"
                          // Hoặc đơn giản là luôn gọi, GSAP và Framer sẽ xử lý việc hiển thị
                          moveItems(e.clientX, e.clientY);
                        }}
                        onClick={() => handleProjectClick(project.slug)}
                    >
                      <div className={styles.project_image_container} style={{backgroundColor: project.color}}>
                        <img src={project.src} alt={project.title} width={600}/>
                      </div>
                      <div className={styles.project_info}>
                        <h2 className={styles.project_title}>{project.short}</h2>
                        <hr/>
                        <div className={styles.project_meta}>
                          <span>{project.categoryName}</span>
                          <span className={styles.project_year}>{project.year}</span>
                        </div>
                      </div>
                    </div>
                ))}
          </div>
        </div>

        <motion.div
            ref={cursor}
            className={styles.cursor}
            variants={scaleAnimation}
            initial="initial" // Hoặc "closed" nếu muốn ẩn ban đầu
            animate={cursorVariant}
        />
        <motion.div
            ref={cursorLabel}
            className={styles.cursorLabel}
            variants={scaleAnimation}
            initial="initial" // Hoặc "closed"
            animate={cursorVariant}
        >
          View
        </motion.div>
        <motion.div style={{height}} className={styles.circleContainer}>
          <div className={styles.circle}></div>
        </motion.div>
      </div>
  );
};

export default Work;