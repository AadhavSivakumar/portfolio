import React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Project, MediaItem } from '../types';
import { CloseIcon, ExternalLinkIcon, PlayIcon } from './Icons';
import { StatusIndicator } from './ProjectCard';

interface ProjectModalProps {
  project: Project;
  initialBounds: DOMRect;
  isCompact: boolean;
  onClose: () => void;
  onStartFalling?: () => void;
}

type AnimationState = 'entering' | 'lifted' | 'expanded' | 'collapsing' | 'falling';

const MediaDisplay: React.FC<{ src: string; alt: string; className: string }> = ({ src, alt, className }) => {
  const isVideo = src.endsWith('.mp4') || src.endsWith('.webm');
  if (isVideo) {
    return <video src={src} className={className} autoPlay loop muted playsInline />;
  }
  return <img src={src} alt={alt} className={className} />;
};

// A component to replicate the card's text content inside the modal for a seamless transition
const CardTextContent: React.FC<{ project: Project; isCompact: boolean }> = ({ project, isCompact }) => {
  if (isCompact) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-md text-primary truncate pr-2">{project.title}</h3>
          {project.status && <StatusIndicator status={project.status} className="mt-1" />}
        </div>
        <p className="text-sm text-secondary mb-3">{project.category}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 2).map(tech => (
            <span key={tech} className="bg-accent text-white dark:text-black text-[11px] font-semibold px-2 py-0.5 rounded-full">{tech}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm font-medium text-accent">{project.category}</p>
        {project.status && <StatusIndicator status={project.status} showText />}
      </div>
      <h3 className="text-xl font-bold text-primary mb-2">{project.title}</h3>
      <div className="flex flex-wrap gap-2 mt-4">
        {project.technologies.slice(0, 4).map(tech => (
          <span key={tech} className="bg-accent text-white dark:text-black text-xs font-semibold px-3 py-1 rounded-full">{tech}</span>
        ))}
      </div>
    </div>
  );
};


