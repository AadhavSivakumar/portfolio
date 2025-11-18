import React, { useState, useEffect } from 'react';

interface OpeningAnimationProps {
  children: React.ReactNode;
}

const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ children }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  useEffect(() => {
    // Start the glow + retract sequence almost immediately
    const animateTimer = setTimeout(() => {
      setIsAnimating(true);
    }, 25);

    // Set a timer to remove the splash screen after the animation completes
    // Total animation time is 3.5s
    const finishTimer = setTimeout(() => {
      setIsFinished(true);
    }, 3500);

    return () => {
      clearTimeout(animateTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  const blades = Array.from({ length: 8 }, (_, i) => ({
    rotation: i * 45 + 22.5,
  }));

  const getBladeTransforms = (bladeIndex: number) => {
    switch (bladeIndex) {
      case 0: return { tx: 'calc(-50% + 100vmax)', ty: '0' }; // right
      case 1: return { tx: 'calc(-50% + 71vmax)', ty: '71vmax' }; // down-right
      case 2: return { tx: '-50%', ty: '100vmax' }; // down
      case 3: return { tx: 'calc(-50% - 71vmax)', ty: '71vmax' }; // down-left
      case 4: return { tx: 'calc(-50% - 100vmax)', ty: '0' }; // left
      case 5: return { tx: 'calc(-50% - 71vmax)', ty: '-71vmax' }; // up-left
      case 6: return { tx: '-50%', ty: '-100vmax' }; // up
      case 7: return { tx: 'calc(-50% + 71vmax)', ty: '-71vmax' }; // up-right
      default: return { tx: '-50%', ty: '-100vmax' }; // default to up
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