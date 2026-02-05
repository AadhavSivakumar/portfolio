

export type ModalContent =
  | { type: 'text'; value: string }
  | { type: 'embed'; value: string; title: string }
  | { type: 'button'; text: string; link: string };

export type MediaItem = {
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string; // Optional: for video thumbnails
};

export interface Project {
  id: number | string;
  title: string;
  category: string;
  imageUrl: string;
  description: string; // card description
  technologies: string[];
  status: 'in-progress' | 'finished';
  modalContent: ModalContent[];
  media?: MediaItem[];
  modalTitle?: string;
  // Optional legacy fields for backward compatibility
  longDescription?: string; 
  liveUrl?: string;
  repoUrl?: string;
}

export interface Skill {
  name: string;
  imageUrl: string;
  description:string;
}

export interface SkillGroup {
  id: string;
  title: string;
  cardImageUrl: string;
  items: Skill[];
}