const ProjectModal: React.FC<ProjectModalProps> = ({ project, initialBounds, isCompact, onClose, onStartFalling }) => {
  const [animationState, setAnimationState] = useState<AnimationState>('entering');
  const [selectedMediaUrl, setSelectedMediaUrl] = useState(project.imageUrl);

  useEffect(() => {
    // When project changes, reset the main display to the cover image
    setSelectedMediaUrl(project.imageUrl);
  }, [project]);

  const handleClose = useCallback(() => {
    setAnimationState('collapsing');
  }, []);

  const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the click is on the wrapper itself (the backdrop), not the modal card, close it.
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
      willChange: 'top, left, width, height, transform, box-shadow, opacity, background-color',
      borderRadius: '0.75rem',
      backgroundColor: 'var(--surface-color)',
    };

    const initialStyle = {
      top: `${initialBounds.top}px`,
      left: `${initialBounds.left}px`,
      width: `${initialBounds.width}px`,
      height: `${initialBounds.height}px`,
      transform: 'translateY(0) scale(1)',
      boxShadow: 'none',
      opacity: 1,
    };

    const liftedStyle = {
      ...initialStyle,
      transform: 'translateY(-60px) scale(1.05)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    };

    const targetWidth = Math.min(900, window.innerWidth * 0.95);
    const imageAndContentHeight = (targetWidth / 1.7) + 450; // Increased to accommodate gallery
    const targetHeight = Math.min(imageAndContentHeight, window.innerHeight * 0.9);
    
    const expandedStyle = {
      top: `calc(50% - ${targetHeight / 2}px)`,
      left: `calc(50% - ${targetWidth / 2}px)`,
      width: `${targetWidth}px`,
      height: `${targetHeight}px`,
      transform: 'translateY(0) scale(1)',
      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    };
    
    const transitionCurve = 'cubic-bezier(0.65, 0, 0.35, 1)';
    const themeTransition = 'background-color 0.5s ease';
    const expandTransition = `top 360ms ${transitionCurve}, left 360ms ${transitionCurve}, width 360ms ${transitionCurve}, height 360ms ${transitionCurve}, transform 360ms ${transitionCurve}, box-shadow 360ms ${transitionCurve}, ${themeTransition}`;
    const liftFallTransition = `transform 288ms ${transitionCurve}, box-shadow 288ms ${transitionCurve}, opacity 288ms ${transitionCurve}, ${themeTransition}`;
    const collapseTransition = `top 360ms ${transitionCurve}, left 360ms ${transitionCurve}, width 360ms ${transitionCurve}, height 360ms ${transitionCurve}, transform 360ms ${transitionCurve}, box-shadow 360ms ${transitionCurve}, ${themeTransition}`;


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
  const isCardTextVisible = animationState === 'entering' || animationState === 'lifted';

  const imageTransitionStyle: React.CSSProperties = {
    transition: `height 360ms cubic-bezier(0.65, 0, 0.35, 1)`,
    height: isExpanded
      ? (window.innerWidth < 768 ? '16rem' : '20rem')
      : (isCompact ? '12rem' : '16rem')
  };

  const allMediaItems = useMemo(() => {
    const items: MediaItem[] = [{ type: 'image', url: project.imageUrl, thumbnailUrl: project.imageUrl }];
    if (project.media) {
      items.push(...project.media);
    }
    return items;
  }, [project.imageUrl, project.media]);
  
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
      >
        <div className="w-full h-full flex flex-col bg-surface">
          {/* Shared Image - animates height */}
          <div className="w-full overflow-hidden shrink-0" style={imageTransitionStyle}>
            <MediaDisplay src={selectedMediaUrl} alt={project.title} className="w-full h-full object-cover" />
          </div>

          {/* Cross-fading content area */}
          <div className="flex-grow relative overflow-hidden">
            {/* Card Text Content (visible only during card-like states) */}
            <div className={`absolute inset-0 transition-opacity duration-[180ms] ease-in-out pointer-events-none ${isCardTextVisible ? 'opacity-100' : 'opacity-0'}`}>
              <CardTextContent project={project} isCompact={isCompact} />
            </div>
            
            {/* Expanded Modal Content (fades in after a pause) */}
            <div className="absolute inset-0">
               <div className={`h-full overflow-y-auto transition-opacity duration-[270ms] ease-out ${isExpanded ? 'opacity-100 delay-[150ms]' : 'opacity-0'}`}>
                <div className="p-6 md:p-8">
                  <p 
                    className={`text-sm font-medium text-accent mb-1 transition-all duration-[270ms] ease-out ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: isExpanded ? '250ms' : '500ms' }}
                  >
                    {project.category}
                  </p>
                  <h2 
                    id="modal-title" 
                    className={`text-3xl md:text-4xl font-bold text-primary mb-4 transition-all duration-[270ms] ease-out ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: isExpanded ? '325ms' : '425ms' }}
                  >
                    {project.title}
                  </h2>
                  
                  <div 
                    className={`transition-all duration-[270ms] ease-out ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: isExpanded ? '400ms' : '350ms' }}
                  >
                    {project.modalContent ? (
                      <div className="space-y-4 mb-6 text-secondary leading-relaxed">
                        {project.modalContent.map((item, index) =>
                          item.type === 'text' ? <p key={index}>{item.value}</p> : null
                        )}
                      </div>
                    ) : (
                      <div className="text-secondary leading-relaxed space-y-4 mb-6">
                        <p>{project.longDescription}</p>
                      </div>
                    )}
                  </div>

                  {allMediaItems.length > 1 && (
                    <div className="mb-6">
                      <h3 
                        className={`text-lg font-semibold text-primary mb-3 transition-all duration-[270ms] ease-out ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        style={{ transitionDelay: isExpanded ? '475ms' : '275ms' }}
                      >
                        Gallery
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {allMediaItems.map((item, index) => {
                          const isSelected = selectedMediaUrl === item.url;
                          const enterDelay = 550 + index * 75;
                          const exitDelay = (allMediaItems.length - index) * 40;
                          const thumbnailUrl = item.thumbnailUrl || item.url;
                          return (
                            <button
                              key={index}
                              onClick={() => setSelectedMediaUrl(item.url)}
                              className={`
                                relative w-24 h-16 rounded-md overflow-hidden focus:outline-none 
                                transform-gpu hover:scale-105
                                ${isSelected ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface' : 'ring-1 ring-border'}
                                transition-all duration-[270ms] ease-out ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                              `}
                              style={{ transitionDelay: isExpanded ? `${enterDelay}ms` : `${exitDelay}ms` }}
                              aria-label={`View media ${index + 1}`}
                            >
                              <img src={thumbnailUrl} alt={`Gallery thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                              {item.type === 'video' && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <PlayIcon className="w-8 h-8 text-white/80" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 
                      className={`text-lg font-semibold text-primary mb-3 transition-all duration-[270ms] ease-out ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                      style={{ transitionDelay: isExpanded ? '475ms' : '275ms' }}
                    >
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => {
                        const enterDelay = 550 + i * 100;
                        const exitDelay = (project.technologies.length - 1 - i) * 50;
                        return (
                            <span 
                              key={tech} 
                              className={`bg-accent text-white dark:text-black text-xs font-semibold px-3 py-1 rounded-full transition-all duration-[270ms] ease-out ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                              style={{ transitionDelay: isExpanded ? `${enterDelay}ms` : `${exitDelay}ms` }}
                            >
                                {tech}
                            </span>
                        );
                      })}
                    </div>
                  </div>

                  <div 
                    className={`flex items-center flex-wrap gap-4 transition-all duration-[270ms] ease-out ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                     style={{ transitionDelay: isExpanded ? `${550 + project.technologies.length * 100}ms` : '150ms' }}
                  >
                    {project.modalContent?.map((item, index) => {
                      if (item.type === 'button') {
                        return (
                          <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-white dark:text-black font-semibold bg-accent px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                            <ExternalLinkIcon />
                            <span>{item.text}</span>
                          </a>
                        )
                      }
                      if (item.type === 'embed') {
                        return (
                            <a key={index} href={item.value} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-secondary font-semibold bg-background border border-border px-4 py-2 rounded-lg hover:bg-border/20 transition-colors">
                              <ExternalLinkIcon />
                              <span>{item.title}</span>
                            </a>
                          )
                      }
                      return null;
                    })}
                    
                    {!project.modalContent && project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-white dark:text-black font-semibold bg-accent px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                        <ExternalLinkIcon />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/75 transition-all duration-[270ms] ease-in-out ${isCloseButtonVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          aria-label="Close"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default ProjectModal;