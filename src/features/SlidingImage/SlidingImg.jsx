import React, { useRef } from 'react'; // Bỏ useContext
import { useScroll, useTransform, motion } from 'framer-motion';
import styles from './style.module.scss';
// Bỏ import LenisContext nếu không dùng ở đâu khác
// import {LenisContext} from "@/App.jsx";

const slider1 = [
    { color: "#e3e5e7", src: "c2.jpg" },
    { color: "#d6d7dc", src: "decimal.jpg" },
    { color: "#e3e3e3", src: "funny.jpg" },
    { color: "#21242b", src: "google.jpg" }
];

const slider2 = [
    { color: "#d4e3ec", src: "maven.jpg" },
    { color: "#e5e0e1", src: "panda.jpg" },
    { color: "#d7d4cf", src: "powell.jpg" },
    { color: "#e1dad6", src: "wix.jpg" }
];

export default function SlidingImg() {
    const container = useRef(null);

    // THAY ĐỔI CHÍNH Ở ĐÂY
    // Thay vì dùng useContext, hãy cấu hình useScroll như sau:
    const { scrollYProgress } = useScroll({
        target: container, // Theo dõi phần tử được gán ref={container}
        offset: ["start end", "end start"] // Bắt đầu animation khi container đi vào, kết thúc khi nó đi ra
    });

    // Các dòng useTransform này giờ sẽ hoạt động đúng
    const x1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const x2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const height = useTransform(scrollYProgress, [0, 1], [50, 0]);

    return (
        <>
            <h2 className={styles.heading}>Our Client</h2>
            {/* Gán ref vào đây để useScroll biết cần theo dõi phần tử nào */}
            <div ref={container} className={styles.slidingImages}>
                <motion.div style={{x: x1}} className={styles.slider}>
                    {slider1.map((project, index) => (
                        <div key={index} className={styles.project} style={{backgroundColor: project.color}}>
                            <div className={styles.imageContainer}>
                                <img
                                    alt="image"
                                    src={`/images/${project.src}`}
                                />
                            </div>
                        </div>
                    ))}
                </motion.div>
                <motion.div style={{x: x2}} className={styles.slider}>
                    {slider2.map((project, index) => (
                        <div key={index} className={styles.project} style={{backgroundColor: project.color}}>
                            <div className={styles.imageContainer}>
                                <img
                                    alt="image"
                                    src={`/images/${project.src}`}
                                />
                            </div>
                        </div>
                    ))}
                </motion.div>

            </div>
            <motion.div style={{height}} className={styles.circleContainer}>
                <div className={styles.circle}></div>
            </motion.div>
        </>
    );
}