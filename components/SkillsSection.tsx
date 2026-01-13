import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { SKILL_GROUPS } from '../constants';
import { CycleIcon, PauseIcon } from './Icons';
import SkillBadge from './SkillBadge';

const SkillsSection: React.FC = () => {
    const [activeGroupId, setActiveGroupId] = useState<string>(SKILL_GROUPS[0].id);
    const [displayedGroupId, setDisplayedGroupId] = useState<string>(SKILL_GROUPS[0].id);
    const [isCycling, setIsCycling] = useState<boolean>(true);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(true); // Start as true for initial load animation
    const contentChangeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const activeGroup = useMemo(
        () => SKILL_GROUPS.find(g => g.id === displayedGroupId) || SKILL_GROUPS[0],
        [displayedGroupId]
    );

    const maxSkills = useMemo(() => {
        return SKILL_GROUPS.reduce((max, group) => Math.max(max, group.items.length), 0);
    }, []);

    // This effect handles the "in" animation phase.
    useEffect(() => {
        const frameTimer = setTimeout(() => {
            setIsTransitioning(false);
        }, 50);

        return () => clearTimeout(frameTimer);
    }, [displayedGroupId]);
    
    const handleGroupChange = useCallback((newGroupId: string) => {
        if (contentChangeTimeoutRef.current) {
            clearTimeout(contentChangeTimeoutRef.current);
        }
        
        setActiveGroupId(newGroupId); // Update button style immediately
        setIsTransitioning(true);     // Start fade-out of current items

        contentChangeTimeoutRef.current = setTimeout(() => {
            setDisplayedGroupId(newGroupId); // Swap content after fade-out
        }, 300); // Wait for fade-out to progress before swapping
    }, []);

    // Auto-cycling effect
    useEffect(() => {
        if (!isCycling) return;

        const cycleTimer = setInterval(() => {
            const currentIndex = SKILL_GROUPS.findIndex(g => g.id === activeGroupId);
            const nextIndex = (currentIndex + 1) % SKILL_GROUPS.length;
            handleGroupChange(SKILL_GROUPS[nextIndex].id);
        }, 5000);

        return () => clearInterval(cycleTimer);
    }, [isCycling, activeGroupId, handleGroupChange]);

    const toggleCycling = () => {
        setIsCycling(prev => !prev);
    };

    const handleManualGroupClick = (groupId: string) => {
        if (groupId === activeGroupId) return;
        
        setIsCycling(false); // Stop cycling on manual selection
        handleGroupChange(groupId);
    };

    return (
        <section className="py-12 sm:py-20">
            <div className="text-center mb-12">
                <div className="flex justify-center items-center gap-4">
                    <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                        <span className="relative inline-block">
                            Skills & Expertise
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-accent rounded-full"></span>
                        </span>
                    </h2>
                    <button
                        onClick={toggleCycling}
                        className={`p-2 rounded-full transition-all duration-300 ${isCycling ? 'bg-accent/20 text-accent ring-2 ring-accent' : 'bg-surface text-secondary hover:bg-border/60'}`}
                        aria-label={isCycling ? "Stop cycling skills" : "Cycle through skills"}
                        title={isCycling ? "Stop cycling skills" : "Cycle through skills"}
                    >
                        {isCycling ? <PauseIcon /> : <CycleIcon />}
                    </button>
                </div>
                <p className="mt-4 text-md text-secondary">Select any category to learn more</p>
            </div>


            <div className="flex justify-center flex-wrap gap-1 md:gap-2 mb-12">
                {SKILL_GROUPS.map(group => (
                    <button
                        key={group.id}
                        onClick={() => handleManualGroupClick(group.id)}
                        className={`
                            flex items-center gap-2 px-2 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out h-auto min-h-[3rem]
                            ${activeGroupId === group.id
                                ? 'bg-accent text-white dark:text-black shadow-lg scale-105'
                                : 'bg-surface text-secondary hover:bg-border hover:text-primary'
                            }
                        `}
                    >
                        <img src={group.cardImageUrl} alt="" className="w-5 h-5 shrink-0" />
                        <span className="whitespace-pre-line text-left leading-tight">{group.title}</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 auto-rows-fr">
                {activeGroup.items.map((skill, index) => (
                    <SkillBadge
                        key={`${displayedGroupId}-${skill.name}`}
                        skill={skill}
                        isTransitioning={isTransitioning}
                        transitionDelay={`${index * 38}ms`}
                    />
                ))}
                {/* Render placeholders to maintain constant grid height */}
                {Array.from({ length: maxSkills - activeGroup.items.length }).map((_, index) => (
                    <div key={`placeholder-${index}`} aria-hidden="true" />
                ))}
            </div>
        </section>
    );
};

export default SkillsSection;