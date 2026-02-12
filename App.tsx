import React, { useState, useEffect, useRef } from 'react';
import { Project } from './types';
import Header from './components/Header';
import Section from './components/Section';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import SkillsSection from './components/SkillsSection';
import StatsSection from './components/StatsSection';
import { FileIcon, FilesIcon, PaperGradeIcon, MailIcon } from './components/Icons';
import DocumentModal from './components/DocumentModal';
import ContactModal from './components/PdfModal'; // Re-using existing component structure
import SineWave from './components/SineWave';
import AnimateOnScroll from './components/AnimateOnScroll';
import GlassBadge from './components/GlassBadge';
import Lanyard from './components/Lanyard';
import { MAJOR_PROJECTS_DATA, ADDITIONAL_PROJECTS_DATA } from './components/projectData';

// Lanyard Configurations - Moved outside component to maintain reference stability and prevent re-renders on state changes
const leftLanyards = [
    { name: 'Dublin High', role: 'High School', id: '2016-2020', exp: '2020', imageUrl: 'https://aadhavsivakumar.github.io/Media/lanyardimgs/DHS.jpg' },
    { name: 'UCSC', role: 'Undergraduate', id: '2020-2024', exp: '2024', imageUrl: 'https://aadhavsivakumar.github.io/Media/lanyardimgs/UCSC.png' },
    { name: 'NYU', role: 'Graduate', id: '2024-2026', exp: '2026', imageUrl: 'https://aadhavsivakumar.github.io/Media/lanyardimgs/NYU.jpg' }
];

const rightLanyards = [
    { name: 'Roboflow', role: 'Field Engineer', id: 'Universe', exp: '???', imageUrl: 'https://aadhavsivakumar.github.io/Media/lanyardimgs/Roboflow.png' },
    { name: 'Starship', role: 'Robot Technician', id: 'Technician', exp: '2025', imageUrl: 'https://aadhavsivakumar.github.io/Media/lanyardimgs/Starship.jpg' },
    { name: 'Researcher', role: 'TML @ UCSC, CREO @ NYU', id: 'Research', exp: '2024/6', imageUrl: 'https://aadhavsivakumar.github.io/Media/lanyardimgs/Researcher.jpg' }
];

