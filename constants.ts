import { SkillGroup } from './types';

const baseSkillImagePath = 'https://aadhavsivakumar.github.io/Media/skills/';
const deviconsBaseUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';

export const SKILL_GROUPS: SkillGroup[] = [
    {
        id: 'programming',
        title: 'Programming',
        cardImageUrl: 'https://api.iconify.design/mdi/code-braces.svg',
        items: [
            { name: 'Python', imageUrl: deviconsBaseUrl + 'python/python-original.svg', description: 'High-level, versatile language for web dev, data science, AI, scripting, and automation.' },
            { name: 'C / C++', imageUrl: deviconsBaseUrl + 'cplusplus/cplusplus-original.svg', description: 'Powerful languages for system programming, embedded systems, game engines, and performance-critical applications, with C++ adding object-oriented features.' },
            { name: 'Verilog', imageUrl: baseSkillImagePath + 'verilog.png', description: 'Hardware description language (HDL) for modeling electronic systems like FPGAs and ASICs.' },
            { name: 'ROS', imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ros/ros-original.svg', description: 'Flexible framework for writing robot software, simplifying complex robot behavior development.' },
            { name: 'Java', imageUrl: deviconsBaseUrl + 'java/java-original.svg', description: 'Class-based, object-oriented language for enterprise apps, Android development, and large systems.' },
            { name: 'HTML5 & CSS3', imageUrl: deviconsBaseUrl + 'html5/html5-original.svg', description: 'The fundamental languages for creating and styling web pages and applications, enabling rich multimedia, responsive design, and animations.' },
            { name: 'JavaScript', imageUrl: deviconsBaseUrl + 'javascript/javascript-original.svg', description: 'Essential for interactive web content; also used in non-browser environments via Node.js.' },
            { name: 'React', imageUrl: deviconsBaseUrl + 'react/react-original.svg', description: 'A JavaScript library for building user interfaces, widely used for creating single-page applications and dynamic UIs.' },
        ]
    },
    {
        id: 'robotics-control',
        title: 'Robotics & Control\nSystems',
        cardImageUrl: 'https://api.iconify.design/mdi/robot-industrial.svg',
        items: [
            { name: 'Franka Emika Robot', imageUrl: baseSkillImagePath + 'Franka-Emika-Panda-robot.png', description: 'Collaborative 7-DOF robot arm for research and industry, with sensitive torque sensors.' },
            { name: 'Pixhawk 6x', imageUrl: baseSkillImagePath + 'pixhawk.png', description: 'Advanced autopilot flight controller for drones and unmanned vehicles, based on FMUv6X standard.' },
            { name: 'Kinematics', imageUrl: 'https://api.iconify.design/mdi/axis-arrow-lock.svg?color=%23555555', description: 'Describing motion of objects and systems; crucial in robotics for arm positions and trajectories.' },
            { name: 'PID Control', imageUrl: 'https://api.iconify.design/mdi/tune-variant.svg?color=%23555555', description: 'Feedback mechanism for industrial control and robotics, correcting errors based on P, I, D terms.' },
            { name: 'Kalman Filtering', imageUrl: 'https://api.iconify.design/mdi/filter-outline.svg?color=%23555555', description: 'Algorithm for producing accurate estimates from noisy measurements over time.' },
            { name: 'Telerobotics', imageUrl: 'https://api.iconify.design/mdi/gamepad-variant-outline.svg?color=%23555555', description: 'Controlling semi-autonomous robots from a distance using wireless or tethered connections.' },
            { name: 'Comm Protocols', imageUrl: 'https://api.iconify.design/mdi/serial-port.svg?color=%23555555', description: 'Rules for data transmission (I2C, SPI, UART, CAN, Ethernet, Wi-Fi, Bluetooth).' },
            { name: 'Webots', imageUrl: baseSkillImagePath + 'webots.png', description: 'Open-source robot simulator for modeling, programming, and simulating robots.' },
            { name: 'Intel RealSense D435i', imageUrl: 'https://realsenseai.com/wp-content/uploads/2025/07/D435i.png', description: 'Depth camera offering high-quality depth data for indoor and outdoor environments, crucial for SLAM and object recognition.' },
            { name: 'MuJoCo', imageUrl: 'https://raw.githubusercontent.com/google-deepmind/mujoco_menagerie/main/boston_dynamics_spot/spot.png', description: 'Physics engine for detailed, efficient rigid body simulations with contacts.' },
        ]
    },
    {
        id: 'microcontrollers-boards',
        title: 'Microcontrollers\n& Boards',
        cardImageUrl: 'https://api.iconify.design/mdi/chip.svg',
        items: [
            { name: 'Arduino', imageUrl: baseSkillImagePath + 'Arduino.jpg', description: 'Open-source platform for interactive objects, popular for prototyping and education.' },
            { name: 'Raspberry Pi', imageUrl: baseSkillImagePath + 'raspberrypi.webp', description: 'Small single-board computers for robotics, IoT, home automation, and education.' },
            { name: 'Basys 3 FPGA', imageUrl: baseSkillImagePath + 'Basys3.webp', description: 'Entry-level FPGA board with Artix-7, used for learning digital logic with Verilog/VHDL.' },
            { name: 'STM32 Nucleo', imageUrl: baseSkillImagePath + 'STM32.webp', description: 'Affordable boards with STM32 MCUs (ARM Cortex-M) for prototyping and concept testing.' },
            { name: 'ESP32/8266', imageUrl: baseSkillImagePath + 'ESP32.jpg', description: 'Low-cost Wi-Fi & Bluetooth/BLE MCUs for IoT, home automation, and wireless sensors.' },
            { name: 'Infineon PSoC 4', imageUrl: baseSkillImagePath + 'psoc4.jpg', description: 'Programmable System-on-Chip with ARM Cortex-M0/M0+ and programmable analog/digital blocks.' },
            { name: 'Parallax Propeller', imageUrl: baseSkillImagePath + 'propeller.jpg', description: 'Multicore MCU with eight 32-bit cores for true parallel processing and deterministic timing.' },
            { name: 'Jetson Nano', imageUrl: baseSkillImagePath + 'jetsonnano.jpg', description: 'Small, powerful computer for accelerated AI in embedded apps like image classification.' },
        ]
    },
    {
        id: 'sensors-electronics',
        title: 'Sensors\n& Electronics',
        cardImageUrl: 'https://api.iconify.design/mdi/resistor-nodes.svg',
        items: [
            { name: 'ATI Multi-Axis Force/Torque', imageUrl: 'https://api.iconify.design/mdi/axis-arrow-info.svg?color=%23555555', description: 'Measures all six components of force/torque for robotics, haptics, product testing.' },
            { name: 'ORcad x Capture', imageUrl: baseSkillImagePath + 'OrCADCapture.webp', description: 'Cadence EDA tools for designing ICs, SoCs, and PCBs.' },
            { name: 'Ultrasonic', imageUrl: 'https://api.iconify.design/icon-park-outline/sound-wave.svg?color=%23555555', description: 'Measures distance by emitting/receiving ultrasonic waves for object detection/avoidance.' },
            { name: 'Flex Sensor', imageUrl: 'https://api.iconify.design/mdi/vector-curve.svg?color=%23555555', description: 'Variable resistor that changes resistance when bent, used to detect flexing motions.' },
            { name: 'Capacitive', imageUrl: 'https://api.iconify.design/mdi/gesture-tap.svg?color=%23555555', description: 'Detects changes in capacitance for touch sensing, proximity detection, liquid level sensing.' },
            { name: 'Piezoelectric', imageUrl: 'https://api.iconify.design/mdi/vibrate.svg?color=%23555555', description: 'Generates electric charge from mechanical stress; used as pressure sensors, accelerometers.' },
            { name: 'LED Matrix', imageUrl: 'https://api.iconify.design/mdi/dots-grid.svg?color=%23555555', description: '2D array of LEDs for displaying patterns, characters, or animations via individual control.' },
            { name: 'Pspice/LTspice', imageUrl: 'https://www.it.unlv.edu/sites/default/files/styles/250_width/public/sites/default/files/assets/software/logos/ltspice.png?itok=MVgB4Gip', description: 'SPICE-based analog circuit and digital logic simulation program for design verification.' },
            { name: 'IMU', imageUrl: 'https://img.icons8.com/ios-filled/50/555555/gyroscope.png', description: 'Measures body\'s specific force, angular rate, and orientation using accelerometers/gyroscopes.' },
        ]
    },
    {
        id: 'ai-ml-data',
        title: 'AI, Machine Learning\n& Data',
        cardImageUrl: 'https://api.iconify.design/mdi/brain.svg',
        items: [
            { name: 'Computer Vision', imageUrl: 'https://api.iconify.design/mdi/eye-check-outline.svg?color=%23555555', description: 'Enabling computers to "see" and interpret visual information like images and videos.' },
            { name: 'Gen AI API', imageUrl: 'https://api.iconify.design/mdi/robot-confused-outline.svg?color=%23555555', description: 'Using Generative AI APIs (ChatGPT, Gemini, Claude) for content generation, chatbots, etc.' },
            { name: 'Python (AI/Data Focus)', imageUrl: deviconsBaseUrl + 'python/python-original.svg', description: 'Widely used in AI/ML for its extensive libraries (TensorFlow, PyTorch, scikit-learn).' },
            { name: 'SQL', imageUrl: deviconsBaseUrl + 'postgresql/postgresql-original.svg', description: 'Essential language for managing and querying relational databases, crucial for data retrieval and manipulation in data science and AI applications.' },
            { name: 'MATLAB', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Matlab_Logo.png/667px-Matlab_Logo.png', description: 'Numerical computing environment for data analysis, algorithm development, simulation.' },
        ]
    },
    {
        id: 'design-fabrication',
        title: 'Design\n& Fabrication',
        cardImageUrl: 'https://api.iconify.design/mdi/printer-3d-nozzle-outline.svg',
        items: [
            { name: 'Bambu Lab Printer', imageUrl: baseSkillImagePath + 'bambu.webp', description: 'High-speed 3D printers with multi-material support (AMS) and advanced features.' },
            { name: 'Glowforge', imageUrl: baseSkillImagePath + 'glowforge.webp', description: 'Desktop laser cutter/engraver for precise designs on wood, acrylic, leather, etc.' },
            { name: 'SolidWorks', imageUrl: baseSkillImagePath + 'SOLIDWORKS.webp', description: 'CAD/CAE software for designing, simulating, and manufacturing products.' },
            { name: 'Fusion 360', imageUrl: baseSkillImagePath + 'fusion360.png', description: 'Cloud-based 3D CAD, CAM, CAE, PCB platform for product design and manufacturing.' },
            { name: 'Altium Designer', imageUrl: baseSkillImagePath + 'altium-designer.png', description: 'EDA software for PCB, FPGA, and embedded software design in a unified environment.' },
        ]
    },
    {
        id: 'specialized-tools',
        title: 'Specialized\nTools',
        cardImageUrl: 'https://api.iconify.design/mdi/toolbox-outline.svg',
        items: [
            { name: 'Oscilloscope', imageUrl: baseSkillImagePath + 'oscilloscope.jpg', description: 'Instrument for observing varying signal voltages, crucial for debugging electronic circuits.' },
            { name: 'Google Glass', imageUrl: baseSkillImagePath + 'googleglass.jpg', description: 'Optical head-mounted display for hands-free info access and AR applications.' },
            { name: 'Firebase', imageUrl: baseSkillImagePath + 'firebase.png', description: 'Google\'s platform for mobile/web app development with real-time databases, auth, and hosting.' },
            { name: 'NI DAQ', imageUrl: 'https://ni.scene7.com/is/image/ni/USB_6451_angled_spring_terminal_385x203_V2?fmt=png-alpha&scl=1', description: 'National Instruments hardware for measuring electrical/physical phenomena and converting to digital data.' },
            { name: 'Android Studio', imageUrl: baseSkillImagePath + 'AndroidStudio.png', description: 'Official IDE for Android app development, built on IntelliJ IDEA for coding, debugging, and testing.' },
        ]
    }
];