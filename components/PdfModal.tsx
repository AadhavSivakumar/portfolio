import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CloseIcon, GithubIcon, LinkedinIcon, MailIcon } from './Icons';

interface ContactModalProps {
  initialBounds: DOMRect;
  onClose: () => void;
  onStartFalling?: () => void;
}

type AnimationState = 'entering' | 'dropped' | 'expanded' | 'collapsing' | 'falling';

const ButtonContent: React.FC = () => (
    <div className="relative z-10 flex items-center justify-center w-full h-full">
        {/* Text removed to ensure smooth visual transition from any button source */}
    </div>
);

const ContactModal: React.FC<ContactModalProps> = ({ initialBounds, onClose, onStartFalling }) => {
    const [animationState, setAnimationState] = useState<AnimationState>('entering');
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleClose = useCallback(() => {
        setAnimationState('collapsing');
    }, []);

    const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
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
            setAnimationState('dropped');
        });

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('keydown', handleEsc);
        };
    }, [handleClose]);

    const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
        if (e.target !== e.currentTarget) return;

        if (animationState === 'dropped' && e.propertyName === 'transform') {
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
            willChange: 'top, left, width, height, transform, box-shadow, opacity, border-radius',
            borderRadius: '0.5rem', // Match button's rounded-lg
        };

        const initialStyle = {
            top: `${initialBounds.top}px`,
            left: `${initialBounds.left}px`,
            width: `${initialBounds.width}px`,
            height: `${initialBounds.height}px`,
            transform: 'translateY(0) scale(1)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // shadow-sm
            opacity: 1,
        };

        const droppedStyle = {
            ...initialStyle,
            transform: 'translateY(40px) scale(1.05)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        };

        const targetWidth = Math.min(600, window.innerWidth * 0.9);
        const targetHeight = Math.min(680, window.innerHeight * 0.9);

        const expandedStyle = {
            top: `calc(50% - ${targetHeight / 2}px)`,
            left: `calc(50% - ${targetWidth / 2}px)`,
            width: `${targetWidth}px`,
            height: `${targetHeight}px`,
            transform: 'translateY(0) scale(1)',
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
            borderRadius: '0.75rem',
        };

        const transitionCurve = 'cubic-bezier(0.65, 0, 0.35, 1)';
        const themeTransition = 'background-color 0.5s ease';
        const expandTransition = `top 360ms ${transitionCurve}, left 360ms ${transitionCurve}, width 360ms ${transitionCurve}, height 360ms ${transitionCurve}, transform 360ms ${transitionCurve}, box-shadow 360ms ${transitionCurve}, border-radius 360ms ${transitionCurve}, ${themeTransition}`;
        const preExpandFallTransition = `transform 288ms ${transitionCurve}, box-shadow 288ms ${transitionCurve}, opacity 288ms ${transitionCurve}, ${themeTransition}`;
        const collapseTransition = `top 360ms ${transitionCurve}, left 360ms ${transitionCurve}, width 360ms ${transitionCurve}, height 360ms ${transitionCurve}, transform 360ms ${transitionCurve}, box-shadow 360ms ${transitionCurve}, border-radius 360ms ${transitionCurve}, ${themeTransition}`;


        switch (animationState) {
            case 'entering': return { ...baseStyle, ...initialStyle, transition: 'none' };
            case 'dropped': return { ...baseStyle, ...droppedStyle, transition: preExpandFallTransition };
            case 'expanded': return { ...baseStyle, ...expandedStyle, transition: expandTransition };
            case 'collapsing': return { ...baseStyle, ...droppedStyle, transition: collapseTransition };
            case 'falling': return { ...baseStyle, ...initialStyle, opacity: 0, transition: preExpandFallTransition };
            default: return {};
        }
    }, [animationState, initialBounds]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        // Simulate an API call. In a real app, this would be an async request.
        setTimeout(() => {
            console.log('Form submitted:', formState);
            setStatus('success');
        }, 1000);
    };

    const isExpanded = animationState === 'expanded';
    const isCloseButtonVisible = isExpanded;
    const isButtonContentVisible = animationState === 'entering' || animationState === 'dropped';

    return (
        <div className="fixed inset-0 z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={handleWrapperClick}>
            <div
                style={modalStyle}
                onTransitionEnd={onTransitionEnd}
                className="text-primary font-semibold bg-surface/30 dark:bg-surface/20 backdrop-blur border border-black/5 dark:border-white/10 transition-colors duration-500"
            >
                <div className="w-full h-full flex flex-col">
                    <div className={`absolute inset-0 transition-opacity duration-100 ease-out pointer-events-none ${isButtonContentVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <ButtonContent />
                    </div>
                    
                    <div className={`w-full h-full flex flex-col transition-opacity duration-300 ease-out bg-surface ${isExpanded ? 'opacity-100 delay-150' : 'opacity-0'}`}>
                        <header className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                            <h2 id="modal-title" className="text-xl font-bold text-primary">Get In Touch</h2>
                        </header>
                        <div className="flex-grow overflow-y-auto p-6 md:p-8">
                            {status === 'success' ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <h3 className="text-2xl font-bold text-primary mb-2">Thank You!</h3>
                                    <p className="text-secondary">Your message has been received. I'll get back to you shortly.</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-secondary mb-6">I'm open to new opportunities and collaborations. Fill out the form below or connect with me through my social channels.</p>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-primary mb-1">Name</label>
                                            <input type="text" name="name" id="name" required value={formState.name} onChange={handleChange} className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-all" />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">Email</label>
                                            <input type="email" name="email" id="email" required value={formState.email} onChange={handleChange} className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-all" />
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-primary mb-1">Message</label>
                                            <textarea name="message" id="message" rows={5} required value={formState.message} onChange={handleChange} className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-all"></textarea>
                                        </div>
                                        <button type="submit" disabled={status === 'submitting'} className="w-full bg-accent text-white dark:text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                                            {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </form>

                                    <div className="mt-8 text-center">
                                        <p className="text-sm text-secondary mb-4">Or connect with me here</p>
                                        <div className="flex justify-center items-center space-x-8">
                                            <a href="mailto:aadhavsivakumar@gmail.com" aria-label="Email" className="text-icon-resting hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-110"><MailIcon className="w-8 h-8" /></a>
                                            <a href="https://github.com/AadhavSivakumar" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-icon-resting hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-110"><GithubIcon className="w-8 h-8" /></a>
                                            <a href="https://www.linkedin.com/in/aadhav-sivakumar/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-icon-resting hover:text-accent transition-all duration-300 ease-in-out transform hover:scale-110"><LinkedinIcon className="w-8 h-8" /></a>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                
                <button
                    onClick={handleClose}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/75 transition-all duration-300 ease-in-out z-10 ${isCloseButtonVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                    aria-label="Close Contact Form"
                >
                    <CloseIcon />
                </button>
            </div>
        </div>
    );
};

export default ContactModal;