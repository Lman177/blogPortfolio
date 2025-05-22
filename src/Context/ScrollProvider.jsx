import React, { useRef, useContext } from 'react';
import { useScroll } from 'framer-motion';
import ScrollContext from './ScrollContext';

export const ScrollProvider = ({ children }) => {
  const containerRef = useRef();
  const scroll = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <ScrollContext.Provider value={{ ...scroll, containerRef }}>
      <div ref={containerRef}>
        {children}
      </div>
    </ScrollContext.Provider>
  );
};

// Custom hook để dùng dễ hơn
export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollContext must be used inside ScrollProvider");
  }
  return context;
};
