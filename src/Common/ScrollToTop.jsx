// src/Common/ScrollToTop.jsx
import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import {LenisContext} from "@/App.jsx";


function ScrollToTop() {
    const { pathname } = useLocation();
    const { lenis } = useContext(LenisContext) || {};

    useEffect(() => {
        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
        }
    }, [pathname, lenis]);

    return null;
}
export default ScrollToTop;