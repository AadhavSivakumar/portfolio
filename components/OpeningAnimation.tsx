import React, { useState, useEffect } from 'react';

interface OpeningAnimationProps {
  children: React.ReactNode;
}

const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ children }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  useEffect(() => {
    // Start the glow + retract sequence immediately
    const animateTimer = setTimeout(() => {
      setIsAnimating(true);
    }, 0);

    // Set a timer to remove the splash screen after the animation completes
    // Total animation time is 0.5s, we wait 1s to ensure it's fully cleared with a huge buffer.
    const finishTimer = setTimeout(() => {
      setIsFinished(true);
    }, 1000);

    return () => {
      clearTimeout(animateTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  const blades = Array.from({ length: 8 }, (_, i) => ({
    rotation: i * 45 + 22.5,
  }));

  const getBladeTransforms = (bladeIndex: number) => {
    // Increased values to 150vmax (from 100) and 106vmax (from 71) 
    // to guarantee blades move completely offscreen even on large monitors.
    switch (bladeIndex) {
      case 0: return { tx: 'calc(-50% + 150vmax)', ty: '0' }; // right
      case 1: return { tx: 'calc(-50% + 106vmax)', ty: '106vmax' }; // down-right
      case 2: return { tx: '-50%', ty: '150vmax' }; // down
      case 3: return { tx: 'calc(-50% - 106vmax)', ty: '106vmax' }; // down-left
      case 4: return { tx: 'calc(-50% - 150vmax)', ty: '0' }; // left
      case 5: return { tx: 'calc(-50% - 106vmax)', ty: '-106vmax' }; // up-left
      case 6: return { tx: '-50%', ty: '-150vmax' }; // up
      case 7: return { tx: 'calc(-50% + 106vmax)', ty: '-106vmax' }; // up-right
      default: return { tx: '-50%', ty: '-150vmax' }; // default to up
    }
  };

  return (
    <>
      {!isFinished && (
        <div id="splash-screen" className={isAnimating ? 'is-pre-animating' : ''}>
          {blades.map((blade, i) => {
            const { tx, ty } = getBladeTransforms(i);
            
            return (
              <div
                key={blade.rotation}
                className="blade"
                style={{
                  '--rotation': `${blade.rotation}deg`,
                  '--translateX': tx,
                  '--translateY': ty,
                } as React.CSSProperties}
              >
                <div className="blade-background"></div>
                <div className="glow-edge left"></div>
                <div className="glow-edge right"></div>
              </div>
            );
          })}
        </div>
      )}
      {children}
    </>
  );
};

export default OpeningAnimation;