import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Project, MediaItem } from '../types';
import { CloseIcon, ExternalLinkIcon, PlayIcon } from './Icons';
import { StatusIndicator, getTagStyle } from './ProjectCard';

interface ProjectModalProps {
  project: Project;
  initialBounds: DOMRect;
  isCompact: boolean;
  onClose: () => void;
}

const MediaDisplay: React.FC<{ src: string; alt: string; className: string }> = ({ src, alt, className }) => {
  const isVideo = src.endsWith('.mp4') || src.endsWith('.webm');
  // Use state to handle seamless loading if needed, currently direct render for speed
  if (isVideo) {
    return (
        <video 
            src={src} 
            className={className} 
            autoPlay 
            loop 
            muted 
            playsInline 
            preload="auto"
        />
    );
  }
  return <img src={src} alt={alt} className={className} />;
};

const ProjectModal: React.FC<ProjectModalProps> = ({ project, initialBounds, isCompact, onClose }) => {
  // Phases: 
  // 0: Idle
  // 1: Lifting (Header Visible, Body Hidden)
  // 2: Separating (Header Fades Out, Body Hidden)
  // 3: Expanding (All Hidden -> Staggers In)
  // 4: Collapsing (All Fades Out)
  // 5: Joining 
  // 6: Dropping
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState(project.imageUrl);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [showContent, setShowContent] = useState(false);
  const [displayTitle, setDisplayTitle] = useState(project.title);

  useEffect(() => {
    setSelectedMediaUrl(project.imageUrl);
    setDisplayTitle(project.title);
  }, [project]);

  // Title Switching Logic
  // When Phase 3 starts (Expanded), switch to Modal Title (invisible at first, fades in)
  // When Phase 5 starts (Joining/Closing), switch back to Short Title (invisible at first)
  useEffect(() => {
    if (phase === 3 && project.modalTitle) {
      setDisplayTitle(project.modalTitle);
    } else if (phase === 5) {
      setDisplayTitle(project.title);
    }
  }, [phase, project.modalTitle, project.title]);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Open Sequence
  useEffect(() => {
    const rAF = requestAnimationFrame(() => {
        setPhase(1); // Start Lift
        setTimeout(() => {
            setPhase(2); // Start glide to center
            setTimeout(() => {
                setPhase(3); // Final expand
            }, 400); 
        }, 300); // Lift duration
    });
    return () => cancelAnimationFrame(rAF);
  }, []);

  // Content Visibility Trigger
  useEffect(() => {
    if (phase === 3) {
        // Wait for the expansion transition (approx 600ms) to mostly finish before showing text
        const timer = setTimeout(() => setShowContent(true), 500); 
        return () => clearTimeout(timer);
    } else {
        setShowContent(false);
    }
  }, [phase]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && phase === 3) handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [phase]);

  const handleClose = useCallback(() => {
    setPhase(4);
    setTimeout(() => {
        setPhase(5);
        setTimeout(() => {
            setPhase(6);
            setTimeout(() => {
                onClose();
            }, 400);
        }, 400);
    }, 450);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && phase === 3) handleClose();
  };

  // --- Layout Calculations ---
  const isMobile = windowSize.width < 768;
  const maxWidth = 1400; 
  const margin = isMobile ? 16 : 32; 
  
  const targetWidth = Math.min(windowSize.width - (margin * 2), maxWidth);
  const maxModalHeight = windowSize.height - (margin * 2);
  const targetHeight = Math.min(maxModalHeight, isMobile ? 800 : 850); 
  const targetLeft = (windowSize.width - targetWidth) / 2;
  const targetTop = (windowSize.height - targetHeight) / 2;

  const centerX = windowSize.width / 2;
  const centerY = windowSize.height / 2;
  
  const sepScale = isMobile ? 1.0 : 2.0; 
  const separatedWidth = Math.min(windowSize.width - (margin * 2), initialBounds.width * sepScale);
  const separatedHeight = initialBounds.height; 
  
  const separatedLeft = centerX - separatedWidth / 2;
  const separatedTop = centerY - separatedHeight / 2;

  const containerStyle: React.CSSProperties = useMemo(() => {
    const baseStyle: React.CSSProperties = {
        position: 'fixed',
        zIndex: 50,
        display: 'block', 
        overflow: 'hidden', 
        willChange: 'transform, top, left, width, height, opacity, background-color, border-radius',
    };

    const idleState = {
        top: initialBounds.top,
        left: initialBounds.left,
        width: initialBounds.width,
        height: initialBounds.height,
        transform: 'translateY(0)',
        backgroundColor: 'rgba(0,0,0,0)', 
        borderRadius: '0.5rem',
        boxShadow: '0 0 0 0 rgba(0,0,0,0)',
    };

    const liftedState = {
        ...idleState,
        transform: 'translateY(-20px) scale(1.02)', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', 
    };

    const separatedState = {
        top: separatedTop,
        left: separatedLeft,
        width: separatedWidth,
        height: separatedHeight,
        transform: 'translateY(0) scale(1)', 
        backgroundColor: 'rgba(0, 0, 0, 0)', 
        borderRadius: '0.75rem',
        boxShadow: 'none',
    };

    const expandedState = {
        top: targetTop,
        left: targetLeft,
        width: targetWidth,
        height: targetHeight,
        transform: 'translateY(0) scale(1)', 
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderRadius: '0.75rem',
        boxShadow: 'none',
    };

    const smoothEase = 'cubic-bezier(0.4, 0, 0.2, 1)'; 
    
    const baseTransition = `transform 400ms ${smoothEase}, box-shadow 400ms ease, background-color 400ms ease, border-radius 400ms ease`;
    const moveTransition = `all 500ms ${smoothEase}`;
    const expandTransition = `all 600ms ${smoothEase}`;

    switch (phase) {
        case 0: return { ...baseStyle, ...idleState, transition: 'none' };
        case 1: return { ...baseStyle, ...liftedState, transition: baseTransition }; 
        case 2: return { ...baseStyle, ...separatedState, transition: moveTransition }; 
        case 3: return { ...baseStyle, ...expandedState, transition: expandTransition }; 
        case 4: return { ...baseStyle, ...separatedState, transition: expandTransition }; 
        case 5: return { ...baseStyle, ...liftedState, transition: moveTransition }; 
        case 6: return { ...baseStyle, ...idleState, transition: baseTransition }; 
        default: return baseStyle;
    }
  }, [phase, initialBounds, targetTop, targetLeft, targetWidth, targetHeight, separatedTop, separatedLeft, separatedWidth, separatedHeight]);

  const isSeparated = phase === 2 || phase === 3 || phase === 4;
  const isExpanded = phase === 3;
  
  // Phase 0 & 1 match the Card State exactly (Opening start)
  // Phase 5 & 6 match the Card State exactly (Closing end)
  const isCardState = phase === 0 || phase === 1 || phase === 5 || phase === 6;

  const layoutMode = isMobile 
    ? (isSeparated ? 'column' : 'row') // Note: This check is superseded by logic below for calculating pane styles
    : (isSeparated ? 'row' : 'column');

