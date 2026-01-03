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
      <span className={`h-2.5 w-2.5 rounded-full ${isFinished ? 'bg-green-500' : 'bg-orange-500'}`}></span>
      <span className="ml-2 text-xs font-medium text-secondary capitalize">{statusText}</span>
    </div>
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

  // Detect transition from hidden -> visible
  if (prevHidden.current && !isHidden && !isRestoring) {
      setIsRestoring(true);
      // We do NOT set isContentVisible(true) here. 
      // We want it to start false (handled by effect below) and then animate in.
  }
  prevHidden.current = isHidden;

  // Clear restoring flag after a brief moment to re-enable wrapper transitions
  useEffect(() => {
      if (isRestoring) {
          const t = setTimeout(() => setIsRestoring(false), 50);
          return () => clearTimeout(t);
      }
  }, [isRestoring]);

  // Handle content stagger animation
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isHidden) {
       setIsContentVisible(false);
    } else {
       // Run entrance animation for both initial load and restore
       // Longer delay (300ms) to ensure card is seated before text slides in
       timer = setTimeout(() => {
         setIsContentVisible(true);
       }, 300); 
    }
    return () => clearTimeout(timer);
  }, [isHidden]);


  const handleClick = () => {
    if (cardRef.current) {
      onSelect(project, cardRef.current, isCompact);
    }
  };

  const wrapperVisibilityClass = isHidden ? 'opacity-0 scale-95 pointer-events-none invisible' : 'opacity-100 scale-100 visible';
  
  // Wrapper transition: Disable if restoring to snap instantly
  const transitionClass = isRestoring ? 'transition-none duration-0' : 'transition-all duration-300 ease-in-out';
  
  // Content transition: Always active to allow staggering in
  const contentTransitionClass = 'transition-all duration-300 ease-out';
  const contentDelay = (delay: number) => isContentVisible ? `${delay}ms` : '0ms';

  if (isCompact) {
    return (
      <div 
        ref={cardRef}
        onClick={handleClick}
        className={`group relative cursor-pointer overflow-hidden rounded-lg bg-surface shadow-lg ring-1 ring-border transform-gpu card-hover-effect ${transitionClass} ${wrapperVisibilityClass}`}
      >
        <MediaDisplay 
          src={project.imageUrl} 
          alt={project.title} 
          className={`w-full h-48 object-cover ${isRestoring ? '' : 'transition-transform duration-300'}`}
        />
        <div className={`p-4 overflow-hidden`}>
          <div className={`flex justify-between items-start mb-1 ${contentTransitionClass} ${!isContentVisible ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: contentDelay(200) }}>
            <h3 className="font-bold text-md text-primary truncate pr-2">{project.title}</h3>
            {project.status && (
              <StatusIndicator status={project.status} className="mt-1" />
            )}
          </div>
          <p className={`text-sm text-secondary mb-3 ${contentTransitionClass} ${!isContentVisible ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: contentDelay(350) }}>{project.category}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 2).map((tech, i) => (
              <span key={tech} className={`bg-accent text-white dark:text-black text-[11px] font-semibold px-2 py-0.5 rounded-full ${contentTransitionClass} ${!isContentVisible ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`} style={{ transitionDelay: contentDelay(500 + i * 100) }}>{tech}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={`group cursor-pointer overflow-hidden rounded-lg bg-surface/80 shadow-lg ring-1 ring-border transform-gpu card-hover-effect ${transitionClass} ${wrapperVisibilityClass}`}
    >
      <div className="relative overflow-hidden">
        <MediaDisplay
          src={project.imageUrl}
          alt={project.title}
          className={`w-full h-64 object-cover ${isRestoring ? '' : 'transition-transform duration-500 ease-in-out'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
      </div>
      <div className={`p-6 overflow-hidden`}>
        <div className={`flex justify-between items-center mb-1 ${contentTransitionClass} ${!isContentVisible ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: contentDelay(200) }}>
          <p className="text-sm font-medium text-accent">{project.category}</p>
          {project.status && <StatusIndicator status={project.status} showText />}
        </div>
        <h3 className={`text-xl font-bold text-primary mb-2 ${contentTransitionClass} ${!isContentVisible ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: contentDelay(350) }}>{project.title}</h3>
        <div className="flex flex-wrap gap-2 mt-4">
            {project.technologies.slice(0, 4).map((tech, i) => (
              <span key={tech} className={`bg-accent text-white dark:text-black text-xs font-semibold px-3 py-1 rounded-full ${contentTransitionClass} ${!isContentVisible ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`} style={{ transitionDelay: contentDelay(500 + i * 100) }}>{tech}</span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;