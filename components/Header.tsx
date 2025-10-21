import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import { GithubIcon, LinkedinIcon, MailIcon } from './Icons';

const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#resume', label: 'Resume' },
    { href: '#projects', label: 'Major Projects' },
    { href: '#more-projects', label: 'Additional' },
    { href: '#skills', label: 'Skills' },
];

interface HeaderProps {
    onContactClick: (element: HTMLElement) => void;
    isContactModalOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onContactClick, isContactModalOpen }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({ opacity: 0 });
    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const [linkMargins, setLinkMargins] = useState<number[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navRef = useRef<HTMLElement>(null);
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const contactButtonRef = useRef<HTMLButtonElement>(null);
    const layoutMetrics = useRef<{
        sections: { top: number; height: number }[];
        links: { left: number; width: number; height: number }[];
    }>({ sections: [], links: [] });
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { // Cleanup function
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);


    const updateHighlight = () => {
        if (!navRef.current) {
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

        // Special case: When at the very top, lock to "Home"
        if (scrollY < 20) {
            const homeLink = links[0];
            if (homeLink?.width > 0 && navRef.current) {
                // FIX: Object literal may only specify known properties, and '--before-opacity' does not exist in type 'SetStateAction<CSSProperties>'.
                // By assigning the style object to a variable of type React.CSSProperties,
                // we can bypass TypeScript's excess property checking for custom CSS properties.
                // FIX: Cast style object to React.CSSProperties to allow for custom CSS properties.
                const style = {
                    left: `${homeLink.left}px`,
                    width: `${homeLink.width}px`,
                    height: `${homeLink.height}px`,
                    opacity: 1,
                    top: `${(navRef.current.offsetHeight - homeLink.height) / 2}px`,
                    maskImage: `linear-gradient(to right, black, black calc(100% - ${gradientWidth}px), transparent)`,
                    '--before-opacity': 1,
                    '--after-opacity': 0,
                } as React.CSSProperties;
                setHighlightStyle(style);
                setActiveSectionIndex(0);
            }
            animationFrameId.current = null;
            return;
        }

        // Determine the active point on the screen for section detection. Using the
        // exact scrollY ensures that when a section is scrolled to the top, the progress is 0.
        const triggerPointY = scrollY;

        // Find which section the trigger point is in.
        let currentIndex = 0;
        // The section tops are defined relative to scrollY, so we add a small buffer to the trigger point
        // to ensure the correct section is selected when it's perfectly aligned at the top.
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
            // If it's the last section or beyond, lock to the last link.
            targetPosition = navLinks.length - 1;
        } else {
            const nextSection = sections[currentIndex + 1];
            // Calculate progress as a fraction of the distance between the start of the current section and the start of the next.
            const sectionTravelDistance = nextSection.top - currentSection.top;
            const progressInSection = sectionTravelDistance > 0
                ? (triggerPointY - currentSection.top) / sectionTravelDistance
                : 0;
            
            targetPosition = currentIndex + Math.max(0, Math.min(1, progressInSection));
        }
        
        // Use the calculated targetPosition to interpolate the highlight's style.
        const currentLinkIndex = Math.floor(targetPosition);
        const nextLinkIndex = Math.min(currentLinkIndex + 1, navLinks.length - 1);
        const segmentProgress = targetPosition - currentLinkIndex;

        const currentLink = links[currentLinkIndex];
        const nextLink = links[nextLinkIndex];

        if (!currentLink || !nextLink) {
            animationFrameId.current = null;
            return;
        }
        
        const newLeft = currentLink.left + (nextLink.left - currentLink.left) * segmentProgress;
        const newWidth = currentLink.width + (nextLink.width - currentLink.width) * segmentProgress;
        const newHeight = currentLink.height;

        const activeIndex = segmentProgress > 0.5 ? nextLinkIndex : currentLinkIndex;
        setActiveSectionIndex(activeIndex);

        const totalLinkSegments = navLinks.length - 1;
        const leftOpacity = Math.max(0, 1 - targetPosition);
        const rightOpacity = Math.max(0, targetPosition - (totalLinkSegments - 1));

        // FIX: Object literal may only specify known properties, and '--before-opacity' does not exist in type 'SetStateAction<CSSProperties>'.
        // By assigning the style object to a variable of type React.CSSProperties,
        // we can bypass TypeScript's excess property checking for custom CSS properties.
        // FIX: Cast style object to React.CSSProperties to allow for custom CSS properties.
        const style = {
            left: `${newLeft}px`,
            width: `${newWidth}px`,
            height: `${newHeight}px`,
            opacity: 1,
            top: `${(navRef.current.offsetHeight - newHeight) / 2}px`,
            maskImage: `linear-gradient(to right, rgba(0,0,0, ${leftOpacity}), black ${gradientWidth}px, black calc(100% - ${gradientWidth}px), rgba(0,0,0, ${rightOpacity}))`,
            '--before-opacity': leftOpacity,
            '--after-opacity': rightOpacity,
        } as React.CSSProperties;
        setHighlightStyle(style);

        animationFrameId.current = null;
    };

    // Effect 1: Measures section heights and calculates proportional link margins.
    useEffect(() => {
        const calculateGeometries = () => {
            const headerHeight = 64; // Corresponds to h-16 in Tailwind
            const sections = navLinks.map(link => {
                const elem = document.getElementById(link.href.substring(1));
                if (!elem) return { top: 0, height: 0 };
                // Section 'top' is its DOM position relative to the document, minus the sticky header's height.
                // This value corresponds to the `scrollY` value when the section is at the top of the viewport.
                return { top: elem.offsetTop - headerHeight, height: elem.offsetHeight };
            });

            layoutMetrics.current.sections = sections;

            const heights = sections.map(s => s.height).filter(h => h > 0);
            if (heights.length < 2) {
                setLinkMargins(navLinks.map(() => 8)); // Default margin if not enough data
                return;
            }

            const minHeight = Math.min(...heights);
            const maxHeight = Math.max(...heights);
            const minMargin = 8; // 0.5rem
            const maxMargin = 32; // 2rem

            const margins = sections.map((section, index) => {
                if (index === 0) return 0; // No margin for the first element
                
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
        handleLoad(); // Initial call

        return () => {
            window.removeEventListener('resize', calculateGeometries);
            window.removeEventListener('load', handleLoad);
            window.removeEventListener('layout-changed', calculateGeometries);
        };
    }, []);

    // Effect 2: After margins are applied and the component re-renders, measure the final link positions.
    useLayoutEffect(() => {
        if (linkMargins.length === 0) return;

        const measureLinks = () => {
            const links = linkRefs.current.map(el => {
                if (!el) return { left: 0, width: 0, height: 0 };
                return { left: el.offsetLeft, width: el.offsetWidth, height: el.offsetHeight };
            });

            if (links.some(l => l.width > 0)) {
                layoutMetrics.current.links = links;
                // Trigger highlight update with the final, correct measurements.
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
        
        setIsMobileMenuOpen(false); // Close mobile menu on click
    };

    return (
        <>
            <header className={`sticky top-0 z-40 w-full backdrop-blur transition-all duration-500 ${isScrolled ? 'bg-background/80 border-b border-border' : 'bg-transparent'}`}>
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
                                className="absolute nav-highlighter rounded-lg"
                                style={highlightStyle}
                            />
                            {navLinks.map((link, index) => {
                                const isActive = activeSectionIndex === index;
                                const marginStyle = linkMargins.length > 0 && linkMargins[index] > 0
                                    ? { marginLeft: `${linkMargins[index]}px` }
                                    : {};
                                return (
                                    <a
                                        // FIX: Type '(el: HTMLAnchorElement) => HTMLAnchorElement' is not assignable to type 'Ref<HTMLAnchorElement>'.
                                        // The ref callback should not return a value. Using a block statement `{}` ensures an implicit `undefined` return.
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
                                    ref={contactButtonRef}
                                    onClick={() => contactButtonRef.current && onContactClick(contactButtonRef.current)}
                                    className={`relative group inline-flex items-center justify-center overflow-hidden text-primary font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-300 shadow-sm bg-surface/30 dark:bg-surface/20 backdrop-blur border border-black/5 dark:border-white/10 hover:border-black/20 dark:hover:border-white/30 hover:shadow-md hover:-translate-y-0.5 ${isContactModalOpen ? 'opacity-0 scale-95 invisible' : 'visible'}`}
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/50 to-accent transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
                                    <span className="relative z-10">
                                        Contact Me
                                    </span>
                                </button>
                                <div className="flex items-center space-x-4 border-l border-border pl-4">
                                    <a href="mailto:aadhavsivakumar@gmail.com" aria-label="Email" className="text-icon-resting hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-110"><MailIcon /></a>
                                    <a href="https://github.com/AadhavSivakumar" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-icon-resting hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-110"><GithubIcon /></a>
                                    <a href="https://www.linkedin.com/in/aadhav-sivakumar/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-icon-resting hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-110"><LinkedinIcon /></a>
                                </div>
                            </div>
                             <div className="md:hidden">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="relative z-50 w-8 h-8 flex flex-col justify-between items-center"
                                    aria-label="Toggle Menu"
                                >
                                    <span className={`block h-0.5 w-6 bg-primary rounded-full transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`}></span>
                                    <span className={`block h-0.5 w-6 bg-primary rounded-full transition duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                                    <span className={`block h-0.5 w-6 bg-primary rounded-full transform transition duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`}></span>
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
                    <div className="flex items-center space-x-8 pt-10 border-t border-border mt-4">
                        <a href="mailto:aadhavsivakumar@gmail.com" aria-label="Email" className="text-icon-resting hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-110"><MailIcon /></a>
                        <a href="https://github.com/AadhavSivakumar" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-icon-resting hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-110"><GithubIcon /></a>
                        <a href="https://www.linkedin.com/in/aadhav-sivakumar/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-icon-resting hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-110"><LinkedinIcon /></a>
                    </div>
                </nav>
            </div>
        </>
    );
};

export default Header;