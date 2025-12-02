import React, { useEffect, useRef } from 'react';

const SineWave: React.FC = () => {
    const phaseRef = useRef(0);
    const mousePosRef = useRef<{ x: number | null, y: number | null }>({ x: null, y: null });
    const svgRef = useRef<SVGSVGElement>(null);
    const pathsRef = useRef<(SVGPathElement | null)[]>([]);
    const requestRef = useRef<number>(0);
    const configRef = useRef({ frequency: 0.04, bulgeAmplitude: 120 });

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
        const animate = () => {
            phaseRef.current -= 0.15;
            const { frequency, bulgeAmplitude } = configRef.current;
            const { x: mx, y: my } = mousePosRef.current;
            const viewWidth = 1000;

            pathsRef.current.forEach((path, i) => {
                if (!path) return;

                const points = [];
                const viewboxHeight = 350;
                const verticalPadding = 20;
                const drawingHeight = viewboxHeight - (verticalPadding * 2);
                const waveY = verticalPadding + (i / (NUM_WAVES - 1)) * drawingHeight;

                const amplitude = 8;
                const phaseOffset = i * -20 * (Math.PI / 180);
                const bulgeHeight = bulgeAmplitude;
                const bulgeRadius = 40;

                // Step size 10 for optimization
                for (let x = -100; x <= 1200; x += 10) {
                    const base_y = amplitude * Math.sin(((Math.abs(x - viewWidth / 2) + phaseRef.current) * frequency) + phaseOffset);
                    let bulge = 0;
                    if (mx !== null && my !== null) {
                        const dx = x - mx;
                        const dy = waveY - my;
                        const distanceSq = dx * dx + dy * dy;
                        if (distanceSq < 25000) {
                             bulge = bulgeHeight * Math.exp(-distanceSq / (2 * bulgeRadius * bulgeRadius));
                        }
                    }
                    points.push(`${x},${base_y - bulge}`);
                }
                path.setAttribute('d', `M${points.join(' L')}`);
            });

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

    const waves = Array.from({ length: NUM_WAVES }).map((_, i) => {
        const opacity = 0.8 - (i / (NUM_WAVES - 1)) * 0.7;
        const viewboxHeight = 350;
        const verticalPadding = 20;
        const drawingHeight = viewboxHeight - (verticalPadding * 2);
        const yPosition = verticalPadding + (i / (NUM_WAVES - 1)) * drawingHeight;
        return { y: yPosition, opacity };
    });

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
                {waves.map((wave, i) => (
                    <g key={i} transform={`translate(0, ${wave.y})`}>
                        <path
                            ref={el => { pathsRef.current[i] = el; }}
                            style={{
                                stroke: GOLD_COLOR,
                                strokeWidth: 2,
                                fill: 'none',
                                opacity: wave.opacity,
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