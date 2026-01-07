import { Project } from '../types';

export const MAJOR_PROJECTS_DATA: Project[] = [
  // 1.json
  {
    "id": 1,
    "title": "Project Millet",
    "category": "Autonomous Drone",
    "description": "Developing a ROS-based autonomous drone utilizing a Pixhawk 6x for precise agricultural applications. This ongoing project focuses on implementing robust PID control for stable flight and targeted payload delivery.",
    "imageUrl": "https://aadhavsivakumar.github.io/Media/projects/a_millet/1.mp4",
    "technologies": ["SLAM", "ROS", "Pixhawk 6x"],
    "status": "in-progress",
    "modalContent": [
      {
        "type": "text",
        "value": "Developing a ROS-based autonomous drone utilizing a Pixhawk 6x for precise agricultural applications. This ongoing project focuses on implementing robust PID control for stable flight and targeted payload delivery, aiming to enhance farming efficiency."
      }
    ],
    "media": [
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/a_millet/2.mp4"
      },
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/a_millet/3.mp4"
      },
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/a_millet/4.mp4"
      }
    ]
  },
  // Swapped: Reinforcement Learning & Optimal Control (formerly Additional 'd')
  {
    "id": "d",
    "title": "Reinforcement Learning & Optimal Control",
    "category": "Robotics & Control",
    "description": "Exploring advanced control strategies through model predictive control and deep reinforcement learning. This research-focused project implements algorithms like PPO in complex simulated environments.",
    "imageUrl": "https://aadhavsivakumar.github.io/Media/projects/l_reinforcementlearning/1.mp4",
    "technologies": ["MPC", "PPO", "DQN", "Isaac Sim"],
    "status": "finished",
    "modalContent": [
      {
        "type": "text",
        "value": "Exploring advanced control strategies through model predictive control (MPC) and deep reinforcement learning. This research-focused project implements state-of-the-art algorithms like PPO and DQN within high-fidelity physics simulations like Isaac Sim."
      },
      {
        "type": "text",
        "value": "The goal is to bridge the gap between simulation and reality for complex robotic tasks, ensuring robust performance under uncertainty and dynamic environmental conditions."
      }
    ]
  },
  // 3.json
  {
    "id": 3,
    "title": "Glass-2-Bot",
    "category": "Telerobotics",
    "description": "Architected a telerobotic system integrating Google Glass with a robot arm, enabling intuitive remote object manipulation. Leveraged Python and computer vision to translate user gaze and gestures into precise robotic actions.",
    "imageUrl": "https://aadhavsivakumar.github.io/Media/projects/c_glass2bot/1.mp4",
    "technologies": ["Google Glass", "Telerobotics"],
    "status": "finished",
    "modalContent": [
      {
        "type": "text",
        "value": "Architected a telerobotic system integrating Google Glass with a robot arm, enabling intuitive remote object manipulation. Leveraged Python and computer vision to translate user gaze and gestures into precise robotic actions, demonstrating a novel human-robot interface."
      },
      {
        "type": "embed",
        "value": "https://aadhavsivakumar.github.io/projectpdf/Adv__Mechatronics_Final_Report.pdf",
        "title": "Project Documentation PDF"
      }
    ]
  },
  // 4.json
  {
    "id": 4,
    "title": "SMART compost sorting",
    "category": "Robotics & Computer Vision",
    "description": "Designed and implemented a robotic compost sorting system using a Franka Emika arm and depth-sensing computer vision. Developed within a ROS framework to automate the identification and separation of contaminants.",
    "imageUrl": "https://aadhavsivakumar.github.io/Media/projects/d_SMARTcompost/1.mp4",
    "technologies": ["Franka Emika Robot", "Computer Vision", "ROS"],
    "status": "finished",
    "modalContent": [
      {
        "type": "text",
        "value": "Designed and implemented a robotic compost sorting system using a Franka Emika arm and depth-sensing computer vision. Developed within a ROS framework, this project successfully automated the identification and separation of contaminants from organic waste streams."
      },
      {
        "type": "button",
        "link": "https://aadhavsivakumar.github.io/projectpdf/Capstone_final_report.pdf",
        "text": "Project Documentation"
      }
    ],
    "media": [
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/d_SMARTcompost/2.mp4"
      },
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/d_SMARTcompost/3.mp4"
      },
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/d_SMARTcompost/4.mp4"
      },
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/d_SMARTcompost/5.mp4"
      },
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/d_SMARTcompost/6.mp4"
      },
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/d_SMARTcompost/7.mp4"
      },
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/d_SMARTcompost/8.mp4"
      }
    ]
  },
  // Swapped: Robot Perception (formerly Additional 'e')
  {
    "id": "e",
    "title": "Robot Perception",
    "category": "Computer Vision",
    "description": "Implementing cutting-edge computer vision techniques for robotic scene understanding. Utilizing diffusion models and advanced segmentation for robust object tracking and environmental interaction.",
    "imageUrl": "https://aadhavsivakumar.github.io/Media/projects/m_robotperception/1.mp4",
    "technologies": ["Diffusion Models", "Object Segmentation"],
    "status": "finished",
    "modalContent": [
      {
        "type": "text",
        "value": "Implementing cutting-edge computer vision techniques for robotic scene understanding. This project focuses on utilizing diffusion models and advanced object segmentation algorithms to provide robots with a deep understanding of their physical surroundings."
      },
      {
        "type": "text",
        "value": "By integrating these perception layers with control stacks, we enable more autonomous and reliable navigation and manipulation in cluttered, real-world environments."
      }
    ]
  },
  // 6.json
  {
    "id": 6,
    "title": "Stockbot: Grocery Robotics",
    "category": "Robotics & Simulation",
    "description": "Developed a comprehensive simulation in Mujoco for an autonomous grocery restocking robot. Engineered kinematic models and path-planning algorithms in Python to optimize efficiency in a retail environment.",
    "imageUrl": "https://aadhavsivakumar.github.io/Media/projects/f_stockbot/1.mp4",
    "technologies": ["Python", "Mujoco", "Kinematics"],
    "status": "finished",
    "modalContent": [
      {
        "type": "text",
        "value": "Developed a comprehensive simulation in Mujoco for an autonomous grocery restocking robot. Engineered kinematic models and path-planning algorithms in Python to optimize efficiency and accuracy in a dynamic retail environment."
      },
      {
        "type": "text",
        "value": "This project was a capstone for my undergraduate studies, showcasing the integration of advanced simulation with robotic control theory. The final system demonstrated a significant potential for reducing manual labor and improving inventory management in a simulated retail setting."
      },
      {
        "type": "button",
        "text": "View Project",
        "link": "https://sites.google.com/ucsc.edu/stockbot/home"
      }
    ]
  }
];

