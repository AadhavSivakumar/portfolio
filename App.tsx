import React, { useState, useEffect, useRef } from 'react';
import { Project } from './types';
import Header from './components/Header';
import Section from './components/Section';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import SkillsSection from './components/SkillsSection';
import { FileIcon, FilesIcon } from './components/Icons';
import ErrorBoundary from './components/ErrorBoundary';
import DocumentModal from './components/DocumentModal';
import SineWave from './components/SineWave';
import AnimateOnScroll from './components/AnimateOnScroll';
import OpeningAnimation from './components/OpeningAnimation';
import { MAJOR_PROJECTS_DATA, ADDITIONAL_PROJECTS_DATA } from './components/projectData';


const App: React.FC = () => {
  const majorProjects: Project[] = MAJOR_PROJECTS_DATA;
  const additionalProjects: Project[] = ADDITIONAL_PROJECTS_DATA;
  
  const [selectedProject, setSelectedProject] = useState<{ project: Project; bounds: DOMRect; isCompact: boolean; } | null>(null);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ url: string; title: string; bounds: DOMRect } | null>(null);
  const [isDocumentModalClosing, setIsDocumentModalClosing] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  const resumeButtonRef = useRef<HTMLButtonElement>(null);
  const cvButtonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    const handleResize = () => {
        setIsPortrait(window.innerWidth / window.innerHeight < 1);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    // When the app loads, the layout is now static.
    // Dispatch an event to notify components (like the Header) that they can calculate their final geometry.
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('layout-changed'));
    }, 100); // A small delay to ensure DOM has updated
    return () => clearTimeout(timer);
  }, []);


  const handleSelectProject = (project: Project, element: HTMLElement, isCompact: boolean) => {
    setIsModalClosing(false);
    const bounds = element.getBoundingClientRect();
    setSelectedProject({ project, bounds, isCompact });
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };
  
  const handleStartFalling = () => {
    setIsModalClosing(true);
  };

  const handleSelectDocument = (url: string, title: string, element: HTMLElement) => {
    setIsDocumentModalClosing(false);
    const bounds = element.getBoundingClientRect();
    setSelectedDocument({ url, title, bounds });
  };
  
  const handleCloseDocumentModal = () => {
      setSelectedDocument(null);
  };
  
  const handleStartDocumentFalling = () => {
      setIsDocumentModalClosing(true);
  };

  const isBackdropVisible = (selectedProject !== null && !isModalClosing) || (selectedDocument !== null && !isDocumentModalClosing);

  return (
    <OpeningAnimation>
      <div className="min-h-screen">
        <div 
          id="hover-backdrop"
          className={`
            fixed inset-0 z-30 transition-all duration-300
            ${isBackdropVisible
              ? 'opacity-100 bg-surface/75 backdrop-blur'
              : 'opacity-0 pointer-events-none'
            }
          `}
          aria-hidden="true"
        ></div>
        
        {selectedProject && (
          <ProjectModal
            project={selectedProject.project}
            initialBounds={selectedProject.bounds}
            isCompact={selectedProject.isCompact}
            onClose={handleCloseModal}
            onStartFalling={handleStartFalling}
          />
        )}
        {selectedDocument && (
          <DocumentModal
            url={selectedDocument.url}
            title={selectedDocument.title}
            initialBounds={selectedDocument.bounds}
            onClose={handleCloseDocumentModal}
            onStartFalling={handleStartDocumentFalling}
          />
        )}
        
        <Header />
        <main>
          <section id="home" className="relative flex flex-col items-center justify-center text-center min-h-screen overflow-hidden">
              <SineWave />
              <div className="relative z-10 flex flex-col items-center px-4 mt-20 sm:px-6 lg:px-8 pointer-events-none">
                <div className="relative w-56 h-56 mb-8 rounded-full overflow-hidden shadow-2xl">
                  <img 
                      src="https://aadhavsivakumar.github.io/Images/frontpagepfp.JPG" 
                      alt="Aadhav Sivakumar" 
                      className="w-full h-full object-cover transform scale-105"
                  />
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight text-primary sm:text-6xl md:text-7xl">
                    Aadhav Sivakumar
                </h1>
                <p className="mt-6 text-xl text-secondary max-w-2xl">
                  Robotics Engineer Specializing in Embedded AI and Autonomous Systems
                </p>
              </div>
          </section>
          
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Section title="About Me" id="about">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                <AnimateOnScroll className="md:col-span-1 flex justify-center">
                    <img src="https://aadhavsivakumar.github.io/Images/Gradpic.png" alt="About me" className="rounded-lg shadow-2xl w-full max-w-sm"/>
                </AnimateOnScroll>
                <div className="md:col-span-2 text-lg text-secondary space-y-4">
                    <AnimateOnScroll delay={150}><p>Hello! I'm a dedicated Robotics Engineer with a strong background in embedded systems, AI, and creating autonomous solutions. I graduated from UC Santa Cruz with a Bachelor's in Robotics Engineering and a minor in Electrical Engineering, and I'm currently pursuing a Master's in Mechatronics and Robotics at NYU Tandon School of Engineering. My journey began with a curiosity for how machines interact with the world, leading me to a career focused on building intelligent systems that solve real-world problems.</p></AnimateOnScroll>
                    <AnimateOnScroll delay={250}><p>Currently, I'm a Robot Technician at Starship Technologies. I specialize in the ROS ecosystem, C++, and Python, developing robust software for robotic hardware. My expertise ranges from designing control systems and implementing computer vision algorithms to integrating sensors and developing for embedded platforms.</p></AnimateOnScroll>
                    <AnimateOnScroll delay={350}><p>Outside of engineering, I enjoy building personal robotics projects, exploring the latest in AI research, and hiking to find new perspectives.</p></AnimateOnScroll>
                </div>
              </div>
            </Section>

            <Section title="Resume/CV" id="resume">
                <div className="text-center">
                    <AnimateOnScroll>
                      <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">For a detailed overview of my work experience, education, and professional background, please view my resume. For a more comprehensive version, my extended CV is also available.</p>
                    </AnimateOnScroll>
                    <AnimateOnScroll delay={150}>
                      <div className="flex justify-center items-center gap-4 flex-wrap">
                          <button
                              ref={resumeButtonRef}
                              onClick={() => resumeButtonRef.current && handleSelectDocument('https://drive.google.com/file/d/1YHd3-1T750Vm32hwAeqEM8gU9rqQbu7r/preview', 'Resume', resumeButtonRef.current)}
                              className={`relative group inline-flex items-center justify-center gap-2 overflow-hidden text-primary font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg bg-surface/30 dark:bg-surface/20 backdrop-blur border border-black/15 dark:border-white/25 hover:shadow-xl hover:-translate-y-1 ${selectedDocument?.title === 'Resume' ? 'opacity-0 scale-95 invisible' : 'visible'}`}
                          >
                              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/50 to-accent transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
                              <span className="relative z-10 flex items-center gap-2">
                                  <FileIcon />
                                  <span>View Resume</span>
                              </span>
                          </button>
                          <button
                              ref={cvButtonRef}
                              onClick={() => cvButtonRef.current && handleSelectDocument('https://drive.google.com/file/d/11WRObmZOizFs6jlhbsQlfv-9DkBqSq0N/preview', 'Extended CV', cvButtonRef.current)}
                              className={`relative group inline-flex items-center justify-center gap-2 overflow-hidden text-primary font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg bg-surface/30 dark:bg-surface/20 backdrop-blur border border-black/15 dark:border-white/25 hover:shadow-xl hover:-translate-y-1 ${selectedDocument?.title === 'Extended CV' ? 'opacity-0 scale-95 invisible' : 'visible'}`}
                          >
                              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/50 to-accent transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
                               <span className="relative z-10 flex items-center gap-2">
                                  <FilesIcon />
                                  <span>View Extended CV</span>
                              </span>
                          </button>
                      </div>
                    </AnimateOnScroll>
                </div>
            </Section>

            <Section title="Major Projects" id="projects" subtitle="Select any card to learn more.">
              <ErrorBoundary fallback={<div className="text-center p-8 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-700">Could not display major projects.</div>}>
                <div className={`grid ${isPortrait ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-3'} gap-8`}>
                  {majorProjects.map((project, index) => (
                    <AnimateOnScroll key={project.id} delay={index * 150}>
                      <ProjectCard
                        project={project}
                        onSelect={(p, e) => handleSelectProject(p, e, false)}
                        isHidden={selectedProject?.project.id === project.id}
                      />
                    </AnimateOnScroll>
                  ))}
                </div>
              </ErrorBoundary>
            </Section>

            <Section title="Additional Projects" id="more-projects" subtitle="Select any card to learn more.">
              <ErrorBoundary fallback={<div className="text-center p-8 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-700">Could not display additional projects.</div>}>
                <div className={`grid ${isPortrait ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'} gap-6`}>
                  {additionalProjects.map((project, index) => (
                    <AnimateOnScroll key={project.id} delay={index * 75}>
                      <ProjectCard
                        project={project}
                        onSelect={(p, e) => handleSelectProject(p, e, true)}
                        isCompact={true}
                        isHidden={selectedProject?.project.id === project.id}
                      />
                    </AnimateOnScroll>
                  ))}
                </div>
              </ErrorBoundary>
            </Section>
            <div id="skills">
              <AnimateOnScroll>
                <SkillsSection />
              </AnimateOnScroll>
            </div>
          </div>
        </main>
        
        <footer className="border-t border-border mt-12">
          <AnimateOnScroll>
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center py-8 text-secondary">
              <p>&copy; {new Date().getFullYear()} Aadhav Sivakumar. All rights reserved.</p>
            </div>
          </AnimateOnScroll>
        </footer>
      </div>
    </OpeningAnimation>
  );
};

export default App;