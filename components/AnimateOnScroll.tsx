import React, { useRef, useState, useEffect, RefObject, CSSProperties } from 'react';

/**
 * A custom hook to determine if an element is within the viewport.
 * @param ref - The React ref attached to the element to observe.
 * @param triggerOnce - If true, the observer will unobserve the target after it has been in view once.
 * @returns boolean - True if the element is in the viewport, false otherwise.
 */
const useInView = (ref: RefObject<HTMLElement>, triggerOnce: boolean): boolean => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, triggerOnce]);

  return isInView;
};

/**
 * A wrapper component that animates its children when they scroll into view.
 * It applies a fade-in and slide-up effect.
 */
interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Animation delay in milliseconds
}

const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, true);

  const style: CSSProperties = {
    transitionDelay: `${delay}ms`,
  };

  return (
    <div
      ref={ref}
      className={`${className} transform-gpu transition-all duration-700 ease-out ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={style}
    >
      {children}
    </div>
  );
};

export default AnimateOnScroll;