export const ADDITIONAL_PROJECTS_DATA: Project[] = [
  // g.json
  {
    "id": "g",
    "title": "CV controlled Desktop Robot arm",
    "category": "Robotics & Computer Vision",
    "description": "Building a desktop robotic arm controlled by computer vision running on a Raspberry Pi.",
    "imageUrl": "https://aadhavsivakumar.github.io/Media/projects/g_CVarm/1.mp4",
    "technologies": ["MediaPipe", "VLA model"],
    "status": "in-progress",
    "modalContent": [
      {
        "type": "text",
        "value": "Building a desktop robotic arm controlled by computer vision running on a Raspberry Pi. This project explores real-time object recognition and manipulation, creating an interactive and intelligent automated workspace assistant."
      },
      {
        "type": "button",
        "text": "View on GitHub",
        "link": "https://github.com/AadhavSivakumar/CV-controlled-mini-servo-arm"
      }
    ]
  },
  // h.json
  {
    "id": "h",
    "title": "Ur10e MuJoCo Simulation",
    "category": "Simulation",
    "description": "Created a 3D simulation of the game 'Fruit Ninja' using Python.",
    "imageUrl": "https://aadhavsivakumar.github.io/Media/projects/h_ur10emujocosim/1.mp4",
    "technologies": ["Python", "Mujoco"],
    "status": "finished",
    "modalContent": [
      {
        "type": "text",
        "value": "Created a 3D simulation of the game 'Fruit Ninja' using Python, applying principles of physics-based modeling and 3D graphics to develop an interactive and engaging virtual experience."
      },
      {
        "type": "button",
        "text": "View on GitHub",
        "link": "https://github.com/AadhavSivakumar/MujocoSim"
      }
    ],
    "media": [
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/h_ur10emujocosim/2.mp4"
      },
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/h_ur10emujocosim/3.mp4"
      },
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/h_ur10emujocosim/4.mp4"
      },
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/h_ur10emujocosim/5.mp4"
      }
    ]
  },
  // Swapped: Machine Learning & AI Instructor (formerly index 7)
  {
    "id": "f",
    "title": "Machine Learning & AI Instructor",
    "category": "AI Education",
    "description": "",
    "imageUrl": "https://aadhavsivakumar.github.io/Media/projects/n_machinelearninginstructor/1.mp4",
    "technologies": ["LLMs", "Edge AI"],
    "status": "finished",
    "modalContent": []
  },
  // Swapped: SoleGait Foot Sensor (formerly index 5)
  {
    "id": 2,
    "title": "SoleGait Foot Sensor",
    "category": "IoT & Biomedical",
    "description": "Engineering an IoT-enabled foot sensor using an Arduino for real-time, high-fidelity gait analysis.",
    "imageUrl": "https://aadhavsivakumar.github.io/Media/projects/b_solegait/1.mp4",
    "technologies": ["C++", "RTOS", "Comm Protocols"],
    "status": "finished",
    "modalContent": [
      {
        "type": "text",
        "value": "Engineering an IoT-enabled foot sensor using an Arduino for real-time, high-fidelity gait analysis. This work-in-progress integrates custom communication protocols to provide actionable biometric data for healthcare and athletic performance."
      },
      {
        "type": "text",
        "value": "This project showcases my skills in embedded systems design, sensor integration, and data transmission. The goal is to create a low-cost, effective tool for physical therapists and athletes to monitor and improve gait patterns, preventing injuries and enhancing performance."
      },
      {
        "type": "embed",
        "value": "https://aadhavsivakumar.github.io/projectpdf/Biomedical_devices_research_paper.pdf",
        "title": "Project Documentation PDF"
      }
    ],
    "media": [
      {
        "type": "image",
        "url": "https://aadhavsivakumar.github.io/Media/projects/b_solegait/2.png"
      }
    ]
  },
  // c.json
  {
    "id": "c",
    "title": "MATE ROV",
    "category": "Robotics",
    "description": "Contributed to a competitive MATE ROV team by designing and building electronic subsystems for an underwater drone.",
    "imageUrl": "https://aadhavsivakumar.github.io/Media/projects/k_MATE/1.jpeg",
    "technologies": ["C++", "EAGLE", "Ultrasonic"],
    "status": "finished",
    "modalContent": [
      {
        "type": "text",
        "value": "Contributed to a competitive MATE ROV team by designing and building electronic subsystems for an underwater drone. Utilized EAGLE for PCB design and integrated ultrasonic sensors for complex subsea navigation and task execution."
      }
    ]
  },
  // Swapped: PONG (formerly index 3)
  {
    "id": "b",
    "title": "PONG",
    "category": "Embedded Systems",
    "description": "Constructed a standalone version of the classic game PONG using an Arduino and an LED matrix.",
    "imageUrl": "https://aadhavsivakumar.github.io/Media/projects/j_pong/1.mp4",
    "technologies": ["Arduino", "LED matrix"],
    "status": "finished",
    "modalContent": [
      {
        "type": "text",
        "value": "Constructed a standalone version of the classic game PONG using an Arduino and an LED matrix. This project involved low-level hardware interfacing and efficient programming to create a responsive and engaging game."
      },
      {
        "type": "embed",
        "value": "https://aadhavsivakumar.github.io/projectpdf/Advanced_Mechatronics_Project_1_report.pdf",
        "title": "Project Documentation (Coming Soon)"
      }
    ]
  },
  // 5.json
  {
    "id": 5,
    "title": "Tactile Manipulation sensor",
    "category": "Robotics & Hardware",
    "description": "Designed and fabricated a novel tactile sensor on a flexible PCB using Altium Designer for advanced robotic manipulation.",
    "imageUrl": "https://aadhavsivakumar.github.io/Media/projects/e_tactilemanipulation/1.mp4",
    "technologies": ["C", "Altium Designer"],
    "status": "finished",
    "modalContent": [
      {
        "type": "text",
        "value": "Designed and fabricated a novel tactile sensor on a flexible PCB using Altium Designer for advanced robotic manipulation. This sensor provides nuanced data on grip force and shear direction, enhancing a robot's ability to handle delicate objects."
      },
      {
        "type": "button",
        "text": "View Organization",
        "link": "https://tml.engineering.ucsc.edu/"
      },
      {
        "type": "button",
        "text": "View Previous Research",
        "link": "https://tml.engineering.ucsc.edu/research/dexterous-manipulation/"
      }
    ],
    "media": [
      {
        "type": "image",
        "url": "https://aadhavsivakumar.github.io/Media/projects/e_tactilemanipulation/2.png"
      },
      {
        "type": "image",
        "url": "https://aadhavsivakumar.github.io/Media/projects/e_tactilemanipulation/3.JPG"
      },
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/e_tactilemanipulation/4.mp4"
      },
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/e_tactilemanipulation/5.mp4"
      }
    ]
  },
  // Swapped: Sand Table (formerly index 2)
  {
    "id": "a",
    "title": "Sand Table",
    "category": "Mechatronics",
    "description": "Engineered a 2R planar manipulator controlled by a Parallax Propeller MCU to draw intricate patterns in sand.",
    "imageUrl": "https://AadhavSivakumar.github.io/Media/projects/i_sandtable/1.mp4",
    "technologies": ["Parallax Propeller", "C++", "Kinematics"],
    "status": "finished",
    "modalContent": [
      {
        "type": "text",
        "value": "Engineered a 2R planar manipulator controlled by a Parallax Propeller MCU to draw intricate patterns in sand. Applied C++ and kinematic principles to translate digital designs into precise, physical motion."
      },
      {
        "type": "embed",
        "value": "https://aadhavsivakumar.github.io/projectpdf/Advanced_mechatronics_Project_2_report.pdf",
        "title": "Project Documentation (Coming Soon)"
      }
    ],
    "media": [
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/i_sandtable/2.mp4"
      },
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/i_sandtable/3.mp4"
      },
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/i_sandtable/4.mp4"
      },
      {
        "type": "video",
        "url": "https://aadhavsivakumar.github.io/Media/projects/i_sandtable/5.mp4"
      }
    ]
  }
];
