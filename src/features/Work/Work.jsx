import React, { useState, useRef, useEffect } from 'react';
import styles from './style.module.scss';
import { projectsItem } from "@Common/projects.js"; // Đảm bảo đường dẫn đúng
import {AnimatePresence, motion, useScroll, useTransform} from "framer-motion";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import AnimationWrapper from "@/Blog/Common2/page-animation.jsx";
import RoundedButton from "@Common/RoundedButton/RoundedButton.jsx";

const Work = () => {
  const [activeButton, setActiveButton] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const cursorLabel = useRef(null);
  const cursor = useRef(null);
  const navigate = useNavigate();
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });

  const [cursorVariant, setCursorVariant] = useState("initial");
  const xMoveCursor = useRef(null);
  const yMoveCursor = useRef(null);
  const xMoveCursorLabel = useRef(null);
  const yMoveCursorLabel = useRef(null);

  const height = useTransform(scrollYProgress, [0, 1], [150, 0]);


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
    setShowAll(false);
  };

  const filterButtons = [
    { id: 'All', label: 'All', isRounded: true },
    { id: 'Design', label: 'Design'  },
    { id: 'Development', label: 'Development'},
  ];

  const handleProjectClick = (slug) => {
    navigate(`/projectDetail/${slug}`);
  };


  const filteredProjects = projectsItem.filter(project => {
    if (activeButton === 'All') return true;
    if (activeButton === 'Design') {
      return project.tagNames && project.tagNames.some(tag => tag.toLowerCase().includes('thiết kế'));
    }
    if (activeButton === 'Development') {
      return project.tagNames && project.tagNames.some(tag => tag.toLowerCase().includes('phát triển web') || tag.toLowerCase().includes('lập trình'));
    }
    return true;
  });

  // THAY ĐỔI MỚI: Quyết định danh sách project sẽ hiển thị
  const projectsToDisplay = showAll ? filteredProjects : filteredProjects.slice(0, 4);
  console.log("Giá trị scrollTop ddang KHI scroll:", container.current.scrollTop);

  const handleToggleShowAll = () => {
    if (showAll) {
      if (container.current) {
        // THÊM 2 DÒNG NÀY ĐỂ KIỂM TRA
        console.log("Element đang được nhắm tới:", container.current);
        console.log("Giá trị scrollTop TRƯỚC KHI scroll:", container.current.scrollTop);

        gsap.to(container.current, {
          scrollTop: 0,
          duration: 0.8,
          ease: 'power3.inOut'
        });
      }

      setTimeout(() => {
        setShowAll(false);
      }, 300);
    } else {
      setShowAll(true);
    }
  };
  return (
      <AnimationWrapper>
        <div className={styles.container} ref={container}>
          <div className={styles.work_container}>
            <div className={styles.top}>
              <h1 className={styles.work_title}>
                Creating next level
                <br />
                digital products
              </h1>
              <div className={styles.button_section}>
                {filterButtons.map(btn => {
                  const isActive = activeButton === btn.id;
                  const buttonClassName = `${styles.button} ${isActive ? styles.active : ''}`;
                  return (
                      <button
                          key={btn.id}
                          className={buttonClassName}
                          onClick={() => handleButtonClick(btn.id)}
                      >
                        <p>
                          {btn.label}
                          {!btn.isRounded && btn.count && <sup>{btn.count}</sup>}
                        </p>
                      </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.project_container}>
              <AnimatePresence>
                {projectsToDisplay.map(project => (
                    <motion.div
                        key={project.slug}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className={styles.project_item}
                        onMouseEnter={() => setCursorVariant("enter")}
                        onMouseLeave={() => setCursorVariant("closed")}
                        onMouseMove={(e) => moveItems(e.clientX, e.clientY)}
                        onClick={() => handleProjectClick(project.slug)}
                    >
                      <div className={styles.project_image_container} style={{ backgroundColor: project.color }}>
                        <img src={project.src} alt={project.title} />
                      </div>
                      <div className={styles.project_info}>
                        <h2 className={styles.project_title}>{project.short}</h2>
                        <hr />
                        <div className={styles.project_meta}>
                          <span>{project.categoryName}</span>
                          <span className={styles.project_year}>{project.year}</span>
                        </div>
                      </div>
                    </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* THAY ĐỔI MỚI: Nút "View More" */}
            {filteredProjects.length > 4 && (
                <div className={styles.view_more_container}>
                  <RoundedButton onClick={handleToggleShowAll} className={styles.view_more_button}>
                    <p> {showAll ? 'Show Less' : 'View More Work'}</p>
                  </RoundedButton>
                </div>
            )}

          </div>

          <motion.div
              ref={cursor}
              className={styles.cursor}
              variants={scaleAnimation}
              initial="initial"
              animate={cursorVariant}
          />
          <motion.div
              ref={cursorLabel}
              className={styles.cursorLabel}
              variants={scaleAnimation}
              initial="initial"
              animate={cursorVariant}
          >
            View
          </motion.div>
        </div>
        <motion.div style={{ height }} className={styles.circleContainer}>
          <div className={styles.circle}></div>
        </motion.div>
      </AnimationWrapper>
  );
};

export default Work;