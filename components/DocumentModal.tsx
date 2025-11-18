import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CloseIcon, FileIcon, FilesIcon } from './Icons';

interface DocumentModalProps {
  url: string;
  title: string;
  initialBounds: DOMRect;
  onClose: () => void;
  onStartFalling?: () => void;
}

type AnimationState = 'entering' | 'lifted' | 'expanded' | 'collapsing' | 'falling';

// Component to replicate the button content during the animation
const ButtonContent: React.FC<{ title: string }> = ({ title }) => {
    const isResume = title === 'Resume';
    return (
        <div className="relative z-10 flex items-center justify-center gap-2 w-full h-full">
            {isResume ? <FileIcon /> : <FilesIcon />}
            <span>{isResume ? 'View Resume' : 'View Extended CV'}</span>
        </div>
    );
};

const DocumentModal: React.FC<DocumentModalProps> = ({ url, title, initialBounds, onClose, onStartFalling }) => {
  const [animationState, setAnimationState] = useState<AnimationState>('entering');
  const [isIframeVisible, setIsIframeVisible] = useState(false);

  const handleClose = useCallback(() => {
    setAnimationState('collapsing');
  }, []);

  const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    const rafId = requestAnimationFrame(() => {
      setAnimationState('lifted');
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [handleClose]);

  useEffect(() => {
    if (animationState === 'expanded') {
      // Set a timeout to fade in the iframe after the modal has expanded
      const timer = setTimeout(() => {
        setIsIframeVisible(true);
      }, 250); // Corresponds to modal's content fade-in delay
      return () => clearTimeout(timer);
    }
  }, [animationState]);

  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;

    if (animationState === 'lifted' && e.propertyName === 'transform') {
      setAnimationState('expanded');
    }
    if (animationState === 'collapsing' && e.propertyName === 'width') {
      onStartFalling?.();
      setAnimationState('falling');
    }
    if (animationState === 'falling' && e.propertyName === 'transform') {
      onClose();
    }
  };

  const modalStyle = useMemo((): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      overflow: 'hidden',
      willChange: 'top, left, width, height, transform, box-shadow, opacity, border-radius',
      borderRadius: '0.5rem', // Match button's rounded-lg
    };

    const initialStyle = {
      top: `${initialBounds.top}px`,
      left: `${initialBounds.left}px`,
      width: `${initialBounds.width}px`,
      height: `${initialBounds.height}px`,
      transform: 'translateY(0) scale(1)',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', // Match button's shadow-lg
      opacity: 1,
    };

    const liftedStyle = {
      ...initialStyle,
      transform: 'translateY(-60px) scale(1.05)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    };

    const targetWidth = Math.min(1024, window.innerWidth * 0.9);
    const targetHeight = Math.min(768, window.innerHeight * 0.9);
    
    const expandedStyle = {
      top: `calc(50% - ${targetHeight / 2}px)`,
      left: `calc(50% - ${targetWidth / 2}px)`,
      width: `${targetWidth}px`,
      height: `${targetHeight}px`,
      transform: 'translateY(0) scale(1)',
      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      borderRadius: '0.75rem', // Larger border radius when expanded
    };
    
    const transitionCurve = 'cubic-bezier(0.65, 0, 0.35, 1)';
    const expandTransition = `top 360ms ${transitionCurve}, left 360ms ${transitionCurve}, width 360ms ${transitionCurve}, height 360ms ${transitionCurve}, transform 360ms ${transitionCurve}, box-shadow 360ms ${transitionCurve}, border-radius 360ms ${transitionCurve}`;
    const liftFallTransition = `transform 288ms ${transitionCurve}, box-shadow 288ms ${transitionCurve}, opacity 288ms ${transitionCurve}`;
    const collapseTransition = `top 360ms ${transitionCurve}, left 360ms ${transitionCurve}, width 360ms ${transitionCurve}, height 360ms ${transitionCurve}, transform 360ms ${transitionCurve}, box-shadow 360ms ${transitionCurve}, border-radius 360ms ${transitionCurve}`;


    switch (animationState) {
      case 'entering':
        return { ...baseStyle, ...initialStyle, transition: 'none' };
      
      case 'lifted':
        return { ...baseStyle, ...liftedStyle, transition: liftFallTransition };
      
      case 'expanded':
        return { ...baseStyle, ...expandedStyle, transition: expandTransition };

      case 'collapsing':
        return { ...baseStyle, ...liftedStyle, transition: collapseTransition };
      
      case 'falling':
        return { ...baseStyle, ...initialStyle, opacity: 0, transition: liftFallTransition };

      default:
        return {};
    }
  }, [animationState, initialBounds]);

  const isExpanded = animationState === 'expanded';
  const isCloseButtonVisible = isExpanded;
  const isButtonContentVisible = animationState === 'entering' || animationState === 'lifted';

  return (
    <div
      className="fixed inset-0 z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={handleWrapperClick}
    >
      <div
        style={modalStyle}
        onTransitionEnd={onTransitionEnd}
        className="text-primary font-semibold bg-surface/30 dark:bg-surface/20 backdrop-blur border border-black/15 dark:border-white/25 transition-colors duration-500"
      >
        <div className="w-full h-full flex flex-col">
          {/* Cross-fading content area */}
          <div className="flex-grow relative overflow-hidden">
            {/* Button Content (visible only during card-like states) */}
            <div className={`absolute inset-0 transition-opacity duration-100 ease-out pointer-events-none ${isButtonContentVisible ? 'opacity-100' : 'opacity-0'}`}>
              <ButtonContent title={title} />
            </div>
            
            {/* Expanded Modal Content (fades in) */}
            <div className={`w-full h-full flex flex-col transition-opacity duration-300 ease-out bg-surface ${isExpanded ? 'opacity-100 delay-150' : 'opacity-0'} transition-colors duration-500`}>
              <header className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                <h2 id="modal-title" className="text-xl font-bold text-primary">{title}</h2>
              </header>
              <div className="flex-grow p-2">
                  <iframe
                      src={url}
                      title={title}
                      className={`w-full h-full border-0 rounded-b-lg transition-opacity duration-500 ${isIframeVisible ? 'opacity-100' : 'opacity-0'}`}
                  />
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/75 transition-all duration-300 ease-in-out z-10 ${isCloseButtonVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          aria-label={`Close ${title}`}
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default DocumentModal;