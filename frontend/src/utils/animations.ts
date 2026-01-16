import { useState, useEffect } from 'react';

/**
 * Intersection Observer hook for scroll-triggered animations
 * @param threshold - Percentage of element visibility to trigger (0.1 = 10%)
 * @returns [setRef, isInView] - Ref callback and visibility state
 */
export const useInView = (threshold = 0.1) => {
    const [ref, setRef] = useState<HTMLElement | null>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        if (!ref) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold }
        );

        observer.observe(ref);
        return () => observer.disconnect();
    }, [ref, threshold]);

    return [setRef, isInView] as const;
};

/**
 * Number counter animation hook
 * @param end - Target number to count up to
 * @param duration - Animation duration in milliseconds
 * @param inView - Whether element is in view (triggers animation)
 * @returns current count value
 */
export const useCounter = (end: number, duration = 2000, inView = true) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;

        const startTime = Date.now();
        const endTime = startTime + duration;

        const update = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            // Ease-out cubic for smooth deceleration
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOutCubic * end));

            if (now < endTime) {
                requestAnimationFrame(update);
            } else {
                setCount(end); // Ensure exact end value
            }
        };

        requestAnimationFrame(update);
    }, [end, duration, inView]);

    return count;
};

/**
 * Parallax scroll effect hook
 * @param speed - Parallax speed multiplier (0.5 = half scroll speed)
 * @returns current parallax offset in pixels
 */
export const useParallax = (speed = 0.5) => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        let rafId: number;
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            // Throttle using requestAnimationFrame for 60fps
            rafId = requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                if (currentScrollY !== lastScrollY) {
                    setOffset(currentScrollY * speed);
                    lastScrollY = currentScrollY;
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [speed]);

    return offset;
};