const App: React.FC = () => {
  const majorProjects: Project[] = MAJOR_PROJECTS_DATA;
  const additionalProjects: Project[] = ADDITIONAL_PROJECTS_DATA;
  
  const [selectedProject, setSelectedProject] = useState<{ project: Project; bounds: DOMRect; isCompact: boolean; } | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{ url: string; title: string; bounds: DOMRect } | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalBounds, setContactModalBounds] = useState<DOMRect | null>(null);
  const [isContentVisible, setIsContentVisible] = useState(false);
  
  const resumeButtonRef = useRef<HTMLButtonElement>(null);
  const cvButtonRef = useRef<HTMLButtonElement>(null);
  const undergradTranscriptRef = useRef<HTMLButtonElement>(null);
  const gradTranscriptRef = useRef<HTMLButtonElement>(null);

  // Define the About Me section as a Project object to reuse the Card/Modal architecture
  const aboutProject: Project = {
    id: 'about-me',
    title: 'Aadhav Sivakumar',
    category: 'Biography',
    // Only first two sentences visible on card
    description: "Hello! My name is Aadhav Sivakumar, and this website is meant to showcase projects I've worked on in the past and projects that I'm currently working on.",
    imageUrl: "https://aadhavsivakumar.github.io/Media/Gradpic.png",
    technologies: ["Robotics Engineer"],
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

  const handleOpenContact = (event: React.MouseEvent<HTMLElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      setContactModalBounds(bounds);
      setIsContactModalOpen(true);
  };
  
  const handleCloseContact = () => {
      setIsContactModalOpen(false);
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
      {isContactModalOpen && (
          <ContactModal 
            initialBounds={contactModalBounds || { top: 0, left: 0, width: 0, height: 0 } as DOMRect}
            onClose={handleCloseContact}
          />
      )}
      
      <Header onContactClick={handleOpenContact} />
      <main>
        <section id="home" className="relative flex flex-col items-center justify-center text-center min-h-screen overflow-hidden">
            <SineWave />
            <div className="relative z-10 flex flex-col items-center px-4 mt-20 sm:px-6 lg:px-8 pointer-events-none">
              
              <div className={`flex flex-col items-center transition-all duration-1000 ease-out ${isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="relative w-56 h-56 mb-8 rounded-full overflow-hidden shadow-2xl">
                    <img 
                        src="https://aadhavsivakumar.github.io/Media/frontpagepfp.JPG" 
                        alt="Aadhav Sivakumar" 
                        className="w-full h-full object-cover transform scale-105"
                    />
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight text-primary sm:text-6xl md:text-7xl mb-8">
                    Aadhav Sivakumar
                </h1>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3">
                 {['Python', 'C++', 'ROS', 'Machine Learning', 'Computer Vision', 'Control Systems', 'Embedded AI'].map((tech, i) => (
                    <GlassBadge 
                        key={tech} 
                        className={`${isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        style={{ transitionDelay: `${i * 100 + 300}ms` }}
                        onClick={() => {
                            const sectionId = tech === 'Machine Learning' || tech === 'Computer Vision' ? 'projects' : 'skills';
                            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        {tech}
                    </GlassBadge>
                 ))}
              </div>

               {/* Removed the down arrow button div */}
            </div>
        </section>
        
        <div className={`container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-opacity duration-1000 delay-300 ${isContentVisible ? 'opacity-100' : 'opacity-0'}`}>
          <Section title="About Me" id="about">
            <div className="relative w-full max-w-7xl mx-auto flex justify-center items-center py-4">
               
               {/* Left Lanyards (Desktop Only) - Absolutely Positioned */}
               {/* Increased padding to pr-80 (20rem) to clear card. Increased gap to 48 (12rem) for spacing */}
               <div className="hidden lg:flex absolute left-0 top-0 bottom-0 w-1/2 justify-end items-start pr-80 pointer-events-none z-20">
                   <div className="flex gap-48 pointer-events-auto">
                     {leftLanyards.map((l, i) => (
                         <div key={l.name} className="transition-all duration-300" style={{ marginTop: `${i * 20}px` }}>
                              <Lanyard info={l} tetherLength={150 + (i * 10)} />
                         </div>
                     ))}
                   </div>
               </div>

               {/* Center Card - In Flow, Centered */}
               <div className="w-full max-w-md relative z-30 shrink-0">
                <AnimateOnScroll className="w-full">
                  <ProjectCard
                    project={aboutProject}
                    onSelect={(p, e) => handleSelectProject(p, e, false)}
                    isHidden={selectedProject?.project.id === aboutProject.id}
                  />
                </AnimateOnScroll>
              </div>

               {/* Right Lanyards (Desktop Only) - Absolutely Positioned */}
               {/* Increased padding to pl-80 (20rem). Increased gap to 48 (12rem) for spacing */}
               <div className="hidden lg:flex absolute right-0 top-0 bottom-0 w-1/2 justify-start items-start pl-80 pointer-events-none z-20">
                   <div className="flex gap-48 pointer-events-auto">
                     {rightLanyards.map((l, i) => (
                         <div 
                             key={l.name} 
                             className="transition-all duration-300" 
                             style={{ 
                                 marginTop: `${(rightLanyards.length - 1 - i) * 20}px`,
                                 zIndex: rightLanyards.length - i // Inverse stacking: React (0) gets highest z-index
                             }}
                         >
                              <Lanyard info={l} tetherLength={150 + ((rightLanyards.length - 1 - i) * 10)} />
                         </div>
                     ))}
                   </div>
               </div>

            </div>
          </Section>

          <Section title="Resume, CV, and Transcripts" id="resume">
              <div className="text-center">
                  <AnimateOnScroll>
                    <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">For a detailed overview of my work experience, education, and professional background, please view my resume. For a more comprehensive version, my extended CV is also available. You can also view my academic transcripts below.</p>
                  </AnimateOnScroll>
                  <AnimateOnScroll delay={150}>
                    <div className="flex flex-col gap-6 items-center">
                        <div className="flex justify-center items-center gap-6 flex-wrap">
                            <button
                                ref={resumeButtonRef}
                                onClick={() => resumeButtonRef.current && handleSelectDocument('https://drive.google.com/file/d/1JgvGUhWX4Na0Vs0gropdxC01tM2kRiXc/preview', 'Resume', resumeButtonRef.current)}
                                className={`group relative flex flex-col items-center justify-center gap-4 w-36 h-36 sm:w-44 sm:h-44 bg-surface rounded-xl shadow-lg border border-border hover:border-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${selectedDocument?.title === 'Resume' ? 'opacity-0 pointer-events-none' : ''}`}
                            >
                                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <FileIcon className="w-12 h-12 text-secondary group-hover:text-accent transition-colors duration-300 z-10" />
                                <span className="font-bold text-primary text-sm sm:text-base z-10">Resume</span>
                            </button>
                            <button
                                ref={cvButtonRef}
                                onClick={() => cvButtonRef.current && handleSelectDocument('https://drive.google.com/file/d/11WRObmZOizFs6jlhbsQlfv-9DkBqSq0N/preview', 'Extended CV', cvButtonRef.current)}
                                className={`group relative flex flex-col items-center justify-center gap-4 w-36 h-36 sm:w-44 sm:h-44 bg-surface rounded-xl shadow-lg border border-border hover:border-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${selectedDocument?.title === 'Extended CV' ? 'opacity-0 pointer-events-none' : ''}`}
                            >
                                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <FilesIcon className="w-12 h-12 text-secondary group-hover:text-accent transition-colors duration-300 z-10" />
                                <span className="font-bold text-primary text-sm sm:text-base z-10">Extended CV</span>
                            </button>
                        </div>
                        <div className="flex justify-center items-center gap-6 flex-wrap">
                            <button
                                ref={undergradTranscriptRef}
                                onClick={() => undergradTranscriptRef.current && handleSelectDocument('https://drive.google.com/file/d/1_QDb00FYIqoaMAUFQp8Ukwiw2WeaYVPg/preview', 'Undergraduate Transcript', undergradTranscriptRef.current)}
                                className={`group relative flex flex-col items-center justify-center gap-2 w-36 h-36 sm:w-44 sm:h-44 bg-surface rounded-xl shadow-lg border border-border hover:border-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${selectedDocument?.title === 'Undergraduate Transcript' ? 'opacity-0 pointer-events-none' : ''}`}
                            >
                                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <PaperGradeIcon grade="A" className="w-10 h-10 sm:w-12 sm:h-12 text-secondary group-hover:text-accent transition-colors duration-300 z-10" />
                                <span className="font-bold text-primary text-xs sm:text-base z-10 text-center leading-tight">Undergraduate<br/>Transcript</span>
                            </button>
                            <button
                                ref={gradTranscriptRef}
                                onClick={() => gradTranscriptRef.current && handleSelectDocument('https://drive.google.com/file/d/1wwtghhqCJjWordYjrPYAK1M2VDtH3Nc3/preview', 'Graduate Transcript', gradTranscriptRef.current)}
                                className={`group relative flex flex-col items-center justify-center gap-2 w-36 h-36 sm:w-44 sm:h-44 bg-surface rounded-xl shadow-lg border border-border hover:border-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${selectedDocument?.title === 'Graduate Transcript' ? 'opacity-0 pointer-events-none' : ''}`}
                            >
                                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <PaperGradeIcon grade="A+" className="w-10 h-10 sm:w-12 sm:h-12 text-secondary group-hover:text-accent transition-colors duration-300 z-10" />
                                <span className="font-bold text-primary text-xs sm:text-base z-10 text-center leading-tight">Graduate<br/>Transcript</span>
                            </button>
                        </div>
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

          <div id="activity">
             <StatsSection />
          </div>
        </div>

        {/* Call to Action Footer */}
        <section className="py-20 bg-surface/50 border-t border-border mt-12">
            <div className="container mx-auto px-4 text-center">
                <AnimateOnScroll>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Ready to Build the Future?</h2>
                    <p className="text-lg text-secondary max-w-2xl mx-auto mb-10">
                        I'm always open to discussing new opportunities in Robotics, Machine Learning, and Mechatronics. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                    </p>
                    <button 
                        onClick={handleOpenContact}
                        className="inline-flex items-center gap-3 bg-accent text-white dark:text-black font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg group"
                    >
                        <MailIcon className="w-6 h-6 group-hover:animate-bounce" />
                        Get In Touch
                    </button>
                </AnimateOnScroll>
            </div>
        </section>
      </main>
      
      <footer className={`border-t border-border bg-background transition-opacity duration-1000 ${isContentVisible ? 'opacity-100' : 'opacity-0'}`}>
        <AnimateOnScroll>
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center py-8 text-secondary flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} Aadhav Sivakumar. All rights reserved.</p>
            <p className="text-sm">Built with React, TypeScript & Tailwind CSS</p>
          </div>
        </AnimateOnScroll>
      </footer>
    </div>
  );
};

export default App;