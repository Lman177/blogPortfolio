import styles from './description.module.css';
import { useInView, motion, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { slideUp, opacity } from './animation';
// import Rounded from '../../common/RoundedButton';

const Description = ({ scrollYProgress }) => {
  const phrase =
    "Helping brands to stand out in the digital era. Together we will set the new status quo. No nonsense, always on the cutting edge.";
  const description = useRef(null);
  const isInView = useInView(description, { once: true }); // optional: animate only once
  const moveUp = useTransform(scrollYProgress, [0, 0.2], ["0px", "-150px"]);

  return (
    <motion.div
      ref={description}
      className={styles.description}
      style={{ y: moveUp }}
    >
      <div className={styles.body}>
        <p>
          {phrase.split(" ").map((word, index) => (
            <span key={index} className={styles.mask}>
              <motion.span
                variants={slideUp}
                custom={index}
                animate={isInView ? 'open' : 'closed'}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </p>

        <motion.p
          variants={opacity}
          animate={isInView ? 'open' : 'closed'}
          className={styles.subText}
        >
          The combination of my passion for design, code & interaction positions
          me in a unique place in the web design world.
        </motion.p>

        <div data-scroll data-scroll-speed={0.1}>
          {/* <Rounded className={styles.button}> */}
            <p>About me</p>
          {/* </Rounded> */}
        </div>
      </div>
    </motion.div >
  );
};

export default Description;
