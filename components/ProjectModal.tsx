import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Project, MediaItem } from '../types';
import { CloseIcon, ExternalLinkIcon, PlayIcon } from './Icons';
import { StatusIndicator } from './ProjectCard';

interface ProjectModalProps {
  project: Project;
  initialBounds: DOMRect;
  isCompact: boolean;
  onClose: () => void;
}

const MediaDisplay: React.FC<{ src: string; alt: string; className: string }> = ({ src, alt, className }) => {
  const isVideo = src.endsWith('.mp4') || src.endsWith('.webm');
  if (isVideo) {
    return <video src={src} className={className} autoPlay loop muted playsInline />;
  }
  return <img src={src} alt={alt} className={className} />;
};

const ProjectModal: React.FC<ProjectModalProps> = ({ project, initialBounds, isCompact, onClose }) => {
  // Phases: 
  // 0: Idle
  // 1: Lifting
  // 2: Separating (to Center)
  // 3: Expanding (Full Modal)
  // 4: Collapsing (to Center)
  // 5: Joining (to Lifted Pos)
  // 6: Dropping
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState(project.imageUrl);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    setSelectedMediaUrl(project.imageUrl);
  }, [project]);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Open Sequence - Timings slowed down to mirror closing sequence
  useEffect(() => {
    const rAF = requestAnimationFrame(() => {
        setPhase(1); // Start Lift
        setTimeout(() => {
            setPhase(2); // Start glide to center
            setTimeout(() => {
                setPhase(3); // Final expand
            }, 500); // Wait for glide to complete
        }, 400); // Wait for lift to complete (slower, matches drop)
    });
    return () => cancelAnimationFrame(rAF);
  }, []);

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
            // Allow time for the drop animation AND the backdrop fade out
            setTimeout(() => {
                onClose();
            }, 500);
        }, 500);
    }, 500);
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
        backgroundColor: 'var(--surface-color)',
        borderRadius: '0.5rem',
        boxShadow: '0 0 0 0 rgba(0,0,0,0)',
    };

    const liftedState = {
        ...idleState,
        transform: 'translateY(-40px) scale(1.02)', // Slightly less extreme lift
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', 
    };

    const separatedState = {
        top: separatedTop,
        left: separatedLeft,
        width: separatedWidth,
        height: separatedHeight,
        transform: 'translateY(0) scale(1)', 
        // Background becomes transparent so the gap between panes shows the backdrop/content behind
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

    // Refined easing: Cubic-bezier(0.33, 1, 0.68, 1) is "Quint Out"
    const swiftMove = 'cubic-bezier(0.25, 1, 0.5, 1)'; 
    const cinematicExpand = 'cubic-bezier(0.65, 0, 0.35, 1)'; 
    
    // Explicitly transition background-color for gradual change. Duration matched to lift/drop phase (500ms)
    const baseTransition = `transform 500ms ${swiftMove}, box-shadow 500ms ease, background-color 500ms ease, border-radius 500ms ease`;
    const moveTransition = `all 500ms ${swiftMove}`;
    const expandTransition = `all 600ms ${cinematicExpand}`;

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

  const isSeparated = !isMobile && (phase === 2 || phase === 3 || phase === 4);
  const isExpanded = phase === 3;
  const isStacked = !isSeparated; 

  const cardImageHeightRem = isCompact ? '12rem' : '16rem';
  const gap = isMobile ? '1rem' : isExpanded ? '2rem' : '1.5rem';
  const cinematicExpand = 'cubic-bezier(0.65, 0, 0.35, 1)';
  const swiftMove = 'cubic-bezier(0.25, 1, 0.5, 1)';
  
  // Panes should inherit the movement curve
  const paneTransition = isExpanded ? `all 600ms ${cinematicExpand}` : `all 500ms ${swiftMove}`;

  const leftPaneStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: isStacked ? '100%' : '42%', 
      height: isStacked ? cardImageHeightRem : '100%',
      borderRadius: isSeparated ? '1rem' : '0',
      boxShadow: isSeparated ? (isExpanded ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 10px 20px -5px rgba(0, 0, 0, 0.2)') : 'none',
      transition: paneTransition,
      overflow: 'hidden',
      backgroundColor: 'black',
  };

  const rightPaneStyle: React.CSSProperties = {
      position: 'absolute',
      top: isStacked ? cardImageHeightRem : 0,
      left: isStacked ? 0 : `calc(42% + ${gap})`,
      width: isStacked ? '100%' : `calc(58% - ${gap})`,
      height: isStacked ? `calc(100% - ${cardImageHeightRem})` : '100%',
      borderRadius: isSeparated ? '1rem' : '0',
      boxShadow: isSeparated ? (isExpanded ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 10px 20px -5px rgba(0, 0, 0, 0.1)') : 'none',
      overflow: 'hidden', 
      backgroundColor: 'var(--surface-color)',
      transition: paneTransition,
  };

  const allMediaItems = useMemo(() => {
      const coverType = (project.imageUrl.endsWith('.mp4') || project.imageUrl.endsWith('.webm')) ? 'video' : 'image';
      const items: MediaItem[] = [{ type: coverType as 'image' | 'video', url: project.imageUrl, thumbnailUrl: project.imageUrl }];
      if (project.media) {
          items.push(...project.media);
      }
      return items;
  }, [project]);

  // Content visibility: Fade in only when expanded
  const isContentReady = phase === 3;
  const contentTransition = 'transition-all duration-500 ease-out';
  const contentOpacity = isContentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';
  const getDelay = (base: number) => isExpanded ? `${base + 150}ms` : '0ms';

  // Backdrop should fade out starting at phase 6 (Dropping)
  const showBackdrop = phase >= 1 && phase < 6;

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-700 ease-in-out ${showBackdrop ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleBackdropClick}
        aria-hidden="true"
        style={{ pointerEvents: phase === 3 ? 'auto' : 'none' }} 
      />

      <div 
        style={containerStyle} 
        role="dialog"
        aria-modal="true"
      >
        <div style={leftPaneStyle} className="flex flex-col">
            <div className={`relative w-full ${isSeparated ? 'flex-grow min-h-0' : 'h-full'}`}>
                <MediaDisplay 
                    src={selectedMediaUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover" 
                />
                
                {/* Gradient overlay fades out gradually as we enter expanded state */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 transition-opacity duration-700 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}></div>

                <button
                    onClick={handleClose}
                    className={`absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/75 transition-all duration-400 ${isExpanded ? 'opacity-100 scale-100 delay-500' : 'opacity-0 scale-75 pointer-events-none'}`}
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
            <div className={`flex flex-col h-full ${isCompact && !isSeparated ? 'p-4' : 'p-6 md:p-8'} ${isExpanded ? 'overflow-y-auto' : 'overflow-hidden'}`}>
                
                <div className="shrink-0 mb-6">
                     <div className={`flex flex-col sm:flex-row justify-between items-start mb-4 ${contentTransition} ${contentOpacity}`} style={{ transitionDelay: getDelay(0) }}>
                        <div className="flex flex-col flex-grow">
                             <p className={`font-bold text-accent transition-all duration-500 ${isExpanded ? 'text-lg md:text-2xl mb-2' : 'text-sm mb-1 opacity-0'}`}>{project.category}</p>
                             <h2 className={`font-extrabold text-primary transition-all duration-600 leading-tight ${isExpanded ? 'text-5xl md:text-7xl' : 'text-lg md:text-xl'}`}>{project.title}</h2>
                        </div>
                        {project.status && <StatusIndicator status={project.status} showText={isExpanded} className={`${isExpanded ? 'mt-4 sm:mt-2' : 'mt-1'} transition-opacity duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0'}`} />}
                    </div>

                    <div className={`flex flex-wrap gap-3 ${contentTransition} ${contentOpacity}`} style={{ transitionDelay: getDelay(100) }}>
                         {project.technologies.map((tech) => (
                            <span key={tech} className={`bg-accent text-white dark:text-black font-bold rounded-full shadow-sm transition-all duration-500 ${isExpanded ? 'text-sm md:text-base px-4 py-1.5' : 'text-xs px-2 py-1'}`}>{tech}</span>
                        ))}
                    </div>
                </div>

                <div className={`flex-grow ${contentTransition} ${contentOpacity}`} style={{ transitionDelay: getDelay(200) }}>
                    <div className="prose dark:prose-invert max-w-none text-secondary mb-10">
                        {project.modalContent ? (
                            project.modalContent.map((item, index) => {
                                if (item.type === 'text') return <p key={index} className="mb-6 text-lg md:text-xl leading-relaxed">{item.value}</p>;
                                return null;
                            })
                        ) : (
                            <p className="text-lg md:text-xl leading-relaxed">{project.description}</p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4 pt-6 border-t border-border">
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