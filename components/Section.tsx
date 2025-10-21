import type React from 'react';
import AnimateOnScroll from './AnimateOnScroll';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  id: string;
  subtitle?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, id, subtitle }) => (
  <section id={id} className="py-12 sm:py-20">
    <div className="text-center mb-12">
      <AnimateOnScroll>
        <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          <span className="relative inline-block pb-3">
            {title}
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-accent rounded-full"></span>
          </span>
        </h2>
      </AnimateOnScroll>
      {subtitle && (
        <AnimateOnScroll delay={150}>
          <p className="mt-4 text-md text-secondary">{subtitle}</p>
        </AnimateOnScroll>
      )}
    </div>
    {children}
  </section>
);

export default Section;