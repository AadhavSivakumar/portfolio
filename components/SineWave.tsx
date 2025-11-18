import React, { useState, useEffect, useRef, useCallback } from 'react';

const SineWave: React.FC = () => {
    const [mousePos, setMousePos] = useState<{ x: number | null, y: number | null }>({ x: null, y: null });
    const [phase, setPhase] = useState(0);
    const [frequency, setFrequency] = useState(0.04);
    const [bulgeAmplitude, setBulgeAmplitude] = useState(120);
    const svgRef = useRef<SVGSVGElement>(null);
    const animationFrameRef = useRef<number | undefined>(undefined);

    // Effect to handle window resize and set frequency/bulge
    useEffect(() => {
        const handleResize = () => {
            const aspectRatio = window.innerWidth / window.innerHeight;
            if (aspectRatio < 1) {
                setFrequency(0.02); // Halved frequency for portrait
                setBulgeAmplitude(40); // Halved bulge for portrait
            } else {
                setFrequency(0.04); // Default frequency for landscape
                setBulgeAmplitude(120); // Default bulge for landscape
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check on mount

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Animation loop for the wave's horizontal movement
    useEffect(() => {
        const animate = () => {
            setPhase(p => (p - 0.3)); // Decrement phase to move wave (Slightly slower)
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animationFrameRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameRef.current !== undefined) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    // Mouse move handler to capture cursor position
    const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        if (svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            // Scale mouse coords from screen to SVG viewBox (1000x350)
            const scaledX = ((e.clientX - rect.left) / rect.width) * 1000;
            const scaledY = ((e.clientY - rect.top) / rect.height) * 350;
            setMousePos({ x: scaledX, y: scaledY });
        }
    }, []);

    // Mouse leave handler to reset the interaction
    const handleMouseLeave = useCallback(() => {
        setMousePos({ x: null, y: null });
    }, []);

    // Memoized function to generate the dynamic wave path for a specific wave
    const generateWavePath = useCallback((waveY: number, index: number) => {
        const points = [];
        const viewWidth = 1000;
        const extendedWidth = viewWidth + 200; // Extend to hide rendering edges
        
        // Wave parameters
        const amplitude = 8;
        const phaseOffset = index * -20 * (Math.PI / 180); // -10 degree offset per wave

        // Interaction parameters
        const bulgeHeight = bulgeAmplitude;
        const bulgeRadius = 40; // The radius of the circular effect (widened for a broader interaction)

        for (let x = -100; x <= extendedWidth; x += 5) {
            // Base wave calculation now expands from the center
            const base_y = amplitude * Math.sin(((Math.abs(x - viewWidth / 2) + phase) * frequency) + phaseOffset);

            let bulge = 0;
            if (mousePos.x !== null && mousePos.y !== null) {
                const dx = x - mousePos.x;
                // Calculate dy from the wave's horizontal baseline to create a broader interaction field
                const dy = waveY - mousePos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Use a Gaussian function for a smooth, localized bulge effect based on radial distance
                bulge = bulgeHeight * Math.exp(-(distance * distance) / (2 * bulgeRadius * bulgeRadius));
            }

            // In SVG, a lower Y value is higher on the screen, so we subtract the bulge.
            points.push(`${x},${base_y - bulge}`);
        }

        return "M" + points.join(" L");
    }, [phase, mousePos.x, mousePos.y, frequency, bulgeAmplitude]);


    const NUM_WAVES = 40; // Reduced from 50
    const GOLD_COLOR = '#C5A35C'; // Site's accent gold color

    const waves = Array.from({ length: NUM_WAVES }).map((_, i) => {
        // Opacity decreases as we go down the screen (i increases).
        // This makes the waves more transparent further down, from 0.8 to 0.1.
        const opacity = 0.8 - (i / (NUM_WAVES - 1)) * 0.7;

        // Calculate vertical position to distribute waves evenly across the SVG height
        const viewboxHeight = 350;
        const verticalPadding = 20; // Padding at top and bottom
        const drawingHeight = viewboxHeight - (verticalPadding * 2);
        // Distribute waves from top to bottom based on their index
        const yPosition = verticalPadding + (i / (NUM_WAVES - 1)) * drawingHeight;

        return {
            y: yPosition,
            style: {
                stroke: GOLD_COLOR,
                opacity: opacity,
            }
        };
    });

    return (
        <div className="absolute inset-x-0 top-0 z-0 w-full h-full" aria-hidden="true">
            <svg 
                ref={svgRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                width="100%" 
                height="100%" 
                viewBox="0 0 1000 350" 
                preserveAspectRatio="none" 
                className="opacity-80 dark:opacity-60 transition-opacity duration-1000"
            >
                {waves.map((wave, index) => (
                    <g key={index} transform={`translate(0, ${wave.y})`}>
                        <path 
                            d={generateWavePath(wave.y, index)} 
                            style={{ 
                                ...wave.style as React.CSSProperties,
                                strokeWidth: 2,
                                fill: 'none',
                                transition: 'stroke 2s ease' // Allow color to transition with theme change
                            }} 
                        />
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default SineWave;