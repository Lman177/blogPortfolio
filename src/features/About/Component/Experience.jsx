import React, {useRef} from 'react'
import style from './style.module.scss'
import {useTransform, motion, useScroll} from 'framer-motion';

const timelineData = [
  {
    title: 'Internship at University',
    date: 'April - July 2024',
    description: '',
    side: 'left',
  },
  {
    title: 'Back-end Internship at XYZ',
    date: 'May - March 2024',
    description: '',
    side: 'right',
  },
  {
    title: 'Software Engineer at Company XYZ',
    date: 'Sept - Jan 2024',
    description: '',
    side: 'left',
  },
  {
    title: 'Viettel Digital Talent',
    date: 'Now',
    description: '',
    side: 'right',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.2,
    },
  }),
};


const Experience = () => {

  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"]
  });
  const height = useTransform(scrollYProgress, [0, 0.9], [150, 0]);

  return (
      <>
        <div className={style.experience}>


          <h2 className={style.heading}>Working Experience</h2>
          <div className={style.timeline}>
            <div className={style.verticalLine}></div>
            {timelineData.map((item, index) => (
                <motion.div
                    key={index}
                    className={`${style.timelineItem} ${style[item.side]}`}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true, amount: 0.2}}
                    variants={fadeInUp}
                >
                  <span className={style.dot}></span>
                  <div className={style.content}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className={style.date}>{item.date}</span>
                  </div>
                </motion.div>
            ))}
          </div>


        </div>
        <div className={style.cando}>
          <h2 className={style.heading}>What can I help you with?</h2>
          <div className={style.box}>
            <div className={style.box_item}>
              <p>01</p>
              <div className={style.divider_container}>
                <hr className={style.divider_line}/>
              </div>
              <h3>Design</h3>
              <p>System architecture, user interface and user experience design, wireframing, and prototyping.</p>
            </div>
            <div className={style.box_item}>
              <p>02</p>
              <div className={style.divider_container}>
                <hr className={style.divider_line}/>
              </div>
              <h3>Development</h3>
              <p>I build scalable websites from scratch that fit seamlessly with design. My focus is on micro
                animations, transitions and interaction. Building with Webflow (or Kirby CMS).</p>
            </div>
            <div className={style.box_item}>
              <p>03</p>
              <div className={style.divider_container}>
                <hr className={style.divider_line}/>
              </div>
              <h3>The full package</h3>
              <p>A complete website from concept to implementation, that's what makes me stand out. My great sense for
                design and my development skills enable me to create kick-ass projects.</p>
            </div>
          </div>
        </div>

        <motion.div style={{height}} className={style.circleContainer}>
          <div className={style.circle}></div>
        </motion.div>
      </>

  )
}

export default Experience
