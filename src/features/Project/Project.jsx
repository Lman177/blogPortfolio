'use client';
import styles from './project.module.scss'
import { useState, useEffect, useRef } from 'react';
import Project from './Component/index';
import { motion } from 'framer-motion';
import gsap from 'gsap';
// import Image from './public/images';
import Rounded from '../../common/RoundedButton/RoundedButton';
import {projectsItem} from "@Common/projects.js";
import {useNavigate} from "react-router-dom";



const scaleAnimation = {
    initial: {scale: 0, x:"-50%", y:"-50%"},
    enter: {scale: 1, x:"-50%", y:"-50%", transition: {duration: 0.4, ease: [0.76, 0, 0.24, 1]}},
    closed: {scale: 0, x:"-50%", y:"-50%", transition: {duration: 0.4, ease: [0.32, 0, 0.67, 0]}}
}

export default function Home() {
  const navigate = useNavigate(); // <-- BƯỚC 1: Khởi tạo navigate
  const [modal, setModal] = useState({active: false, index: 0})
  const { active, index } = modal;
  const modalContainer = useRef(null);
  const cursor = useRef(null);
  const cursorLabel = useRef(null);

  let xMoveContainer = useRef(null);
  let yMoveContainer = useRef(null);
  let xMoveCursor = useRef(null);
  let yMoveCursor = useRef(null);
  let xMoveCursorLabel = useRef(null);
  let yMoveCursorLabel = useRef(null);

  useEffect( () => {
    //Move Container
    xMoveContainer.current = gsap.quickTo(modalContainer.current, "left", {duration: 0.8, ease: "power3"})
    yMoveContainer.current = gsap.quickTo(modalContainer.current, "top", {duration: 0.8, ease: "power3"})
    //Move cursor
    xMoveCursor.current = gsap.quickTo(cursor.current, "left", {duration: 0.5, ease: "power3"})
    yMoveCursor.current = gsap.quickTo(cursor.current, "top", {duration: 0.5, ease: "power3"})
    //Move cursor label
    xMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "left", {duration: 0.45, ease: "power3"})
    yMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "top", {duration: 0.45, ease: "power3"})
  }, [])

  const moveItems = (x, y) => {
    xMoveContainer.current(x)
    yMoveContainer.current(y)
    xMoveCursor.current(x)
    yMoveCursor.current(y)
    xMoveCursorLabel.current(x)
    yMoveCursorLabel.current(y)
  }
  const manageModal = (active, index, x, y) => {
    moveItems(x, y)
    setModal({active, index})
  }
  const handleProjectClick = (slug) => {
    // Dù active hay không, nếu đã click là điều hướng
    navigate(`/projectDetail/${slug}`);
  };

  return (
  <main onMouseMove={(e) => {moveItems(e.clientX, e.clientY)}} className={styles.projects}>
    <div className={styles.body}>
      {
        projectsItem.slice(0, 4).map( (project, index) => {
          return <Project
              index={index}
              title={project.short}
              manageModal={manageModal}
              key={index}
              onClick={() => handleProjectClick(project.slug)}
          />
        })
      }
    </div>
    <Rounded onClick={() => window.location.href = '/work'}>
      <p> More work</p>
    </Rounded>
    <>
      <motion.div ref={modalContainer}
                  variants={scaleAnimation}
                  initial="initial"
                  animate={active ? "enter" : "closed"}
                  onClick={handleProjectClick}
                  className={styles.modalContainer}>
            <div style={{top: index * -100 + "%"}} className={styles.modalSlider}>
            {
              projectsItem.map( (project, index) => {
                const { src, color } = project
                return <div className={styles.modal} style={{backgroundColor: color}} key={`modal_${index}`}>
                    <img
                    src={src}
                    width={300}
                    height={400}
                    alt="image"
                    />
                </div>
                })
            }
            </div>
        </motion.div>
        <motion.div  ref={cursor} className={styles.cursor} variants={scaleAnimation} initial="initial" animate={active ? "enter" : "closed"}></motion.div>
        <motion.div ref={cursorLabel} className={styles.cursorLabel} variants={scaleAnimation} initial="initial" animate={active ? "enter" : "closed"}>View</motion.div>
    </>
  </main>
  )
}