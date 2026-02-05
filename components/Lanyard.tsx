import React, { useEffect, useRef, useState } from 'react';

// Matter.js type workarounds for global CDN usage
declare global {
  interface Window {
    Matter: any;
  }
}

interface LanyardInfo {
  name: string;
  role: string;
  id?: string;
  exp?: string;
  imageUrl?: string;
}

interface LanyardProps {
  info?: LanyardInfo;
  gravity?: [number, number];
  tetherLength?: number;
}

const Lanyard: React.FC<LanyardProps> = ({ 
  info = { name: 'Aadhav', role: 'Engineer', id: '042025', exp: '2025', imageUrl: 'https://aadhavsivakumar.github.io/Media/frontpagepfp.JPG' },
  gravity = [0, 1],
  tetherLength = 200
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const engineRef = useRef<any>(null);
  const renderRef = useRef<any>(null);
  const runnerRef = useRef<any>(null);
  
  useEffect(() => {
    // Wait for Matter to load if it hasn't already
    if (!window.Matter) {
      const interval = setInterval(() => {
        if (window.Matter) {
          setIsReady(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady || !containerRef.current || !canvasRef.current || !window.Matter) return;

    const Matter = window.Matter;
    const { Engine, Render, Runner, World, Bodies, Composite, Constraint, Events, Body } = Matter;

    // Create new engine
    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;
    engine.gravity.y = gravity[1];

    // Canvas Dimensions
    const width = 600; 
    const height = 550; // Increased height to accommodate larger cards/swing

    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width,
        height,
        background: 'transparent',
        wireframes: false,
        pixelRatio: window.devicePixelRatio || 1
      }
    });
    renderRef.current = render;

    // --- Physics Objects ---
    
    // Increased Card Size
    const cardWidth = 160;
    const cardHeight = 260;
    
    // Initial Position
    const startX = width / 2;
    const anchorY = -20;
    const cardStartY = anchorY + tetherLength + cardHeight / 2;

    // 1. The Card Body
    const card = Bodies.rectangle(startX, cardStartY, cardWidth, cardHeight, {
      chamfer: { radius: 12 },
      density: 0.005, 
      frictionAir: 0.02, // Increased friction for more stability/less pendulum chaos
      restitution: 0.3, // Less bouncy
      render: { visible: false } 
    });

    // 2. The Anchor (Top point - static)
    const anchor = Bodies.circle(startX, anchorY, 5, { isStatic: true, render: { visible: false } });

    // 3. The Tether (String)
    const tether = Constraint.create({
        bodyA: anchor,
        bodyB: card,
        pointA: { x: 0, y: 0 },
        pointB: { x: 0, y: -cardHeight / 2 + 20 }, // Attach near top of card
        length: tetherLength,
        stiffness: 0.98,
        damping: 0.1, // Higher damping for smoother swing
        render: { visible: false }
    });

    Composite.add(world, [anchor, card, tether]);

    // Hover Interaction
    const handleMouseMove = (e: MouseEvent) => {
        const rect = render.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Check distance from card center
        const dx = mouseX - card.position.x;
        const dy = mouseY - card.position.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const interactionRadius = Math.max(cardWidth, cardHeight) * 1.5;
        
        // Push slightly away from mouse to create a "hover" disturbance
        if (dist < interactionRadius) {
             const proximityFactor = 1 - (dist / interactionRadius);
             // Drastically reduced force magnitude for "slight and refined" movement
             const forceMagnitude = proximityFactor * 0.00015; 
             
             Body.applyForce(card, card.position, { 
                 x: (card.position.x - mouseX) * forceMagnitude, 
                 y: (card.position.y - mouseY) * forceMagnitude 
             });
        }
    };
    render.canvas.addEventListener('mousemove', handleMouseMove);

    // Initial Random Movement - Reduced further
    setTimeout(() => {
        if (!card) return;
        Body.setVelocity(card, { x: (Math.random() - 0.5) * 3, y: 0 }); 
        Body.setAngularVelocity(card, (Math.random() - 0.5) * 0.01);
    }, 200);
    
    // Add continuous gentle sway
    Events.on(engine, 'beforeUpdate', () => {
        if (!card) return;
        const time = engine.timing.timestamp;
        // Gentle sine wave force
        const sway = Math.sin(time * 0.0015) * 0.00005; 
        Body.applyForce(card, card.position, { x: sway, y: 0 });
    });

    // --- Rendering ---
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);
    Render.run(render);

    // Load Texture
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = info.imageUrl || 'https://aadhavsivakumar.github.io/Media/frontpagepfp.JPG';
    let textureLoaded = false;
    img.onload = () => { textureLoaded = true; };

    // Custom Render Loop
    Events.on(render, 'afterRender', () => {
       const ctx = render.context;
       
       if (!ctx) return;

       const attachX = card.position.x + (0 * Math.cos(card.angle) - (-cardHeight/2 + 20) * Math.sin(card.angle));
       const attachY = card.position.y + (0 * Math.sin(card.angle) + (-cardHeight/2 + 20) * Math.cos(card.angle));

       // Draw Tether (Curve)
       ctx.beginPath();
       ctx.moveTo(startX, anchorY);
       
       // Calculate control point for curve to simulate slack/tension visually
       const midX = (startX + attachX) / 2;
       const midY = (anchorY + attachY) / 2;
       
       ctx.quadraticCurveTo(midX, midY, attachX, attachY);
       
       ctx.lineWidth = 3;
       ctx.strokeStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'rgba(255,255,255,0.4)' : '#333';
       ctx.lineCap = 'round';
       ctx.stroke();

       // Draw Card
       ctx.translate(card.position.x, card.position.y);
       ctx.rotate(card.angle);
       
       // Card Shadow
       ctx.shadowColor = 'rgba(0,0,0,0.15)';
       ctx.shadowBlur = 20;
       ctx.shadowOffsetY = 10;
       ctx.shadowOffsetX = 0;
       
       // Card Body
       ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#2a2a2a' : 'white';
       roundRect(ctx, -cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 16);
       ctx.fill();
       
       // Reset Shadow
       ctx.shadowColor = 'transparent';
       
       // Border
       ctx.strokeStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
       ctx.lineWidth = 1;
       ctx.stroke();

       // Header (Hole area)
       ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#333' : '#f3f4f6';
       // Clip top part
       ctx.save();
       ctx.beginPath();
       roundRect(ctx, -cardWidth/2, -cardHeight/2, cardWidth, 80, 16); // Increased header height slightly
       ctx.clip();
       ctx.fillRect(-cardWidth/2, -cardHeight/2, cardWidth, 80);
       ctx.restore();

       // Hole Punch Ring
       ctx.beginPath();
       ctx.arc(0, -cardHeight/2 + 20, 8, 0, Math.PI * 2);
       ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#222' : '#e5e7eb';
       ctx.fill();
       
       // Hole Punch Center
       ctx.beginPath();
       ctx.arc(0, -cardHeight/2 + 20, 5, 0, Math.PI * 2);
       ctx.fillStyle = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#121212' : '#F7F5F2'; 
       ctx.fill();

       // Image
       // UPDATED: Increased radius from 32 to 50
       const imageRadius = 50;
       const imageDiameter = imageRadius * 2;
       
       if (textureLoaded) {
           ctx.save();
           ctx.beginPath();
           // Center of image visual
           ctx.arc(0, -cardHeight/2 + 75, imageRadius, 0, Math.PI * 2); 
           ctx.clip();
           // Draw white bg behind image
           ctx.fillStyle = 'white';
           // Adjust rect to cover the new radius
           ctx.fillRect(-imageRadius, -cardHeight/2 + 75 - imageRadius, imageDiameter, imageDiameter);
           ctx.drawImage(img, -imageRadius, -cardHeight/2 + 75 - imageRadius, imageDiameter, imageDiameter);
           ctx.restore();
       } else {
           // Placeholder circle
           ctx.beginPath();
           ctx.arc(0, -cardHeight/2 + 75, imageRadius, 0, Math.PI * 2);
           ctx.fillStyle = '#ddd';
           ctx.fill();
       }

       // Text Content
       const textColorPrimary = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#eee' : '#111827';
       const textColorSecondary = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#aaa' : '#6b7280';

       ctx.fillStyle = textColorPrimary;
       ctx.font = 'bold 15px "Inter", sans-serif'; 
       ctx.textAlign = 'center';
       ctx.fillText(info.name, 0, 25); 

       ctx.fillStyle = textColorSecondary;
       // Reduced font slightly to 11px to accommodate longer role texts
       ctx.font = '500 11px "Inter", sans-serif'; 
       ctx.fillText(info.role, 0, 42); 

       // ID Fields area
       // Removed ID field, centered EXP field
       const fieldStartY = 85; 
       
       drawField(ctx, 'EXP', info.exp || '2025', fieldStartY, textColorSecondary, textColorPrimary);

       ctx.rotate(-card.angle);
       ctx.translate(-card.position.x, -card.position.y);
    });

    function drawField(ctx: CanvasRenderingContext2D, label: string, value: string, y: number, labelColor: string, valueColor: string) {
        // Centered layout for single field
        const centerX = 0;
        const gap = 15;

        ctx.textAlign = 'right';
        ctx.font = '600 10px "Inter", sans-serif'; 
        ctx.fillStyle = labelColor;
        ctx.fillText(label, centerX - 5, y); 
        
        ctx.textAlign = 'left';
        ctx.font = '600 11px "Inter", sans-serif'; 
        ctx.fillStyle = valueColor;
        ctx.fillText(value, centerX + 5, y); 
    }

    function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    return () => {
        Render.stop(render);
        Runner.stop(runner);
        if (render.canvas) {
            render.canvas.removeEventListener('mousemove', handleMouseMove);
        }
        Composite.clear(world, false);
        Engine.clear(engine);
    };
  }, [isReady, gravity, info, tetherLength]);

  return (
    <div ref={containerRef} className="relative h-[550px] w-0 flex justify-center items-start overflow-visible select-none">
        <canvas 
            ref={canvasRef} 
            className="pointer-events-auto absolute top-0 left-1/2 -translate-x-1/2" 
            style={{ width: '600px', height: '550px' }}
        />
    </div>
  );
};

export default Lanyard;