<<<<<<< HEAD
  const modalImageHeightMobile = '21.12rem'; 
=======
  const modalImageHeightMobile = '16rem'; 
>>>>>>> 00010b115c80dce8bbb03218dab701592181f4b7
  const gap = isMobile ? '1rem' : (phase === 3 ? '2rem' : '1.5rem');

  const smoothEase = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const paneTransition = `all 600ms ${smoothEase}`;

  let leftPaneBase: React.CSSProperties = {};
  let rightPaneBase: React.CSSProperties = {};

  if (isCardState) {
      if (isMobile) {
          // CARD STATE (Mobile): Horizontal Row Layout
          // Image 35%, Text 65% (matching ProjectCard)
          leftPaneBase = { top: 0, left: 0, width: '35%', height: '100%' };
          rightPaneBase = { top: 0, left: '35%', width: '65%', height: '100%' };
      } else {
          // CARD STATE (Desktop): Vertical Column Layout
          // Compact Card: Image 50%, Text 50%
          // Regular Card: Image 55%, Text 45%
          // Updated to 70% as per recent ProjectCard changes
          const imageHeight = isCompact ? '70%' : '70%';
          const mediaHeightClass = project.id === 'about-me' ? '60%' : '70%'; 
          
          const finalImageHeight = project.id === 'about-me' ? mediaHeightClass : imageHeight;
          const textHeight = `calc(100% - ${finalImageHeight})`;
          
          leftPaneBase = { top: 0, left: 0, width: '100%', height: finalImageHeight };
          rightPaneBase = { top: finalImageHeight, left: 0, width: '100%', height: textHeight };
      }
  } else {
      // MODAL STATE: Expanded or Transitioning
      if (isMobile) {
          // Mobile Modal (Column)
          leftPaneBase = { top: 0, left: 0, width: '100%', height: modalImageHeightMobile };
          rightPaneBase = { top: `calc(${modalImageHeightMobile} + ${gap})`, left: 0, width: '100%', height: `calc(100% - ${modalImageHeightMobile} - ${gap})` };
      } else {
          // Desktop Modal (Row)
          leftPaneBase = { top: 0, left: 0, width: '45%', height: '100%' };
          rightPaneBase = { top: 0, left: `calc(45% + ${gap})`, width: `calc(55% - ${gap})`, height: '100%' };
      }
  }

  const leftPaneStyle: React.CSSProperties = {
      position: 'absolute',
      ...leftPaneBase,
      borderRadius: isSeparated ? '0.75rem' : '0',
      boxShadow: isSeparated ? (isExpanded ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 10px 20px -5px rgba(0, 0, 0, 0.2)') : 'none',
      transition: paneTransition,
      overflow: 'hidden',
      // Changed from 'black' to 'var(--surface-color)' to avoid black flash during media load
      backgroundColor: 'var(--surface-color)', 
      zIndex: 2,
  };

  const rightPaneStyle: React.CSSProperties = {
      position: 'absolute',
      ...rightPaneBase,
      borderRadius: isSeparated ? '0.75rem' : '0',
      boxShadow: isSeparated ? (isExpanded ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 10px 20px -5px rgba(0, 0, 0, 0.1)') : 'none',
      overflow: 'hidden', 
      backgroundColor: 'var(--surface-color)',
      transition: paneTransition,
      zIndex: 1,
  };

  const allMediaItems = useMemo(() => {
      const coverType = (project.imageUrl.endsWith('.mp4') || project.imageUrl.endsWith('.webm')) ? 'video' : 'image';
      const items: MediaItem[] = [{ type: coverType as 'image' | 'video', url: project.imageUrl, thumbnailUrl: project.imageUrl }];
      if (project.media) {
          items.push(...project.media);
      }
      return items;
  }, [project]);

  // Backdrop Logic:
  // Fade in during Separating (Phase 2)
  // Visible during Expanding (Phase 3) & Collapsing (Phase 4)
  // Fade out during Joining (Phase 5 starts, showBackdrop becomes false)
  // Hidden during Lifting (Phase 1) and Dropping (Phase 6)
  const showBackdrop = phase >= 2 && phase < 5;

  const descriptionItems = project.modalContent || [{ type: 'text', value: project.description }];

  // Helper for staggered animation styles
  const getStaggerStyle = (order: number) => {
    const isHeader = order < 3;

    // Phase 0 & 1: Lifting Phase (Match Card)
    if (phase === 0 || phase === 1) {
        return {
            opacity: isHeader ? 1 : 0,
            transform: isHeader ? 'translateY(0)' : 'translateY(1.5rem)',
            transition: 'none'
        };
    }
    
    // Phase 2: Separation (Fade out Header)
    if (!showContent) {
        return {
            opacity: 0,
            transform: isHeader ? 'translateY(0)' : 'translateY(1.5rem)', 
            transition: 'opacity 300ms ease-out'
        };
    }

    // Phase 3 (Content Ready): Stagger in
    return {
        opacity: 1,
        transform: 'translateY(0)',
        transition: `opacity 600ms cubic-bezier(0.2, 0.8, 0.2, 1) ${order * 75}ms, transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1) ${order * 75}ms`
    };
  };

  // Status Indicator: Visible on Desktop Card (Text), Mobile Card (Icon).
  const showStatusText = isExpanded || (!isMobile);

  // Layout Spacing Logic to Match ProjectCard
  // Compact: px-3 pt-1 pb-1.5 md:px-4 md:pt-1.5 md:pb-4
  // Regular: px-3.5 pt-1.5 pb-2 md:px-5 md:pt-2 md:pb-4
  const startPadding = isCompact 
    ? 'px-3 pt-1 pb-1.5 md:px-4 md:pt-1.5 md:pb-4' 
    : 'px-3.5 pt-1.5 pb-2 md:px-5 md:pt-2 md:pb-4';
  
  const endPadding = 'p-6 md:p-8';
  const contentPadding = isExpanded ? endPadding : startPadding;

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${showBackdrop ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleBackdropClick}
        aria-hidden="true"
        style={{ pointerEvents: phase === 3 ? 'auto' : 'none' }} 
      />

      <div 
        style={containerStyle} 
        role="dialog"
        aria-modal="true"
      >
        <div style={leftPaneStyle} className="flex flex-col group">
            <div className={`relative w-full ${isSeparated ? 'flex-grow min-h-0' : 'h-full'}`}>
                <MediaDisplay 
                    src={selectedMediaUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 transition-opacity duration-700 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}></div>

                <button
                    onClick={handleClose}
                    className={`absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/75 transition-all duration-400 ${isExpanded ? 'opacity-100 scale-100 delay-300' : 'opacity-0 scale-75 pointer-events-none'}`}
                    aria-label="Close"
                >
                    <CloseIcon />
                </button>
            </div>

            <div 
                className={`bg-surface border-t border-border p-4 transition-all duration-600 ease-in-out shrink-0 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full h-0 p-0'}`}
            >
                {allMediaItems.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {allMediaItems.map((item, index) => {
                            const isSelected = selectedMediaUrl === item.url;
                            const thumbnailUrl = item.thumbnailUrl || item.url;
                            const isVideoThumb = thumbnailUrl.endsWith('.mp4');
                            return (
                                <button
                                    key={index}
                                    onClick={() => setSelectedMediaUrl(item.url)}
                                    className={`
                                        relative w-20 h-14 shrink-0 rounded-md overflow-hidden 
                                        border-2 transition-all duration-300
                                        ${isSelected ? 'border-accent scale-105 ring-2 ring-accent/30' : 'border-transparent opacity-70 hover:opacity-100'}
                                    `}
                                >
                                    {isVideoThumb ? (
                                        <video src={thumbnailUrl} className="w-full h-full object-cover" muted />
                                    ) : (
                                        <img src={thumbnailUrl} alt={`Thumb ${index}`} className="w-full h-full object-cover" />
                                    )}
                                    {item.type === 'video' && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <PlayIcon className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>

        <div style={rightPaneStyle} className="flex flex-col">
            <div className={`flex flex-col h-full transition-all duration-500 ease-in-out ${contentPadding} ${isExpanded ? 'justify-start overflow-y-auto' : 'justify-center overflow-hidden'}`}>
                
                {/* Header Section */}
                <div className={`shrink-0 ${isCardState ? 'h-full flex flex-col' : ''}`}>
                     {/* Category & Status Row */}
                     <div className={`flex justify-between items-center transition-all duration-500 ease-in-out ${isExpanded ? 'items-start mb-4' : 'mb-1'}`}>
                         <p 
                            className={`font-bold origin-left transition-all duration-500 ease-in-out ${isExpanded ? 'text-lg md:text-2xl text-accent' : 'text-xs md:text-sm text-secondary'}`}
                            style={getStaggerStyle(0)}
                         >
                            {project.category}
                         </p>
                         
                         {project.status && (
                            <div style={getStaggerStyle(0)} className={isExpanded ? 'mt-1' : ''}>
                                <StatusIndicator status={project.status} showText={showStatusText} />
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h2 
                        className={`font-extrabold text-primary leading-tight origin-left transition-all duration-500 ease-in-out ${isExpanded ? 'text-4xl md:text-6xl mb-6' : 'text-lg md:text-xl mb-2 line-clamp-2 md:line-clamp-none'}`}
                        style={getStaggerStyle(1)}
                    >
                        {displayTitle}
                    </h2>

                    {/* Tags */}
                    {/* isCardState applies mt-auto to match the Card's flex-grow behavior */}
                    <div 
                        className={`flex flex-wrap transition-all duration-500 ease-in-out ${isExpanded ? 'gap-2 md:gap-3 mb-10' : `gap-1.5 md:gap-2 ${isCardState ? 'mt-auto' : (isMobile ? 'mt-1' : 'mt-2')}`}`} 
                        style={getStaggerStyle(2)}
                    >
                         {project.technologies.map((tech) => (
<<<<<<< HEAD
                            <span key={tech} className={`${getTagStyle(tech, false)} rounded-full shadow-sm transition-all duration-500 ${isExpanded ? 'text-sm md:text-base px-3 py-1 md:px-4 md:py-1.5' : 'text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1'}`}>{tech}</span>
=======
                            <span key={tech} className={`bg-accent text-white dark:text-black font-bold rounded-full shadow-sm transition-all duration-500 ${isExpanded ? 'text-sm md:text-base px-3 py-1 md:px-4 md:py-1.5' : 'text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1'}`}>{tech}</span>
>>>>>>> 00010b115c80dce8bbb03218dab701592181f4b7
                        ))}
                    </div>
                </div>

                {/* Body Section */}
                <div className={`flex-grow ${!isExpanded ? 'hidden' : ''}`}>
                    <div className="prose dark:prose-invert max-w-none text-secondary mb-10">
                        {descriptionItems.map((item, index) => {
                            if (item.type === 'text') {
                                return (
                                    <p 
                                        key={index} 
                                        className="mb-6 text-lg md:text-xl leading-relaxed"
                                        style={getStaggerStyle(3 + index)}
                                    >
                                        {item.value}
                                    </p>
                                );
                            }
                            return null;
                        })}
                    </div>

                    <div className="flex flex-wrap gap-4 pt-6 border-t border-border" style={getStaggerStyle(3 + descriptionItems.length)}>
                        {project.modalContent?.map((item, index) => {
                            if (item.type === 'button') {
                                return (
                                    <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-white dark:text-black font-bold bg-accent px-6 py-3 rounded-xl hover:opacity-90 transition-transform active:scale-95 shadow-lg text-lg">
                                        <ExternalLinkIcon />
                                        <span>{item.text}</span>
                                    </a>
                                );
                            }
                            if (item.type === 'embed') {
                                return (
                                     <a key={index} href={item.value} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-white dark:text-black font-bold bg-accent px-6 py-3 rounded-xl hover:opacity-90 transition-transform active:scale-95 shadow-lg text-lg">
                                        <ExternalLinkIcon />
                                        <span>{item.title}</span>
                                    </a>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default ProjectModal;