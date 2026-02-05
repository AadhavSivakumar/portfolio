import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CloseIcon, FileIcon, FilesIcon, PaperGradeIcon } from './Icons';

interface DocumentModalProps {
  url: string;
  title: string;
  initialBounds: DOMRect;
  onClose: () => void;
}

const ButtonContent: React.FC<{ title: string }> = ({ title }) => {
    let Icon = FileIcon;
    let grade = "";
    
    if (title === 'Extended CV') {
        Icon = FilesIcon;
    } else if (title.includes('Transcript')) {
        Icon = PaperGradeIcon;
        grade = title.includes('Undergrad') ? "A" : "A+";
    }

    // Determine text display format for transcripts
    const displayTitle = title === 'Undergraduate Transcript' 
        ? <>Undergraduate<br/>Transcript</> 
        : (title === 'Graduate Transcript' ? <>Graduate<br/>Transcript</> : title);

    return (
        <div className="flex flex-col items-center justify-center gap-2 w-full h-full text-primary">
            {title.includes('Transcript') ? (
                 <PaperGradeIcon grade={grade} className="w-10 h-10 sm:w-12 sm:h-12 text-accent transition-colors duration-300" />
            ) : (
                 <Icon className="w-12 h-12 text-accent transition-colors duration-300" />
            )}
            <span className="font-bold text-xs sm:text-base text-center leading-tight">{displayTitle}</span>
        </div>
    );
};

const DocumentModal: React.FC<DocumentModalProps> = ({ url, title, initialBounds, onClose }) => {
  // Phases: 
  // 0: Idle 
  // 1: Lifting 
  // 2: Expanded 
  // 3: Shrinking 
  // 4: Dropping 
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const rAF = requestAnimationFrame(() => {
        setPhase(1); // Lift
        setTimeout(() => {
            setPhase(2); // Expand
        }, 350);
    });
    return () => cancelAnimationFrame(rAF);
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && phase === 2) handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [phase]);

  const handleClose = useCallback(() => {
    setPhase(3); // Shrink
    setTimeout(() => {
        setPhase(4); // Drop
        setTimeout(() => {
            onClose(); // Unmount
        }, 350);
    }, 500);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && phase === 2) handleClose();
  };

  const targetWidth = Math.min(windowSize.width * 0.95, 1024);
  const targetHeight = Math.min(windowSize.height * 0.9, 900);
  const targetLeft = (windowSize.width - targetWidth) / 2;
  const targetTop = (windowSize.height - targetHeight) / 2;

  const containerStyle: React.CSSProperties = useMemo(() => {
    const baseStyle: React.CSSProperties = {
        position: 'fixed',
        zIndex: 50,
        backgroundColor: 'var(--surface-color)', 
        overflow: 'hidden',
    };

    const idleState = {
        top: initialBounds.top,
        left: initialBounds.left,
        width: initialBounds.width,
        height: initialBounds.height,
        borderRadius: '0.75rem', // Match rounded-xl
        transform: 'translateY(0)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // Match shadow-lg
        opacity: 1, 
    };

    const liftedState = {
        top: initialBounds.top,
        left: initialBounds.left,
        width: initialBounds.width,
        height: initialBounds.height,
        borderRadius: '0.75rem',
        transform: 'translateY(-60px) scale(1.05)', 
        boxShadow: '0 25px 30px -5px rgba(0, 0, 0, 0.2), 0 15px 15px -5px rgba(0, 0, 0, 0.1)',
        opacity: 1,
    };

    const expandedState = {
        top: targetTop,
        left: targetLeft,
        width: targetWidth,
        height: targetHeight,
        borderRadius: '0.75rem',
        transform: 'translateY(0) scale(1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        opacity: 1,
    };

    switch (phase) {
        case 0: return { ...baseStyle, ...idleState, transition: 'none' };
        case 1: return { ...baseStyle, ...liftedState, transition: 'transform 350ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 350ms ease' };
        case 2: return { ...baseStyle, ...expandedState, transition: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)' };
        case 3: return { ...baseStyle, ...liftedState, transition: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)' };
        case 4: return { 
            ...baseStyle, 
            ...idleState, 
            transition: 'transform 350ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 350ms ease' 
        };
        default: return baseStyle;
    }
  }, [phase, initialBounds, targetTop, targetLeft, targetWidth, targetHeight]);

  const overlayClass = "bg-surface border border-border";
  
  const showButtonContent = phase !== 2;
  const showModalContent = phase === 2;

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${phase === 2 ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleBackdropClick}
        aria-hidden="true"
        style={{ pointerEvents: phase === 2 ? 'auto' : 'none' }}
      />

      <div 
        style={containerStyle} 
        role="dialog" 
        aria-modal="true" 
        className={`flex flex-col ring-1 ring-border transition-colors duration-500 ${overlayClass}`}
      >
          {/* Button Placeholder Content */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${showButtonContent ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'}`}>
               <ButtonContent title={title} />
          </div>

          {/* Actual Modal Content */}
          <div className={`flex flex-col w-full h-full transition-opacity duration-500 ease-in-out ${showModalContent ? 'opacity-100 delay-200' : 'opacity-0'}`}>
             <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
                <h2 className="text-xl font-bold text-primary">{title}</h2>
                <button
                    onClick={handleClose}
                    className="w-10 h-10 rounded-full bg-surface hover:bg-border/50 flex items-center justify-center text-primary transition-colors"
                    aria-label="Close"
                >
                    <CloseIcon />
                </button>
             </div>
             <div className="flex-grow p-0 overflow-hidden bg-white"> 
                 <iframe
                    src={url}
                    title={title}
                    className="w-full h-full border-0"
                 />
             </div>
          </div>
      </div>
    </>
  );
};

export default DocumentModal;