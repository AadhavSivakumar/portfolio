import React, { useState, useEffect } from 'react';

interface OpeningAnimationProps {
  children: React.ReactNode;
}

type BladeContent = {
  type: 'text' | 'icon';
  value: string;
  delay: string;
};

const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ children }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  useEffect(() => {
    // Start the glow + retract sequence almost immediately
    const animateTimer = setTimeout(() => {
      setIsAnimating(true);
    }, 50);

    // Set a timer to remove the splash screen after the animation completes
    // New total animation time is 7s (1s delay + 6s glow)
    const finishTimer = setTimeout(() => {
      setIsFinished(true);
    }, 7000);

    return () => {
      clearTimeout(animateTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  const blades = Array.from({ length: 8 }, (_, i) => ({
    rotation: i * 45 + 22.5,
  }));

  const bladeContentMap: { [key: number]: BladeContent } = {
    0: { type: 'icon', value: 'https://api.iconify.design/mdi/cog-outline.svg', delay: '0.6s' },
    1: { type: 'icon', value: 'https://api.iconify.design/mdi/access-point.svg', delay: '0.7s' },
    2: { type: 'icon', value: 'https://api.iconify.design/mdi/satellite-uplink.svg', delay: '0.8s' },
    3: { type: 'text', value: 'A', delay: '0.1s' },
    4: { type: 'text', value: 'S', delay: '0.2s' },
    5: { type: 'icon', value: 'https://api.iconify.design/mdi/robot-industrial-outline.svg', delay: '0.3s' },
    6: { type: 'icon', value: 'https://api.iconify.design/mdi/chip.svg', delay: '0.4s' },
    7: { type: 'icon', value: 'https://api.iconify.design/mdi/chart-bell-curve-cumulative.svg', delay: '0.5s' },
  };

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
            const content = bladeContentMap[i];
            
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
                {content && content.type === 'text' && (
                  <div className="blade-text" style={{ animationDelay: content.delay }}>{content.value}</div>
                )}
                {content && content.type === 'icon' && (
                    <img src={content.value} alt="Engineering Icon" className="blade-icon" style={{ animationDelay: content.delay }} />
                )}
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