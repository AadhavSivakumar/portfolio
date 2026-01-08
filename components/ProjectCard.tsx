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
  const [isContentVisible, setIsContentVisible] = useState(!isHidden);
  
  // Track if we are restoring from hidden state (modal close)
  const prevHidden = useRef(isHidden);
  const [isRestoring, setIsRestoring] = useState(false);
  const [triggerSplash, setTriggerSplash] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  // Detect transition from hidden -> visible
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
    setIsFlashing(true);
    // Slight delay or immediate - let the click event bubble up
    if (cardRef.current) {
      onSelect(project, cardRef.current, isCompact);
    }
    setTimeout(() => setIsFlashing(false), 300);
  };

  const wrapperVisibilityClass = isHidden ? 'pointer-events-none' : '';
  const transitionClass = isRestoring ? 'transition-none duration-0' : 'transition-all duration-400 ease-in-out';
  const flashClass = isFlashing ? 'card-flash scale-95' : '';
  
  // Stagger effect for text elements when reappearing
  const contentTransitionClass = `transition-all ${isHidden ? 'duration-0' : 'duration-500'} ease-out`;
  const contentDelay = (delay: number) => isRestoring ? `${delay}ms` : (isContentVisible ? `${delay}ms` : '0ms');

  const containerOpacityClass = isHidden 
    ? 'opacity-0 transition-opacity duration-300 ease-out' 
    : 'opacity-100 transition-opacity duration-500 ease-out';

  const imageOpacityClass = isHidden 
    ? 'opacity-0 transition-opacity duration-0' 
    : 'opacity-100 transition-opacity duration-500';

  if (isCompact) {
    return (
      <div 
        ref={cardRef}
        onClick={handleClick}
        className={`group relative cursor-pointer rounded-lg transform-gpu card-hover-effect h-36 md:h-auto md:aspect-square ${transitionClass} ${wrapperVisibilityClass} ${flashClass}`}
      >
        {triggerSplash && <SplashEffect onComplete={() => setTriggerSplash(false)} />}
        
        <div className={`relative overflow-hidden rounded-lg bg-surface shadow-lg ring-1 ring-border h-full flex flex-row md:flex-col ${containerOpacityClass}`}>
            <div className="relative shrink-0 w-[35%] h-full md:w-full md:h-1/2 overflow-hidden">
                <MediaDisplay 
                src={project.imageUrl} 
                alt={project.title} 
                className={`w-full h-full object-cover ${isRestoring ? '' : 'transition-transform duration-300 group-hover:scale-105'} ${imageOpacityClass}`}
                />
            </div>
            <div className={`p-3 md:p-4 overflow-hidden flex flex-col flex-grow`}>
              <div className={`flex justify-between items-start mb-1 ${contentTransitionClass} ${!isContentVisible ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: contentDelay(0) }}>
                <h3 className="font-extrabold text-sm md:text-md text-primary truncate pr-2 leading-tight">{project.title}</h3>
                {project.status && (
                  <StatusIndicator status={project.status} className="mt-1" />
                )}
              </div>
              <p className={`text-xs md:text-sm text-secondary mb-2 ${contentTransitionClass} ${!isContentVisible ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: contentDelay(50) }}>{project.category}</p>
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

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={`group relative cursor-pointer rounded-lg transform-gpu card-hover-effect h-36 md:h-auto md:aspect-square ${transitionClass} ${wrapperVisibilityClass} ${flashClass}`}
    >
      {triggerSplash && <SplashEffect onComplete={() => setTriggerSplash(false)} />}
      
      <div className={`relative overflow-hidden rounded-lg bg-surface shadow-lg ring-1 ring-border h-full flex flex-row md:flex-col ${containerOpacityClass}`}>
          <div className="relative overflow-hidden shrink-0 w-[35%] h-full md:w-full md:h-[55%]">
            <MediaDisplay
              src={project.imageUrl}
              alt={project.title}
              className={`w-full h-full object-cover ${isRestoring ? '' : 'transition-transform duration-500 ease-in-out group-hover:scale-105'} ${imageOpacityClass}`}
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 md:block hidden ${imageOpacityClass}`}></div>
          </div>
          <div className={`p-4 md:p-6 overflow-hidden flex flex-col flex-grow`}>
            <div className={`flex justify-between items-center mb-1 ${contentTransitionClass} ${!isContentVisible ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: contentDelay(0) }}>
              <p className="text-xs md:text-sm font-bold text-accent">{project.category}</p>
              {project.status && (
                <>
                  <StatusIndicator status={project.status} showText={false} className="md:hidden" />
                  <StatusIndicator status={project.status} showText={true} className="hidden md:flex" />
                </>
              )}
            </div>
            <h3 className={`text-lg md:text-xl font-extrabold text-primary mb-2 line-clamp-2 leading-tight ${contentTransitionClass} ${!isContentVisible ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: contentDelay(50) }}>{project.title}</h3>
            
            <div className="mt-auto flex flex-wrap gap-1.5 md:gap-2">
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