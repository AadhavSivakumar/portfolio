import React, { useRef, useState, useEffect } from 'react';
import type { Project } from '../types';

const MediaDisplay: React.FC<{ src: string; alt: string; className: string }> = ({ src, alt, className }) => {
  const isVideo = src.endsWith('.mp4') || src.endsWith('.webm');
  if (isVideo) {
    return <video src={src} className={className} autoPlay loop muted playsInline />;
  }
  return <img src={src} alt={alt} className={className} />;
};

export const StatusIndicator: React.FC<{
  status: 'in-progress' | 'finished';
  showText?: boolean;
  className?: string;
}> = ({ status, showText = false, className = '' }) => {
  const isFinished = status === 'finished';
  const statusText = status.replace('-', ' ');
  const titleText = statusText.charAt(0).toUpperCase() + statusText.slice(1);

  if (!showText) {
    return (
      <span
        className={`flex-shrink-0 h-2.5 w-2.5 rounded-full ${isFinished ? 'bg-green-500' : 'bg-orange-500'} ${className}`}
        title={titleText}
      />
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <span className={`h-3 w-3 rounded-full ${isFinished ? 'bg-green-500' : 'bg-orange-500'}`}></span>
      <span className="ml-2 text-sm md:text-lg font-semibold text-secondary capitalize">{statusText}</span>
    </div>
  );
};

const SplashEffect: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <>
      <style>{`
        @keyframes ripple-effect {
          0% { box-shadow: 0 0 0 0px rgba(var(--accent-color-rgb), 0.6); opacity: 1; }
          100% { box-shadow: 0 0 0 30px rgba(var(--accent-color-rgb), 0); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple-effect 0.6s cubic-bezier(0, 0, 0.2, 1) forwards;
        }
      `}</style>
      <div className="absolute inset-0 rounded-lg animate-ripple z-0 pointer-events-none" />
    </>
  );
};

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project, element: HTMLDivElement, isCompact: boolean) => void;
  isCompact?: boolean;
  isHidden?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, isCompact = false, isHidden = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Track visibility state internally to allow for delayed hiding (seamless transition)
  const [internalHidden, setInternalHidden] = useState(isHidden);
  const [isContentVisible, setIsContentVisible] = useState(!isHidden);
  
  // Track if we are restoring from hidden state (modal close)
  const prevHidden = useRef(isHidden);
  const [isRestoring, setIsRestoring] = useState(false);
  const [triggerSplash, setTriggerSplash] = useState(false);

  // Logic to delay hiding:
  // When isHidden becomes true (Modal Opens), we keep internalHidden false for a short duration (300ms).
  // This keeps the card visible underneath the modal while the modal initializes/loads media.
  // When isHidden becomes false (Modal Closes), we set internalHidden false immediately to show the card.
  useEffect(() => {
    if (isHidden) {
        const timer = setTimeout(() => setInternalHidden(true), 300);
        return () => clearTimeout(timer);
    } else {
        setInternalHidden(false);
    }
  }, [isHidden]);

  // Detect transition from hidden -> visible (Restoring)
  if (prevHidden.current && !isHidden && !isRestoring) {
      setIsRestoring(true);
      setTriggerSplash(true);
  }
  prevHidden.current = isHidden;

  // Clear restoring flag after a brief moment to re-enable wrapper transitions
  useEffect(() => {
      if (isRestoring) {
          const t = setTimeout(() => setIsRestoring(false), 50);
          return () => clearTimeout(t);
      }
  }, [isRestoring]);

  // Handle content stagger animation on restore
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isHidden) {
       setIsContentVisible(false);
    } else {
       timer = setTimeout(() => {
         setIsContentVisible(true);
       }, 100); 
    }
    return () => clearTimeout(timer);
  }, [isHidden]);


  const handleClick = () => {
    setTriggerSplash(true);
    if (cardRef.current) {
      onSelect(project, cardRef.current, isCompact);
    }
  };

  const wrapperVisibilityClass = isHidden ? 'pointer-events-none' : '';
  const transitionClass = isRestoring ? 'transition-none duration-0' : 'transition-all duration-400 ease-in-out';
  
  // Stagger effect for text elements when reappearing
  const contentTransitionClass = `transition-all ${isHidden ? 'duration-0' : 'duration-500'} ease-out`;
  const contentDelay = (delay: number) => isRestoring ? `${delay}ms` : (isContentVisible ? `${delay}ms` : '0ms');

  // Critical fix: When restoring, use duration-0 to make the card appear instantly.
  // When hiding (via internalHidden), fade out.
  const containerOpacityClass = internalHidden 
    ? 'opacity-0 transition-opacity duration-300 ease-out' 
    : `opacity-100 transition-opacity ${isRestoring ? 'duration-0' : 'duration-500'} ease-out`;

  const imageOpacityClass = internalHidden 
    ? 'opacity-0 transition-opacity duration-0' 
    : 'opacity-100 transition-opacity duration-500';

  if (isCompact) {
    return (
      <div 
        ref={cardRef}
        onClick={handleClick}
        className={`group relative cursor-pointer rounded-lg transform-gpu card-hover-effect w-full h-20 md:h-auto md:aspect-square ${transitionClass} ${wrapperVisibilityClass}`}
      >
        {triggerSplash && <SplashEffect onComplete={() => setTriggerSplash(false)} />}
        
        <div className={`absolute inset-0 overflow-hidden rounded-lg bg-surface shadow-lg ring-1 ring-border flex flex-row md:flex-col ${containerOpacityClass}`}>
            <div className="relative shrink-0 w-[35%] h-full md:w-full md:h-[70%] overflow-hidden">
                <MediaDisplay 
                src={project.imageUrl} 
                alt={project.title} 
                className={`w-full h-full object-cover ${isRestoring ? '' : 'transition-transform duration-300 group-hover:scale-105'} ${imageOpacityClass}`}
                />
            </div>
            <div className={`px-3 pt-1 pb-1.5 md:px-4 md:pt-1.5 md:pb-4 overflow-hidden flex flex-col flex-grow`}>
              <div className={`flex justify-between items-center mb-0.5 ${contentTransitionClass} ${!isContentVisible ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: contentDelay(0) }}>
                  <p className="text-[10px] md:text-xs font-bold text-secondary truncate pr-1">{project.category}</p>
                  {project.status && (
                    <StatusIndicator status={project.status} />
                  )}
              </div>
              <h3 className={`font-extrabold text-sm md:text-md text-primary truncate leading-tight ${contentTransitionClass} ${!isContentVisible ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: contentDelay(50) }}>{project.title}</h3>
              
              <div className="mt-auto flex flex-wrap gap-1 md:gap-1.5">
                {project.technologies.slice(0, 3).map((tech, i) => (
                  <span key={tech} className={`bg-accent text-white dark:text-black text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm ${contentTransitionClass} ${!isContentVisible ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`} style={{ transitionDelay: contentDelay(100 + i * 30) }}>{tech}</span>
                ))}
                {project.technologies.length > 3 && (
                    <span className={`text-[10px] text-secondary self-center px-1 ${contentTransitionClass} ${!isContentVisible ? 'opacity-0' : 'opacity-100'}`}>+</span>
                )}
              </div>
            </div>
        </div>
      </div>
    );
  }

  const mediaHeightClass = project.id === 'about-me' ? 'md:h-[60%]' : 'md:h-[70%]';

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={`group relative cursor-pointer rounded-lg transform-gpu card-hover-effect w-full h-28 md:h-auto md:aspect-square ${transitionClass} ${wrapperVisibilityClass}`}
    >
      {triggerSplash && <SplashEffect onComplete={() => setTriggerSplash(false)} />}
      
      <div className={`absolute inset-0 overflow-hidden rounded-lg bg-surface shadow-lg ring-1 ring-border flex flex-row md:flex-col ${containerOpacityClass}`}>
          <div className={`relative overflow-hidden shrink-0 w-[35%] md:w-full ${mediaHeightClass}`}>
            <MediaDisplay
              src={project.imageUrl}
              alt={project.title}
              className={`w-full h-full object-cover ${isRestoring ? '' : 'transition-transform duration-500 ease-in-out group-hover:scale-105'} ${imageOpacityClass}`}
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 md:block hidden ${imageOpacityClass}`}></div>
          </div>
          <div className={`px-3.5 pt-1.5 pb-2 md:px-5 md:pt-2 md:pb-4 overflow-hidden flex flex-col flex-grow`}>
            <div className={`flex justify-between items-center mb-0.5 ${contentTransitionClass} ${!isContentVisible ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: contentDelay(0) }}>
              <p className="text-xs md:text-sm font-bold text-secondary">{project.category}</p>
              {project.status && (
                <>
                  <StatusIndicator status={project.status} showText={false} className="md:hidden" />
                  <StatusIndicator status={project.status} showText={true} className="hidden md:flex" />
                </>
              )}
            </div>
            <h3 className={`text-base md:text-xl font-extrabold text-primary mb-0.5 line-clamp-2 leading-tight ${contentTransitionClass} ${!isContentVisible ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: contentDelay(50) }}>{project.title}</h3>
            
            <div className="mt-auto pt-1 flex flex-wrap gap-1.5 md:gap-2">
                {project.technologies.slice(0, 4).map((tech, i) => (
                  <span key={tech} className={`bg-accent text-white dark:text-black text-[10px] md:text-xs font-semibold px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-sm ${contentTransitionClass} ${!isContentVisible ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`} style={{ transitionDelay: contentDelay(100 + i * 30) }}>{tech}</span>
                ))}
                 {project.technologies.length > 4 && (
                    <span className={`text-[10px] text-secondary self-center px-1 ${contentTransitionClass} ${!isContentVisible ? 'opacity-0' : 'opacity-100'}`}>...</span>
                )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default ProjectCard;