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
                    <div className={styles.infoItem1}>
                        <span>
                            <h3>Version</h3>
                            <p>2025 © Edition</p>
                        </span>
                        <span>
                           
                            <p>{currentTime}</p>
                        </span>
                    </div>
                    <div className={styles.infoItem2}>
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