import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import { GithubIcon, InstagramIcon, LinkedinIcon, MailIcon } from './Icons';

interface HeaderProps {
    className?: string;
    onContactClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#resume', label: 'Resume' },
    { href: '#projects', label: 'Major Projects' },
    { href: '#more-projects', label: 'Additional' },
    { href: '#skills', label: 'Skills' },
];

const Header: React.FC<HeaderProps> = ({ className, onContactClick }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const [linkMargins, setLinkMargins] = useState<number[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navRef = useRef<HTMLElement>(null);
    const highlighterRef = useRef<HTMLSpanElement>(null);
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const layoutMetrics = useRef<{
        sections: { top: number; height: number }[];
        links: { left: number; width: number; height: number }[];
    }>({ sections: [], links: [] });
    
    const animationFrameId = useRef<number | null>(null);
    const lastActiveIndex = useRef(-1);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const updateHighlight = () => {
        if (!navRef.current || !highlighterRef.current) {
            animationFrameId.current = null;
            return;
        }

        const { links, sections } = layoutMetrics.current;
        if (links.length < navLinks.length || sections.length < navLinks.length) {
            animationFrameId.current = null;
            return;
        }

        const scrollY = window.scrollY;
        const gradientWidth = 25;
        let activeIndex = 0;

        // Special case: When at the very top, lock to "Home"
        if (scrollY < 20) {
            const homeLink = links[0];
            if (homeLink?.width > 0) {
                highlighterRef.current.style.left = `${homeLink.left}px`;
                highlighterRef.current.style.width = `${homeLink.width}px`;
                highlighterRef.current.style.height = `${homeLink.height}px`;
                highlighterRef.current.style.opacity = '1';
                highlighterRef.current.style.top = `${(navRef.current.offsetHeight - homeLink.height) / 2}px`;
                highlighterRef.current.style.maskImage = `linear-gradient(to right, black, black calc(100% - ${gradientWidth}px), transparent)`;
                highlighterRef.current.style.setProperty('--before-opacity', '1');
                highlighterRef.current.style.setProperty('--after-opacity', '0');
                activeIndex = 0;
            }
        } else {
            const triggerPointY = scrollY;
            let currentIndex = 0;
            const effectiveTriggerPoint = triggerPointY + 1;
            for (let i = 0; i < sections.length - 1; i++) {
                if (effectiveTriggerPoint >= sections[i].top && effectiveTriggerPoint < sections[i + 1].top) {
                    currentIndex = i;
                    break;
                }
            }
            if (effectiveTriggerPoint >= sections[sections.length - 1].top) {
                currentIndex = sections.length - 1;
            }
            
            const currentSection = sections[currentIndex];
            let targetPosition;

            if (currentIndex >= sections.length - 1) {
                targetPosition = navLinks.length - 1;
            } else {
                const nextSection = sections[currentIndex + 1];
                const sectionTravelDistance = nextSection.top - currentSection.top;
                const progressInSection = sectionTravelDistance > 0
                    ? (triggerPointY - currentSection.top) / sectionTravelDistance
                    : 0;
                targetPosition = currentIndex + Math.max(0, Math.min(1, progressInSection));
            }
            
            const currentLinkIndex = Math.floor(targetPosition);
            const nextLinkIndex = Math.min(currentLinkIndex + 1, navLinks.length - 1);
            const segmentProgress = targetPosition - currentLinkIndex;

            const currentLink = links[currentLinkIndex];
            const nextLink = links[nextLinkIndex];

            if (currentLink && nextLink) {
                const newLeft = currentLink.left + (nextLink.left - currentLink.left) * segmentProgress;
                const newWidth = currentLink.width + (nextLink.width - currentLink.width) * segmentProgress;
                const newHeight = currentLink.height;

                activeIndex = segmentProgress > 0.5 ? nextLinkIndex : currentLinkIndex;

                const totalLinkSegments = navLinks.length - 1;
                const leftOpacity = Math.max(0, 1 - targetPosition);
                const rightOpacity = Math.max(0, targetPosition - (totalLinkSegments - 1));

                highlighterRef.current.style.left = `${newLeft}px`;
                highlighterRef.current.style.width = `${newWidth}px`;
                highlighterRef.current.style.height = `${newHeight}px`;
                highlighterRef.current.style.opacity = '1';
                highlighterRef.current.style.top = `${(navRef.current.offsetHeight - newHeight) / 2}px`;
                highlighterRef.current.style.maskImage = `linear-gradient(to right, rgba(0,0,0, ${leftOpacity}), black ${gradientWidth}px, black calc(100% - ${gradientWidth}px), rgba(0,0,0, ${rightOpacity}))`;
                highlighterRef.current.style.setProperty('--before-opacity', String(leftOpacity));
                highlighterRef.current.style.setProperty('--after-opacity', String(rightOpacity));
            }
        }

        if (activeIndex !== lastActiveIndex.current) {
            setActiveSectionIndex(activeIndex);
            lastActiveIndex.current = activeIndex;
        }
        
        animationFrameId.current = null;
    };

    useEffect(() => {
        const calculateGeometries = () => {
            const headerHeight = 64; 
            const sections = navLinks.map(link => {
                const elem = document.getElementById(link.href.substring(1));
                if (!elem) return { top: 0, height: 0 };
                return { top: elem.offsetTop - headerHeight, height: elem.offsetHeight };
            });

            layoutMetrics.current.sections = sections;

            const heights = sections.map(s => s.height).filter(h => h > 0);
            if (heights.length < 2) {
                setLinkMargins(navLinks.map(() => 8)); 
                return;
            }

            const minHeight = Math.min(...heights);
            const maxHeight = Math.max(...heights);
            const minMargin = 8;
            const maxMargin = 32; 

            const margins = sections.map((section, index) => {
                if (index === 0) return 0; 
                
                const prevSectionHeight = sections[index - 1].height;
                if (prevSectionHeight <= 0 || maxHeight === minHeight) {
                    return minMargin;
                }

                const normalizedHeight = (prevSectionHeight - minHeight) / (maxHeight - minHeight);
                return minMargin + normalizedHeight * (maxMargin - minMargin);
            });

            setLinkMargins(margins);
        };

        const handleLoad = () => setTimeout(calculateGeometries, 500);
        window.addEventListener('resize', calculateGeometries);
        window.addEventListener('load', handleLoad);
        window.addEventListener('layout-changed', calculateGeometries);
        handleLoad(); 

        return () => {
            window.removeEventListener('resize', calculateGeometries);
            window.removeEventListener('load', handleLoad);
            window.removeEventListener('layout-changed', calculateGeometries);
        };
    }, []);

    useLayoutEffect(() => {
        if (linkMargins.length === 0) return;

        const measureLinks = () => {
            const links = linkRefs.current.map(el => {
                if (!el) return { left: 0, width: 0, height: 0 };
                return { left: el.offsetLeft, width: el.offsetWidth, height: el.offsetHeight };
            });

            if (links.some(l => l.width > 0)) {
                layoutMetrics.current.links = links;
                if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = requestAnimationFrame(updateHighlight);
            }
        };
        
        measureLinks();
    }, [linkMargins]);

    useEffect(() => {
        const handleScroll = () => {
            if (animationFrameId.current === null) {
                animationFrameId.current = requestAnimationFrame(updateHighlight);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const element = document.getElementById(href.substring(1));
        if (!element) return;

        const headerHeight = 64;
        const targetScrollY = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
        });
        
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header className={`sticky top-0 z-40 w-full backdrop-blur transition-all duration-500 ${isScrolled ? 'bg-background/80 border-b border-border' : 'bg-transparent'} ${className || ''}`}>
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-1 flex justify-start">
                            <div className="flex items-center gap-4">
                                <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="text-2xl font-bold text-primary transition-colors hover:text-accent">AS</a>
                                <ThemeSwitcher />
                            </div>
                        </div>

                        <nav ref={navRef} className="hidden md:flex items-center justify-center relative bg-surface/30 dark:bg-surface/20 backdrop-blur border border-black/5 dark:border-white/10 rounded-lg p-1">
                            <span
                                ref={highlighterRef}
                                className="absolute nav-highlighter rounded-lg"
                                style={{ opacity: 0 }}
                            />
                            {navLinks.map((link, index) => {
                                const isActive = activeSectionIndex === index;
                                const marginStyle = linkMargins.length > 0 && linkMargins[index] > 0
                                    ? { marginLeft: `${linkMargins[index]}px` }
                                    : {};
                                return (
                                    <a
                                        ref={el => { linkRefs.current[index] = el; }}
                                        key={link.href}
                                        href={link.href}
                                        onClick={(e) => handleNavClick(e, link.href)}
                                        className="relative z-10 font-semibold px-3 py-1.5 rounded-lg text-sm transition-colors duration-300"
                                        style={marginStyle}
                                    >
                                        <span className={`transition-colors duration-500 ${isActive ? 'nav-highlighter-text' : 'text-primary'}`}>
                                            {link.label}
                                        </span>
                                    </a>
                                );
                            })}
                        </nav>

                        <div className="flex-1 flex justify-end">
                            <div className="hidden md:flex items-center space-x-4">
                                <button 
                                    onClick={onContactClick} 
                                    aria-label="Contact" 
                                    className="text-primary font-bold hover:text-accent transition-colors duration-300"
                                >
                                    Contact
                                </button>
                                
                                <div className="h-4 w-px bg-border"></div>

                                <button 
                                    onClick={onContactClick} 
                                    aria-label="Email" 
                                    className="text-[#EA4335] hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-110"
                                >
                                    <MailIcon />
                                </button>
                                <a href="https://github.com/AadhavSivakumar" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-primary hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-110"><GithubIcon /></a>
                                <a href="https://www.linkedin.com/in/aadhav-sivakumar/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[#0A66C2] hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-110"><LinkedinIcon /></a>
                                <a href="https://www.instagram.com/aadhav_s/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#E4405F] hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-110"><InstagramIcon /></a>
                            </div>
                             <div className="md:hidden flex items-center space-x-4">
                                <button onClick={onContactClick} aria-label="Contact" className="text-[#EA4335] hover:text-accent transition-colors"><MailIcon className="h-5 w-5"/></button>
                                <a href="https://github.com/AadhavSivakumar" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-primary hover:text-accent transition-colors"><GithubIcon className="h-5 w-5"/></a>
                                <a href="https://www.linkedin.com/in/aadhav-sivakumar/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[#0A66C2] hover:text-accent transition-colors"><LinkedinIcon className="h-5 w-5"/></a>
                                <a href="https://www.instagram.com/aadhav_s/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#E4405F] hover:text-accent transition-colors"><InstagramIcon className="h-5 w-5"/></a>
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="relative z-50 w-8 h-8 flex flex-col justify-center items-center"
                                    aria-label="Toggle Menu"
                                >
                                    <span className={`block h-0.5 w-[18px] bg-primary rounded-full transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`}></span>
                                    <span className={`block h-0.5 w-[18px] bg-primary rounded-full transition duration-300 ease-in-out my-1.5 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                                    <span className={`block h-0.5 w-[18px] bg-primary rounded-full transform transition duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`}></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Panel */}
            <div className={`fixed inset-0 z-30 bg-background/95 backdrop-blur-md transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <nav className="flex flex-col items-center justify-center h-full gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className="text-3xl font-bold text-primary hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-110"
                        >
                            {link.label}
                        </a>
                    ))}
                    <button 
                        onClick={(e) => { onContactClick(e); setIsMobileMenuOpen(false); }}
                        className="text-3xl font-bold text-accent hover:text-primary transition-all duration-300 ease-in-out transform hover:scale-110"
                    >
                        Get In Touch
                    </button>
                </nav>
            </div>
        </>
    );
};

export default Header;