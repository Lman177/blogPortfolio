import { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import styles from './landing.module.scss';
import backgroundImage from '@assets/mainImg.png';
import Magnetic from "@Common/Magnetic.jsx";

const Landing = () => {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);

  // Bạn không cần xPercentRef và direction trong state/ref nữa, GSAP có thể xử lý tốt hơn.
  // Tuy nhiên, để giữ cấu trúc gần với code gốc của bạn, chúng ta sẽ chỉnh lại logic animate.
  const xPercent = useRef(0);
  let direction = -1;

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate dựa trên scroll
    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.25,
        start: 0,
        end: window.innerHeight,
        onUpdate: (e) => (direction = e.direction * -1),
      },
      x: '-=300px', // Di chuyển tương đối để không conflict với animation tự chạy
    });

    // Bắt đầu animation tự chạy
    requestAnimationFrame(animate);
  }, []);

  const animate = () => {
    // 1. Cập nhật vị trí
    // Tăng tốc độ một chút để thấy rõ hiệu ứng
    xPercent.current += 0.07 * direction;

    // 2. Logic "wrapping" để không bị giật
    // Nếu di chuyển sang trái và đi hết 1 vòng (-100%)
    if (xPercent.current < -100) {
      // Thay vì reset về 0, chúng ta cộng thêm 100 để giữ lại phần lẻ
      // Ví dụ: -100.1 -> -0.1. Animation sẽ tiếp tục mượt mà từ đây.
      xPercent.current += 100;
    }
    // Nếu di chuyển sang phải và đi hết 1 vòng (0%)
    else if (xPercent.current > 0) {
      // Tương tự, trừ đi 100
      xPercent.current -= 100;
    }

    // 3. Áp dụng transform cho cả 2 khối text
    // GSAP sẽ tối ưu hóa việc render tốt hơn
    gsap.set(firstText.current, { xPercent: xPercent.current });
    gsap.set(secondText.current, { xPercent: xPercent.current });

    // 4. Lặp lại ở frame tiếp theo
    requestAnimationFrame(animate);
  };

  return (
      <motion.main
          initial="initial"
          animate="enter"
          className={styles.landing}
      >
        <img
            src={backgroundImage}
            alt="background"
            className={styles.background}
        />

        <div className={styles.sliderContainer}>
          <div ref={slider} className={styles.slider}>
            <p ref={firstText}>Hoang Nam - Developer - Hoang Nam - Developer    </p>
            <p ref={secondText}> </p>
          </div>
        </div>

        <div data-scroll data-scroll-speed={0.1} className={styles.description}>

          <p>Hi, I am</p>
          <h1>Hoang Nam</h1>
          <label>Software engineer</label>
          <div style={{display: "flex", gap: "20px", marginTop: "90px"}}>
            <Magnetic>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 64 64">
                  <path
                      d="M32 6C17.641 6 6 17.641 6 32c0 12.277 8.512 22.56 19.955 25.286-.592-.141-1.179-.299-1.755-.479V50.85c0 0-.975.325-2.275.325-3.637 0-5.148-3.245-5.525-4.875-.229-.993-.827-1.934-1.469-2.509-.767-.684-1.126-.686-1.131-.92-.01-.491.658-.471.975-.471 1.625 0 2.857 1.729 3.429 2.623 1.417 2.207 2.938 2.577 3.721 2.577.975 0 1.817-.146 2.397-.426.268-1.888 1.108-3.57 2.478-4.774-6.097-1.219-10.4-4.716-10.4-10.4 0-2.928 1.175-5.619 3.133-7.792C19.333 23.641 19 22.494 19 20.625c0-1.235.086-2.751.65-4.225 0 0 3.708.026 7.205 3.338C28.469 19.268 30.196 19 32 19s3.531.268 5.145.738c3.497-3.312 7.205-3.338 7.205-3.338.567 1.474.65 2.99.65 4.225 0 2.015-.268 3.19-.432 3.697C46.466 26.475 47.6 29.124 47.6 32c0 5.684-4.303 9.181-10.4 10.4 1.628 1.43 2.6 3.513 2.6 5.85v8.557c-.576.181-1.162.338-1.755-.479C49.488 54.56 58 44.277 58 32 58 17.641 46.359 6 32 6zM33.813 57.93C33.214 57.972 32.61 58 32 58 32.61 58 33.213 57.971 33.813 57.93zM37.786 57.346c-1.164.265-2.357.451-3.575.554C35.429 57.797 36.622 57.61 37.786 57.346zM32 58c-.61 0-1.214-.028-1.813-.07C30.787 57.971 31.39 58 32 58zM29.788 57.9c-1.217-.103-2.411-.289-3.574-.554C27.378 57.61 28.571 57.797 29.788 57.9z"></path>
                </svg>
              </a>
            </Magnetic>
            <Magnetic>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50">
                  <path
                      d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path>
                </svg>
              </a>
            </Magnetic>
            <Magnetic>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">

                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50">
                  <path
                      d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z"></path>
                </svg>

              </a>
            </Magnetic>

          </div>
        </div>
      </motion.main>
  );
};

export default Landing;