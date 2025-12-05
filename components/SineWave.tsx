import React, { useEffect, useRef } from 'react';

const SineWave: React.FC = () => {
    const phaseRef = useRef(0);
    const mousePosRef = useRef<{ x: number | null, y: number | null }>({ x: null, y: null });
    const svgRef = useRef<SVGSVGElement>(null);
    const groupsRef = useRef<(SVGGElement | null)[]>([]);
    const pathsRef = useRef<(SVGPathElement | null)[]>([]);
    const requestRef = useRef<number>(0);
    const configRef = useRef({ frequency: 0.04, bulgeAmplitude: 120 });
    const startTimeRef = useRef<number>(0);

    const NUM_WAVES = 30;
    const GOLD_COLOR = '#C5A35C';

    useEffect(() => {
        const handleResize = () => {
            const aspectRatio = window.innerWidth / window.innerHeight;
            if (aspectRatio < 1) {
                configRef.current = { frequency: 0.02, bulgeAmplitude: 40 };
            } else {
                configRef.current = { frequency: 0.04, bulgeAmplitude: 120 };
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        startTimeRef.current = Date.now();

        const animate = () => {
            phaseRef.current -= 0.15;
            const now = Date.now();
            const elapsed = now - startTimeRef.current;

            const { frequency, bulgeAmplitude } = configRef.current;
            const { x: mx, y: my } = mousePosRef.current;
            const viewWidth = 1000;
            const viewboxHeight = 350;
            const verticalPadding = 20;
            const drawingHeight = viewboxHeight - (verticalPadding * 2);

            for (let i = 0; i < NUM_WAVES; i++) {
                const group = groupsRef.current[i];
                const path = pathsRef.current[i];
                if (!group || !path) continue;

                // --- Entrance Animation Logic ---
                const delay = i * 50; // 0.05s pause between each wave
                const duration = 1200; // Smooth drop duration
                
                // Calculate animation progress (0 to 1)
                let progress = 0;
                if (elapsed > delay) {
                    progress = Math.min((elapsed - delay) / duration, 1);
                }

                // Cubic easing out for smooth deceleration
                const ease = (t: number) => 1 - Math.pow(1 - t, 3);
                const easedProgress = ease(progress);

                // Calculate vertical position (slide from top)
                const finalY = verticalPadding + (i / (NUM_WAVES - 1)) * drawingHeight;
                const startY = -50; // Start just above the visible area
                const currentY = startY + (finalY - startY) * easedProgress;

                // Calculate opacity (fade in)
                const targetOpacity = 0.8 - (i / (NUM_WAVES - 1)) * 0.7;
                const currentOpacity = targetOpacity * easedProgress;

                // Apply group transform and path styles
                group.setAttribute('transform', `translate(0, ${currentY})`);
                path.style.opacity = currentOpacity.toString();
                path.style.stroke = GOLD_COLOR;

                // --- Wave Shape Calculation ---
                const points = [];
                const amplitude = 8;
                const phaseOffset = i * -25 * (Math.PI / 180);
                const bulgeHeight = bulgeAmplitude;
                const bulgeRadius = 40;

                // Step size 5 for optimization
                for (let x = -100; x <= 1200; x += 5) {
                    const base_y = amplitude * Math.sin(((Math.abs(x - viewWidth / 2) + phaseRef.current) * frequency) + phaseOffset);
                    let bulge = 0;
                    if (mx !== null && my !== null) {
                        const dx = x - mx;
                        // Use currentY for interaction so mouse affects the wave wherever it currently is
                        const dy = currentY - my;
                        const distanceSq = dx * dx + dy * dy;
                        if (distanceSq < 25000) {
                             bulge = bulgeHeight * Math.exp(-distanceSq / (2 * bulgeRadius * bulgeRadius));
                        }
                    }
                    points.push(`${x},${base_y - bulge}`);
                }
                path.setAttribute('d', `M${points.join(' L')}`);
            }

            requestRef.current = requestAnimationFrame(animate);
        };
        
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            const scaledX = ((e.clientX - rect.left) / rect.width) * 1000;
            const scaledY = ((e.clientY - rect.top) / rect.height) * 350;
            mousePosRef.current = { x: scaledX, y: scaledY };
        }
    };
    
    const onMouseLeave = () => {
        mousePosRef.current = { x: null, y: null };
    };

    return (
        <div className="absolute inset-x-0 top-0 z-0 w-full h-full" aria-hidden="true">
            <svg 
                ref={svgRef}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                width="100%" 
                height="100%" 
                viewBox="0 0 1000 350" 
                preserveAspectRatio="none" 
                className="opacity-80 dark:opacity-60 transition-opacity duration-1000"
            >
                {Array.from({ length: NUM_WAVES }).map((_, i) => (
                    <g 
                        key={i} 
                        ref={el => { groupsRef.current[i] = el; }}
                        // Initialize off-screen to prevent flash before animation frame
                        transform="translate(0, -50)"
                    >
                        <path
                            ref={el => { pathsRef.current[i] = el; }}
                            style={{
                                stroke: GOLD_COLOR,
                                strokeWidth: 2,
                                fill: 'none',
                                opacity: 0, // Initialize invisible
                                transition: 'stroke 2s ease'
                            }}
                        />
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default SineWave;