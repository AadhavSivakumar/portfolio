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
  // 0: Idle (Initial position)
  // 1: Lifting (Hover up)
  // 2: Expanded (Full modal)
  // 3: Shrinking (Back to Hover up)
  // 4: Dropping (Back to Initial position)
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState(project.imageUrl);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Update media when project changes
  useEffect(() => {
    setSelectedMediaUrl(project.imageUrl);
  }, [project]);

  // Track window size
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Open Sequence: Lift -> Expand
  useEffect(() => {
    // Start sequence
    const rAF = requestAnimationFrame(() => {
        setPhase(1); // Start lifting
        // Wait for lift to finish then expand
        setTimeout(() => {
            setPhase(2);
        }, 350); 
    });
    return () => cancelAnimationFrame(rAF);
  }, []);

  // Handle ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && phase === 2) handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [phase]);

  // Close Sequence: Shrink -> Drop -> Unmount
  const handleClose = useCallback(() => {
    setPhase(3); // Start shrinking
    setTimeout(() => {
        setPhase(4); // Start dropping
        setTimeout(() => {
            onClose(); // Unmount
        }, 300); // Wait for drop
    }, 400); // Wait for shrink
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && phase === 2) handleClose();
  };

  // --- Layout Calculations ---
  const maxWidth = 1024;
  const margin = windowSize.width < 768 ? 20 : 40;
  const targetWidth = Math.min(windowSize.width - (margin * 2), maxWidth);
  const maxModalHeight = windowSize.height - (margin * 2);
  const targetHeight = Math.min(maxModalHeight, isCompact ? 600 : 800); 
  const targetLeft = (windowSize.width - targetWidth) / 2;
  const targetTop = (windowSize.height - targetHeight) / 2;

  // --- Dynamic Styles based on Phase ---
  const containerStyle: React.CSSProperties = useMemo(() => {
    const baseStyle: React.CSSProperties = {
        position: 'fixed',
        zIndex: 50,
        backgroundColor: 'var(--surface-color)',
        overflow: 'hidden',
    };

    // Initial / Dropped State
    const idleState = {
        top: initialBounds.top,
        left: initialBounds.left,
        width: initialBounds.width,
        height: initialBounds.height,
        borderRadius: '0.5rem', // rounded-lg
        transform: 'translateY(0)',
        boxShadow: '0 0 0 0 rgba(0,0,0,0)',
    };

    // Lifted State - More Vertical
    const liftedState = {
        top: initialBounds.top,
        left: initialBounds.left,
        width: initialBounds.width,
        height: initialBounds.height,
        borderRadius: '0.5rem',
        transform: 'translateY(-60px) scale(1.02)', // Strong vertical lift, subtle scale
        boxShadow: '0 25px 30px -5px rgba(0, 0, 0, 0.2), 0 15px 15px -5px rgba(0, 0, 0, 0.1)', 
    };

    // Expanded State
    const expandedState = {
        top: targetTop,
        left: targetLeft,
        width: targetWidth,
        height: targetHeight,
        borderRadius: '0.75rem',
        transform: 'translateY(0) scale(1)', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    };

    switch (phase) {
        case 0: // Idle
            return { ...baseStyle, ...idleState, transition: 'none' };
        case 1: // Lifting
            return { 
                ...baseStyle, ...liftedState, 
                // Bouncy/Snappy curve for lift
                transition: 'transform 350ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 350ms ease'
            };
        case 2: // Expanding
            return { 
                ...baseStyle, ...expandedState, 
                transition: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)' 
            };
        case 3: // Shrinking (Target Lifted State)
            return { 
                ...baseStyle, ...liftedState, 
                transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)' 
            };
        case 4: // Dropping (Target Idle State)
            return { 
                ...baseStyle, ...idleState, 
                // EXACT SAME curve as Lifting for seamless/snappy feel
                transition: 'transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 300ms ease' 
            };
        default:
            return baseStyle;
    }
  }, [phase, initialBounds, targetTop, targetLeft, targetWidth, targetHeight]);

  // Image Height Transition
  const initialImageHeight = isCompact ? '12rem' : '16rem';
  const targetImageHeight = windowSize.width < 768 ? '30vh' : '45vh';
  // Use target height only in expanded phase
  const currentImageHeight = (phase === 2) ? targetImageHeight : initialImageHeight;

  const allMediaItems = useMemo(() => {
      const coverType = (project.imageUrl.endsWith('.mp4') || project.imageUrl.endsWith('.webm')) ? 'video' : 'image';
      const items: MediaItem[] = [{ type: coverType as 'image' | 'video', url: project.imageUrl, thumbnailUrl: project.imageUrl }];
      if (project.media) {
          items.push(...project.media);
      }
      return items;
  }, [project]);

  // Content Visibility
  // Show card content only during Idle (0) or Lifting (1). 
  // Hide during Expand (2), Shrink (3), and Drop (4) to ensure it's blank on return.
  const showCardContent = phase === 0 || phase === 1;
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
        className="flex flex-col ring-1 ring-border shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Media Section */}
        <div 
            className="relative w-full shrink-0 overflow-hidden bg-black transition-all duration-500 ease-in-out" 
            style={{ height: currentImageHeight }}
        >
            <MediaDisplay 
                src={selectedMediaUrl} 
                alt={project.title} 
                className="w-full h-full object-cover" 
            />
            
            {/* Gradient Overlay for Card View */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 transition-opacity duration-300 ${!showCardContent ? 'opacity-0' : 'opacity-100'}`}></div>

            {/* Close Button */}
            <button
                onClick={handleClose}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/75 transition-all duration-300 ${showModalContent ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                aria-label="Close"
            >
                <CloseIcon />
            </button>
        </div>

        {/* Content Container */}
        <div className="flex-grow relative overflow-hidden bg-surface">
            
            {/* Card View Content (Visible when NOT expanded) */}
            <div 
                className={`absolute inset-0 w-full transition-opacity duration-300 ease-in-out ${showCardContent ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'}`}
            >
                 <div className={`flex flex-col h-full ${isCompact ? 'p-4' : 'p-6'}`}>
                    {isCompact ? (
                        <>
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-md text-primary truncate pr-2">{project.title}</h3>
                                {project.status && <StatusIndicator status={project.status} className="mt-1" />}
                            </div>
                            <p className="text-sm text-secondary mb-3">{project.category}</p>
                            <div className="flex flex-wrap gap-1.5">
                                {project.technologies.slice(0, 2).map((tech) => (
                                <span key={tech} className="bg-accent text-white dark:text-black text-[11px] font-semibold px-2 py-0.5 rounded-full">{tech}</span>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-sm font-medium text-accent">{project.category}</p>
                                {project.status && <StatusIndicator status={project.status} showText />}
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-2">{project.title}</h3>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {project.technologies.slice(0, 4).map((tech) => (
                                <span key={tech} className="bg-accent text-white dark:text-black text-xs font-semibold px-3 py-1 rounded-full shadow-sm">{tech}</span>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

             {/* Detailed Modal Content (Visible when EXPANDED) */}
             <div 
                className="absolute inset-0 w-full h-full overflow-y-auto p-6 md:p-8"
                style={{ opacity: showModalContent ? 1 : 0, transition: 'opacity 200ms ease-in-out' }}
             >
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header: Title, Category, Status */}
                    <div 
                        className={`transform-gpu transition-all duration-500 ease-out ${showModalContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
                        style={{ transitionDelay: '200ms' }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-accent">{project.category}</p>
                            {project.status && <StatusIndicator status={project.status} showText />}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{project.title}</h2>
                    </div>

                    {/* Description */}
                    <div 
                        className={`prose dark:prose-invert max-w-none text-secondary transform-gpu transition-all duration-500 ease-out ${showModalContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        style={{ transitionDelay: '350ms' }}
                    >
                        {project.modalContent ? (
                            project.modalContent.map((item, index) => {
                                if (item.type === 'text') return <p key={index} className="mb-4 text-base leading-relaxed">{item.value}</p>;
                                return null;
                            })
                        ) : (
                            <p className="text-base leading-relaxed">{project.description}</p>
                        )}
                    </div>
                    
                    {/* Gallery */}
                    {allMediaItems.length > 1 && (
                        <div 
                            className={`transform-gpu transition-all duration-500 ease-out ${showModalContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: '500ms' }}
                        >
                            <h3 className="text-lg font-semibold text-primary mb-3">Gallery</h3>
                            <div className="flex flex-wrap gap-3">
                                {allMediaItems.map((item, index) => {
                                    const isSelected = selectedMediaUrl === item.url;
                                    const thumbnailUrl = item.thumbnailUrl || item.url;
                                    const isVideoThumb = thumbnailUrl.endsWith('.mp4');
                                    
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedMediaUrl(item.url)}
                                            className={`
                                                relative w-24 h-16 rounded-md overflow-hidden 
                                                border-2 transition-all duration-200
                                                ${isSelected ? 'border-accent scale-105' : 'border-transparent opacity-70 hover:opacity-100'}
                                            `}
                                        >
                                            {isVideoThumb ? (
                                                <video src={thumbnailUrl} className="w-full h-full object-cover" muted />
                                            ) : (
                                                <img src={thumbnailUrl} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                                            )}
                                            {item.type === 'video' && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                    <PlayIcon className="w-6 h-6 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Technologies */}
                    <div 
                        className={`transform-gpu transition-all duration-500 ease-out ${showModalContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        style={{ transitionDelay: '650ms' }}
                    >
                        <h3 className="text-lg font-semibold text-primary mb-3">Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                             {project.technologies.map(tech => (
                                <span key={tech} className="bg-accent text-white dark:text-black text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                                    {tech}
                                </span>
                             ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div 
                        className={`flex flex-wrap gap-4 pt-4 border-t border-border transform-gpu transition-all duration-500 ease-out ${showModalContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        style={{ transitionDelay: '800ms' }}
                    >
                        {project.modalContent?.map((item, index) => {
                            if (item.type === 'button') {
                                return (
                                    <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-white dark:text-black font-semibold bg-accent px-5 py-2.5 rounded-lg hover:opacity-90 transition-transform active:scale-95 shadow-md">
                                        <ExternalLinkIcon />
                                        <span>{item.text}</span>
                                    </a>
                                );
                            }
                            if (item.type === 'embed') {
                                return (
                                     <a key={index} href={item.value} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-primary font-semibold bg-surface border border-border px-5 py-2.5 rounded-lg hover:bg-border/20 transition-transform active:scale-95">
                                        <ExternalLinkIcon />
                                        <span>{item.title}</span>
                                    </a>
                                );
                            }
                            return null;
                        })}
                         {!project.modalContent && project.liveUrl && (
                             <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-white dark:text-black font-semibold bg-accent px-5 py-2.5 rounded-lg hover:opacity-90 transition-transform active:scale-95 shadow-md">
                                <ExternalLinkIcon />
                                <span>Live Demo</span>
                             </a>
                        )}
                    </div>
                </div>
             </div>
        </div>
      </div>
    </>
  );
};

export default ProjectModal;