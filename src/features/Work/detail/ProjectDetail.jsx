// src/components/ProjectDetail/ProjectDetail.jsx (hoặc đường dẫn tương ứng)

import React, {useEffect, useRef, useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsItem } from '@Common/projects.js'; // Đường dẫn đến file projects.js của bạn
import styles from './style.module.scss';
import {motion, useScroll, useTransform} from "framer-motion";
import AnimationWrapper from "@/Blog/Common2/page-animation.jsx"; // Sử dụng file style hiện tại của bạn

const ProjectDetail = () => {
    const { slug } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end start"]
    });
    const height = useTransform(scrollYProgress, [0, 0.9], [300, 0]);

    useEffect(() => {
        const foundProject = projectsItem.find(p => p.slug === slug);
        if (foundProject) {
            setProject(foundProject);
        } else {
            setProject(null);
        }
        setLoading(false);
    }, [slug]);

    // Helper function để render các content blocks
    const renderContentBlocks = (blocks) => {
        if (!blocks) return null;

        const elements = [];
        let currentListItems = [];

        blocks.forEach((block, index) => {
            // Nếu block hiện tại không phải LIST_ITEM và có currentListItems, render list trước
            if (block.type !== "LIST_ITEM" && currentListItems.length > 0) {
                elements.push(<ul key={`ul-${elements.length}`} className={styles.list}>{currentListItems}</ul>);
                currentListItems = []; // Reset
            }

            switch (block.type) {
                case "HEADING":
                    { const Tag = `h${block.level || 2}`; // Mặc định là h2 nếu không có level
                    elements.push(<Tag key={`block-${index}`} dangerouslySetInnerHTML={{ __html: block.content }}></Tag>);
                    break; }
                case "PARAGRAPH":
                    elements.push(<p key={`block-${index}`} dangerouslySetInnerHTML={{ __html: block.content }}></p>);
                    break;
                case "IMAGE":
                    elements.push(
                        <figure key={`block-${index}`} className={styles.contentImageBlock}>
                            <img src={block.content} alt={block.altText || project?.title || ''} />
                            {block.caption && <figcaption dangerouslySetInnerHTML={{ __html: block.caption }}></figcaption>}
                        </figure>
                    );
                    break;
                case "LIST_ITEM":
                    currentListItems.push(<li key={`li-${index}`} dangerouslySetInnerHTML={{ __html: block.content }}></li>);
                    break;
                default:
                    // Có thể log ra console nếu gặp block type không xác định
                    // console.warn("Unknown block type:", block.type);
                    break;
            }
        });

        // Đảm bảo list cuối cùng (nếu có) được render
        if (currentListItems.length > 0) {
            elements.push(<ul key={`ul-${elements.length}`} className={styles.list}>{currentListItems}</ul>);
        }

        return elements;
    };

    if (loading) {
        return <div className={styles.loadingState}>Đang tải thông tin dự án...</div>;
    }

    if (!project) {
        return (
            <div className={styles.notFoundState}>
                <h2>Không tìm thấy dự án</h2>
                <p>Dự án với slug "{slug}" không tồn tại.</p>
                <Link to="/">Quay lại trang chủ</Link>
            </div>
        );
    }

    return (
        <AnimationWrapper>
        <div className={styles.container} ref={container}>
            <div className={styles.detail_container}>
                <div className={styles.header}>
                    <h1>{project.title}</h1>
                    {project.categoryName && project.year && (
                        <p className={styles.categoryAndYear}>
                            {project.categoryName} - {project.year}
                        </p>

                    )}
                </div>

                <div>
                    {project.technologies && project.technologies.length > 0 && (
                        <p className={styles.technologies}>
                            <strong>Công nghệ sử dụng:</strong> {project.technologies.join(', ')}
                        </p>
                    )}
                </div>

                {project.src && (
                    <img src={project.src} alt={`Ảnh bìa ${project.title}`} className={styles.coverImage}/>
                )}
                {/*{project.technologies  (*/}
                {/*    <p className={styles.excerpt}  dangerouslySetInnerHTML={{__html: project.technologies}}>  </p>*/}
                {/*)}*/}

                {project.excerpt && (
                    <p className={styles.excerpt} dangerouslySetInnerHTML={{__html: project.excerpt}}></p>
                )}

                <div className={styles.contentBody}>
                    {renderContentBlocks(project.contentBlocks)}
                </div>

                {project.tagNames && project.tagNames.length > 0 && (
                    <div className={styles.tagsContainer}>
                        <h4>Tags:</h4>
                        <ul className={styles.tagsList}>
                            {project.tagNames.map((tag, index) => (
                                <li key={index} className={styles.tagItem}>{tag}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Giữ lại link xem trực tiếp nếu có */}
                {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                       className={styles.liveLinkButton}>
                        Xem trực tiếp dự án
                    </a>
                )}

                <div className={styles.navigation}>
                    <Link to="/work" className={styles.backButton}>← Quay lại danh sách</Link>
                </div>
            </div>
            <motion.div style={{height}} className={styles.circleContainer}>
                <div className={styles.circle}></div>
            </motion.div>
        </div>
        </AnimationWrapper>
    );
};

export default ProjectDetail;