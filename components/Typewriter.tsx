import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 40, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayText(''); // Reset on text change
    setIsFinished(false);
    
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prevText => prevText + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        setIsFinished(true);
      }
    }, speed);

    return () => {
      clearInterval(typingInterval);
    };
  }, [text, speed]);

  return (
    <p className={`${className} relative`}>
      {displayText}
      <span 
        className={`
          inline-block w-[2px] h-[1.2em] bg-accent ml-1 align-text-bottom
          ${isFinished ? 'animate-blink-smooth' : ''}
        `}
        aria-hidden="true"
      ></span>
    </p>
  );
};

export default Typewriter;
