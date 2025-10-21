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

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (!isHidden) {
      // Small delay to allow the card itself to start its transition before content animates in
      timer = setTimeout(() => {
        setIsContentVisible(true);
      }, 100); 
    } else {
      setIsContentVisible(false);
    }
    return () => clearTimeout(timer);
  }, [isHidden]);

  const handleClick = () => {
    if (cardRef.current) {
      onSelect(project, cardRef.current, isCompact);
    }
  };

  const wrapperVisibilityClass = isHidden ? 'opacity-0 scale-95 pointer-events-none invisible' : 'opacity-100 scale-100 visible';


  if (isCompact) {
    return (
      <div 
        ref={cardRef}
        onClick={handleClick}
        className={`group relative cursor-pointer overflow-hidden rounded-lg bg-surface shadow-lg transition-all duration-300 ease-in-out ring-1 ring-border transform-gpu card-hover-effect ${wrapperVisibilityClass}`}
      >
        <MediaDisplay 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-48 object-cover transition-transform duration-300"
        />
        <div className={`p-4 overflow-hidden`}>
          <div className={`flex justify-between items-start mb-1 transition-all duration-300 ease-out ${!isContentVisible ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: isContentVisible ? '100ms' : '0ms' }}>
            <h3 className="font-bold text-md text-primary truncate pr-2">{project.title}</h3>
            {project.status && (
              <StatusIndicator status={project.status} className="mt-1" />
            )}
          </div>
          <p className={`text-sm text-secondary mb-3 transition-all duration-300 ease-out ${!isContentVisible ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: isContentVisible ? '150ms' : '0ms' }}>{project.category}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 2).map((tech, i) => (
              <span key={tech} className={`bg-accent text-white dark:text-black text-[11px] font-semibold px-2 py-0.5 rounded-full transition-all duration-300 ease-out ${!isContentVisible ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`} style={{ transitionDelay: isContentVisible ? `${200 + i * 50}ms` : '0ms' }}>{tech}</span>
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
      className={`group cursor-pointer overflow-hidden rounded-lg bg-surface/80 shadow-lg transition-all duration-300 ease-in-out ring-1 ring-border transform-gpu card-hover-effect ${wrapperVisibilityClass}`}
    >
      <div className="relative overflow-hidden">
        <MediaDisplay
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-64 object-cover transition-transform duration-500 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
      </div>
      <div className={`p-6 overflow-hidden`}>
        <div className={`flex justify-between items-center mb-1 transition-all duration-300 ease-out ${!isContentVisible ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: isContentVisible ? '100ms' : '0ms' }}>
          <p className="text-sm font-medium text-accent">{project.category}</p>
          {project.status && <StatusIndicator status={project.status} showText />}
        </div>
        <h3 className={`text-xl font-bold text-primary mb-2 transition-all duration-300 ease-out ${!isContentVisible ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: isContentVisible ? '150ms' : '0ms' }}>{project.title}</h3>
        <div className="flex flex-wrap gap-2 mt-4">
            {project.technologies.slice(0, 4).map((tech, i) => (
              <span key={tech} className={`bg-accent text-white dark:text-black text-xs font-semibold px-3 py-1 rounded-full transition-all duration-300 ease-out ${!isContentVisible ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`} style={{ transitionDelay: isContentVisible ? `${200 + i * 75}ms` : '0ms' }}>{tech}</span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;