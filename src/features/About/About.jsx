// About.jsx - Toàn bộ file
import React, { useRef } from 'react';
import style from './style.module.scss';
import Image1 from '@assets/vt2.jpg';
import { useScroll, useTransform, motion } from 'framer-motion';
import Experience from './Component/Experience';
import {
    FaCode,
    FaCss3Alt,
    FaFigma,
    FaGitAlt,
    FaHtml5, FaJava,
    FaJsSquare,
    FaNodeJs,
    FaPython,
    FaReact,
    FaTools
} from "react-icons/fa";
import {IoMdFootball} from "react-icons/io";
import {MdSportsTennis} from "react-icons/md";
import AnimationWrapper from "@/Blog/Common2/page-animation.jsx";

// 2. CẬP NHẬT LẠI DỮ LIỆU SKILLS

// Dữ liệu mẫu, bạn có thể thay thế bằng dữ liệu của mình
const educationData = {
    school: "University of Science and Technology of Hanoi",
    degree: "Bachelor of ICT",
    years: "2020 - 2024"
};

const skillsData = [
    { name: 'HTML5', icon: <FaHtml5 /> },
    { name: 'CSS3', icon: <FaCss3Alt /> },
    { name: 'JavaScript', icon: <FaJsSquare /> },
    { name: 'React', icon: <FaReact /> },
    { name: 'Node.js', icon: <FaNodeJs /> },
    { name: 'Python', icon: <FaPython /> },
    { name: 'Java', icon: <FaJava /> },
    { name: 'Git', icon: <FaGitAlt /> },
];

// Dữ liệu Hobby về thể thao
const hobbiesData = [
    { name: 'Đá bóng', icon: <IoMdFootball /> },
    { name: 'Cầu lông', icon: <MdSportsTennis /> },
    { name: 'Tennis', icon: <MdSportsTennis /> },
];


const About = () => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end end"]
    });
    const moveUp = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const height = useTransform(scrollYProgress, [0, 0.9], [150, 0]);

    return (
        <AnimationWrapper>


            <div ref={container} className={style.about}>
                <h1>Hi, I'm Nam aka Software Engineer</h1>

                <div className={style.divider_container}>
                    <hr className={style.divider_line}/>
                    <div className={style.divider_icon}>🌐</div>
                </div>

                <div className={style.about__content}>
                    <div className={style.text}>
                        <h2>
                            A 22-year-old aspiring developer & designer with a passion for making things not just work,
                            but
                            look great.
                            Ever since I wrote my first line of code, I’ve been obsessed with design—how things move,
                            feel,
                            and interact. I believe great design is invisible, intuitive, and leaves a lasting
                            impression.
                        </h2>
                        <p>Always Exploring...</p>
                    </div>
                    <motion.div className={style.imageContainer} style={{y: moveUp}}>
                        <div className={style.image}>
                            <img alt="image" src={Image1}/>
                        </div>
                    </motion.div>
                </div>

                <div className={style.general}>
                    {/* --- EDUCATION (Giữ nguyên) --- */}
                    <section className={`${style.education} ${style.card}`}>
                        <h3 className={style.sectionTitle}>Education</h3>
                        <div className={style.infoItem}>
                            <h4>{educationData.school}</h4>
                            <p>{educationData.degree}</p>
                            <span>{educationData.years}</span>
                        </div>
                    </section>

                    {/* --- SKILL (Cập nhật cấu trúc) --- */}
                    <section className={`${style.skill} ${style.card}`}>
                        <h3 className={style.sectionTitle}>Skills</h3>
                        {/* Lưới hiển thị các icon */}
                        <div className={style.skillIconGrid}>
                            {skillsData.map((skill) => (
                                // "title" attribute sẽ tạo tooltip đơn giản khi hover
                                <div key={skill.name} className={style.skillIcon} title={skill.name}>
                                    {skill.icon}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* --- HOBBY (Cập nhật cấu trúc) --- */}
                    <section className={`${style.hobby} ${style.card}`}>
                        <h3 className={style.sectionTitle}>Hobby</h3>
                        {/* Danh sách các sở thích */}
                        <ul className={style.hobbyList}>
                            {hobbiesData.map((hobby) => (
                                <li key={hobby.name} className={style.hobbyItem}>
                                    <span className={style.hobbyIcon}>{hobby.icon}</span>
                                    <p>{hobby.name}</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <Experience/>

                <motion.div style={{height}} className={style.circleContainer}>
                    <div className={style.circle}></div>
                </motion.div>
            </div>
        </AnimationWrapper>
    )
}

export default About;