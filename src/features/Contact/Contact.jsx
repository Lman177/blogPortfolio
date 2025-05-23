import styles from './style.module.scss';
import Rounded from '../../Common/RoundedButton/RoundedButton';
import { useRef } from 'react';
import { useScroll, motion, useTransform } from 'framer-motion';
import Magnetic from '../../Common/Magnetic';
import Image from '@assets/background.png';
import { useState, useEffect } from 'react';

export default function Contact() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end end"]
    });
    const x = useTransform(scrollYProgress, [0, 0.3], [0, 30]);
    const y = useTransform(scrollYProgress, [0, 1], [-100, 0]);
    const rotate = useTransform(scrollYProgress, [0, 1], [120, 90]);

    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div style={{ y }} ref={container} className={styles.contact}>
            <div className={styles.body}>
                <div className={styles.title}>
                    <span>
                        <div className={styles.imageContainer}>
                            <img
                                alt="image"
                                src={Image}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                        <h2>Let's work</h2>
                    </span>
                    <h2>together</h2>
                    <motion.div style={{ x }} className={styles.buttonContainer}>
                        <Rounded backgroundColor={"#334BD3"} className={styles.button}>
                            <p>Get in touch</p>
                        </Rounded>
                    </motion.div>
                    <motion.svg style={{ rotate, scale: 2 }} width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 8.5C8.27614 8.5 8.5 8.27614 8.5 8L8.5 3.5C8.5 3.22386 8.27614 3 8 3C7.72386 3 7.5 3.22386 7.5 3.5V7.5H3.5C3.22386 7.5 3 7.72386 3 8C3 8.27614 3.22386 8.5 3.5 8.5L8 8.5ZM0.646447 1.35355L7.64645 8.35355L8.35355 7.64645L1.35355 0.646447L0.646447 1.35355Z" fill="white"/>
                    </motion.svg>
                </div>
                <div className={styles.nav}>
                    <Rounded>
                        <p>hoangnam@gmail.com</p>
                    </Rounded>
                    <Rounded>
                        <p>+84 99 99 68 68</p>
                    </Rounded>
                </div>
                <div className={styles.info}>
                    <div>
                        <span>
                            <h3>Version</h3>
                            <p>2025 © Edition</p>
                        </span>
                        <span>
                           
                            <p>{currentTime}</p>
                        </span>
                    </div>
                    <div>
                        <span>
                            <h3>socials</h3>
                        </span>
                        <Magnetic>
                            <a href='https://www.instagram.com/'>Instagram</a>
                        </Magnetic>
                        <Magnetic>
                            <a href='https://www.facebook.com/'>FaceBook</a>
                        </Magnetic>
                        <Magnetic>
                            <a href='https://www.linkedin.com/'>Linkedin</a>
                        </Magnetic>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}