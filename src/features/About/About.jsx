
import React, {useContext} from 'react'
import style from './style.module.scss'
import Image1 from '@assets/vt2.jpg'
import {useTransform, motion } from 'framer-motion';
import Experience from './Component/Experience';
import {LenisContext} from "@/App.jsx";

const About = () => {
    const { scrollYProgress } = useContext(LenisContext) || {};
  const moveUp = useTransform(scrollYProgress, [0, 0.7], ["0px", "-100px"]);
  const height = useTransform(scrollYProgress, [0, 0.9], [30, 0]);


  return (
    <div className={style.about}>
      <h1>Hi, I'm Nam aka Software Engineer</h1>
      
      <div className={style.divider_container}>
        <hr className={style.divider_line} />
          <div className={style.divider_icon}>
            🌐 
          </div>
      </div>

      <div className={style.about__content}>
        <div className={style.block}>

        </div>      
        <div className={style.text}>
          <h2>
          A 22-year-old aspiring developer & designer with a passion for making things not just work, but look great.

Ever since I wrote my first line of code, I’ve been obsessed with design—how things move, feel, and interact. I believe great design is invisible, intuitive, and leaves a lasting impression. That's why I’m always experimenting with new frameworks, tools, and visual styles—whether it’s through animation, UI components, or full-on brand systems.
          </h2>
          <p>Always Exploring...</p>
        </div>   
        
        
        <motion.div className={style.imageContainer} style={{ y: moveUp }}>
          <p></p>
          <div className={style.image}>
            <img
              alt="image"
              src={Image1}
              
            />
          </div>
        </motion.div>
        

      </div>

    <Experience/> 
    <motion.div style={{ height }} className={style.circleContainer}>
                <div className={style.circle}></div>
      </motion.div>
    </div>
  )
}

export default About
