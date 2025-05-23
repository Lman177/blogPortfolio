import styles from './description.module.css';
import { useInView, motion, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { slideUp, opacity } from './animation';
import Rounded from '../../Common/RoundedButton/RoundedButton';

export default function Description({scrollYProgress}) {

    const phrase = "Helping brands to stand out in the digital era. Together we will set the new status quo. No nonsense, always on the cutting edge.";
    const description = useRef(null);
    
    const moveUp = useTransform(scrollYProgress, [0, 0.2], ["0px", "-150px"]);
    const moveUpBtn = useTransform(scrollYProgress, [0, 0.5], ["0px", "-200px"]);
    const isInView = useInView(description, {
      once: false,
      margin: '-20% 0px -20% 0px' // chỉ kích hoạt khi phần tử nằm sâu trong viewport
    });

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 716);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 716);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    console.log(isInView);
    return (
        <motion.div 
          ref={description} 
          className={styles.description} 
          style={{ y: moveUp }}
          
          
          >
            <div className={styles.body}>
                <p>
                {
                    phrase.split(" ").map( (word, index) => {
                        return (
                        <span 
                        key={index} 
                        className={styles.mask}>
                            <motion.span 
                              variants={slideUp} 
                              custom={index} 
                              initial="initial"
                              animate={isInView ? "open" : "closed"} 
                              key={index}>

                                {word}
                                
                            </motion.span>
                        </span>

                        )
                    })
                }
                </p>
                <motion.p variants={opacity} animate={isInView ? "open" : "closed"}>The combination of my passion for design, code & interaction positions me in a unique place in the web design world.</motion.p>
                <motion.div style={isMobile ? {} : { y: moveUpBtn }}>
                    <Rounded className={styles.button}>
                        <p>About me</p>
                    </Rounded>
                </motion.div>
            </div>
        </motion.div>
    )
}
