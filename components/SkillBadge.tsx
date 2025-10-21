import React from 'react';
import type { Skill } from '../types';

interface SkillBadgeProps {
  skill: Skill;
  isTransitioning: boolean;
  transitionDelay: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, isTransitioning, transitionDelay }) => {
  return (
    <div
      className={`
        bg-surface p-6 rounded-lg shadow-md h-full border border-border
        transform-gpu transition-all duration-500 ease-in-out
        hover:border-accent hover:shadow-2xl hover:shadow-accent/30 hover:-translate-y-2 hover:scale-105
        ${isTransitioning
          ? 'opacity-0 scale-95 translate-y-4'
          : 'opacity-100 scale-100 translate-y-0'
        }
      `}
      style={{
        transitionDelay: transitionDelay,
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <img
          src={skill.imageUrl}
          alt={`${skill.name} logo`}
          className="w-10 h-10 object-contain"
        />
        <h3 className="text-lg font-bold text-primary">{skill.name}</h3>
      </div>
      <p className="text-secondary text-sm leading-relaxed">{skill.description}</p>
    </div>
  );
};

export default SkillBadge;