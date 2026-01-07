import React, { useState, useEffect, useRef } from 'react';
import { Project } from './types';
import Header from './components/Header';
import Section from './components/Section';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import SkillsSection from './components/SkillsSection';
import { FileIcon, FilesIcon } from './components/Icons';
import DocumentModal from './components/DocumentModal';
import SineWave from './components/SineWave';
import AnimateOnScroll from './components/AnimateOnScroll';
import { MAJOR_PROJECTS_DATA, ADDITIONAL_PROJECTS_DATA } from './components/projectData';


const App: React.FC = () => {
  const majorProjects: Project[] = MAJOR_PROJECTS_DATA;
  const additionalProjects: Project[] = ADDITIONAL_PROJECTS_DATA;
  
  const [selectedProject, setSelectedProject] = useState<{ project: Project; bounds: DOMRect; isCompact: boolean; } | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{ url: string; title: string; bounds: DOMRect } | null>(null);
  const [isContentVisible, setIsContentVisible] = useState(false);

  const resumeButtonRef = useRef<HTMLButtonElement>(null);
  const cvButtonRef = useRef<HTMLButtonElement>(null);

  // Define the About Me section as a Project object to reuse the Card/Modal architecture
  const aboutProject: Project = {
    id: 'about-me',
    title: 'Aadhav Sivakumar',
    category: 'Biography',
    // Only first two sentences visible on card
    description: "Hello! My name is Aadhav Sivakumar, and this website is meant to showcase projects I've worked on in the past and projects that I'm currently working on.",
    imageUrl: "https://aadhavsivakumar.github.io/Media/Gradpic.png",
    technologies: ["Robotics Engineer", "NYU Tandon", "Starship Technologies", "UCSC Alumni"],
    status: 'in-progress',
    modalContent: [
      {
        type: 'text',
        value: "Hello! My name is Aadhav Sivakumar, and this website is meant to showcase projects I've worked on in the past, and projects that I'm currently working on. You're also able to view my resume, an extended CV, or look through the different skills, software, and hardware I have worked with previously."
      },
      {
        type: 'text',
        value: "At the present, I am a Robot Technician at Starship Technologies, working at the Fordham University hub in the Bronx. I am currently located in Brooklyn, where I attend graduate school at NYU Tandon, working toward my Master's in Mechatronics and Robotics. I am also a TA at NYU, working with Professor Peng and helping with the Foundations of Robotics and Mathematics for Robotics courses. I was born and raised in the Bay Area in California, and I went to undergrad at the University of California, Santa Cruz campus, where I studied Robotics Engineering with a minor in Electrical Engineering."
      },
      {
        type: 'text',
        value: "I believe that the most effective engineering happens at the intersection of rigorous theory and reliable application. My experiences, ranging from deep academic research to maintaining active robot fleets in the field, have taught me that building intelligent systems requires not just understanding the algorithms, but also the environemental and societal impact of new technologies. I am driven by the challenge of bridging this gap, ensuring that complex robots are robust, efficient, and capable of solving real-world problems."
      }
    ]
  };
  
  useEffect(() => {
    // Layout geometry event
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('layout-changed'));
    }, 100); 
    return () => clearTimeout(timer);
  }, []);

  // Timer to fade in content halfway through sine wave animation (approx 800ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentVisible(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);


  const handleSelectProject = (project: Project, element: HTMLElement, isCompact: boolean) => {
    const bounds = element.getBoundingClientRect();
    setSelectedProject({ project, bounds, isCompact });
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };
  
  const handleSelectDocument = (url: string, title: string, element: HTMLElement) => {
    const bounds = element.getBoundingClientRect();
    setSelectedDocument({ url, title, bounds });
  };
  
  const handleCloseDocumentModal = () => {
      setSelectedDocument(null);
  };
  
  return (
    <div className="min-h-screen">
      
      {selectedProject && (
        <ProjectModal
          project={selectedProject.project}
          initialBounds={selectedProject.bounds}
          isCompact={selectedProject.isCompact}
          onClose={handleCloseModal}
        />
      )}
      {selectedDocument && (
        <DocumentModal
          url={selectedDocument.url}
          title={selectedDocument.title}
          initialBounds={selectedDocument.bounds}
          onClose={handleCloseDocumentModal}
        />
      )}
      
      <Header />
      <main>
        <section id="home" className="relative flex flex-col items-center justify-center text-center min-h-screen overflow-hidden">
            <SineWave />
            <div className={`relative z-10 flex flex-col items-center px-4 mt-20 sm:px-6 lg:px-8 pointer-events-none transition-all duration-1000 ease-out ${isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="relative w-56 h-56 mb-8 rounded-full overflow-hidden shadow-2xl">
                <img 
                    src="https://aadhavsivakumar.github.io/Media/frontpagepfp.JPG" 
                    alt="Aadhav Sivakumar" 
                    className="w-full h-full object-cover transform scale-105"
                />
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-primary sm:text-6xl md:text-7xl">
                  Aadhav Sivakumar
              </h1>
              <p className="mt-6 text-xl text-secondary max-w-2xl">
                Robotics Engineer working in Machine Learning, Control Systems, Computer Vision, and Embedded AI
              </p>
            </div>
        </section>
        
        <div className={`container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-opacity duration-1000 delay-300 ${isContentVisible ? 'opacity-100' : 'opacity-0'}`}>
          <Section title="About Me" id="about">
            <div className="flex justify-center w-full">
              <div className="w-full max-w-md">
                <AnimateOnScroll>
                  <ProjectCard
                    project={aboutProject}
                    onSelect={(p, e) => handleSelectProject(p, e, false)}
                    isHidden={selectedProject?.project.id === aboutProject.id}
                  />
                </AnimateOnScroll>
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
                            onClick={() => resumeButtonRef.current && handleSelectDocument('https://drive.google.com/file/d/1JgvGUhWX4Na0Vs0gropdxC01tM2kRiXc/preview', 'Resume', resumeButtonRef.current)}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          </Section>

          <Section title="Additional Projects" id="more-projects" subtitle="Select any card to learn more.">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          </Section>
          <div id="skills">
            <AnimateOnScroll>
              <SkillsSection />
            </AnimateOnScroll>
          </div>
        </div>
      </main>
      
      <footer className={`border-t border-border mt-12 transition-opacity duration-1000 delay-500 ${isContentVisible ? 'opacity-100' : 'opacity-0'}`}>
        <AnimateOnScroll>
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center py-8 text-secondary">
            <p>&copy; {new Date().getFullYear()} Aadhav Sivakumar. All rights reserved.</p>
          </div>
        </AnimateOnScroll>
      </footer>
    </div>
  );
};

export default App;