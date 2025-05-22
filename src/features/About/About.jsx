
import React from 'react'
import style from './style.module.scss'
import Image1 from '@assets/vt2.jpg'
import Lenis from 'lenis';
import { useEffect } from 'react';
import {useTransform, motion } from 'framer-motion';
import Experience from './Component/Experience';
import { useScrollContext } from '@/context/ScrollProvider'; // import context

const About = () => {

  const { scrollYProgress } = useScrollContext(); // lấy từ context
  const moveUp = useTransform(scrollYProgress, [0, 2], ["0px", "-120px"]);


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
          I specialize in building (and occasionally designing) exceptional digital experiences.
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
    
    </div>
  )
}

export default About
