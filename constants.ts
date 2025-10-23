import { SkillGroup } from './types';

const baseSkillImagePath = 'https://aadhavsivakumar.github.io/Images/skills/';
const deviconsBaseUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';

export const SKILL_GROUPS: SkillGroup[] = [
    {
        id: 'programming-languages',
        title: 'Programming Languages',
        cardImageUrl: 'https://api.iconify.design/mdi/code-braces.svg',
        items: [
            { name: 'C / C++', imageUrl: deviconsBaseUrl + 'cplusplus/cplusplus-original.svg', description: 'Powerful languages for system programming, embedded systems, game engines, and performance-critical applications, with C++ adding object-oriented features.' },
            { name: 'Python', imageUrl: deviconsBaseUrl + 'python/python-original.svg', description: 'High-level, versatile language for web dev, data science, AI, scripting, and automation.' },
            { name: 'Java', imageUrl: deviconsBaseUrl + 'java/java-original.svg', description: 'Class-based, object-oriented language for enterprise apps, Android development, and large systems.' },
            { name: 'HTML5 & CSS3', imageUrl: deviconsBaseUrl + 'html5/html5-original.svg', description: 'The fundamental languages for creating and styling web pages and applications, enabling rich multimedia, responsive design, and animations.' },
            { name: 'JavaScript', imageUrl: deviconsBaseUrl + 'javascript/javascript-original.svg', description: 'Essential for interactive web content; also used in non-browser environments via Node.js.' },
            { name: 'Verilog', imageUrl: baseSkillImagePath + 'verilog.png', description: 'Hardware description language (HDL) for modeling electronic systems like FPGAs and ASICs.' },
        ]
    },
    {
        id: 'frameworks-libraries',
        title: 'Frameworks & Libraries',
        cardImageUrl: 'https://api.iconify.design/mdi/library-shelves.svg',
        items: [
            { name: 'React', imageUrl: deviconsBaseUrl + 'react/react-original.svg', description: 'A JavaScript library for building user interfaces, widely used for creating single-page applications and dynamic UIs.' },
            { name: 'ROS', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/ROS_logo.svg', description: 'Flexible framework for writing robot software, simplifying complex robot behavior development.' },
            { name: 'Firebase', imageUrl: baseSkillImagePath + 'firebase.png', description: 'Google\'s platform for mobile/web app development with real-time databases, auth, and hosting.' },
            { name: 'Android Studio', imageUrl: baseSkillImagePath + 'AndroidStudio.png', description: 'Official IDE for Android app development, built on IntelliJ IDEA for coding, debugging, and testing.' }
        ]
    },
    {
        id: 'robotics-control',
        title: 'Robotics & Control Systems',
        cardImageUrl: 'https://api.iconify.design/mdi/robot-industrial.svg',
        items: [
            { name: 'Franka Emika Robot', imageUrl: baseSkillImagePath + 'Franka-Emika-Panda-robot.png', description: 'Collaborative 7-DOF robot arm for research and industry, with sensitive torque sensors.' },
            { name: 'Pixhawk 6x', imageUrl: baseSkillImagePath + 'pixhawk.png', description: 'Advanced autopilot flight controller for drones and unmanned vehicles, based on FMUv6X standard.' },
            { name: 'Kinematics', imageUrl: 'https://api.iconify.design/mdi/axis-arrow-lock.svg?color=var(--icon-resting-color)', description: 'Describing motion of objects and systems; crucial in robotics for arm positions and trajectories.' },
            { name: 'PID Control', imageUrl: 'https://api.iconify.design/mdi/tune-variant.svg?color=var(--icon-resting-color)', description: 'Feedback mechanism for industrial control and robotics, correcting errors based on P, I, D terms.' },
            { name: 'Kalman Filtering', imageUrl: 'https://api.iconify.design/mdi/filter-outline.svg?color=var(--icon-resting-color)', description: 'Algorithm for producing accurate estimates from noisy measurements over time.' },
            { name: 'Telerobotics', imageUrl: 'https://api.iconify.design/mdi/gamepad-variant-outline.svg?color=var(--icon-resting-color)', description: 'Controlling semi-autonomous robots from a distance using wireless or tethered connections.' },
            { name: 'Comm Protocols', imageUrl: 'https://api.iconify.design/mdi/serial-port.svg?color=var(--icon-resting-color)', description: 'Rules for data transmission (I2C, SPI, UART, CAN, Ethernet, Wi-Fi, Bluetooth).' },
        ]
    },
    {
        id: 'microcontrollers-boards',
        title: 'Microcontrollers & Boards',
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
        title: 'Sensors & Electronics',
        cardImageUrl: 'https://api.iconify.design/mdi/resistor-nodes.svg',
        items: [
            { name: 'ATI Multi-Axis Force/Torque', imageUrl: 'https://api.iconify.design/mdi/axis-arrow-info.svg?color=var(--icon-resting-color)', description: 'Measures all six components of force/torque for robotics, haptics, product testing.' },
            { name: 'IMU', imageUrl: 'https://api.iconify.design/mdi/gyroscope.svg?color=var(--icon-resting-color)', description: 'Measures body\'s specific force, angular rate, and orientation using accelerometers/gyroscopes.' },
            { name: 'Ultrasonic', imageUrl: 'https://api.iconify.design/icon-park-outline/sound-wave.svg?color=var(--icon-resting-color)', description: 'Measures distance by emitting/receiving ultrasonic waves for object detection/avoidance.' },
            { name: 'Flex Sensor', imageUrl: 'https://api.iconify.design/mdi/vector-curve.svg?color=var(--icon-resting-color)', description: 'Variable resistor that changes resistance when bent, used to detect flexing motions.' },
            { name: 'Capacitive', imageUrl: 'https://api.iconify.design/mdi/gesture-tap.svg?color=var(--icon-resting-color)', description: 'Detects changes in capacitance for touch sensing, proximity detection, liquid level sensing.' },
            { name: 'Piezoelectric', imageUrl: 'https://api.iconify.design/mdi/vibrate.svg?color=var(--icon-resting-color)', description: 'Generates electric charge from mechanical stress; used as pressure sensors, accelerometers.' },
            { name: 'LED Matrix', imageUrl: 'https://api.iconify.design/mdi/dots-grid.svg?color=var(--icon-resting-color)', description: '2D array of LEDs for displaying patterns, characters, or animations via individual control.' },
            { name: 'NI DAQ', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/National_Instruments_logo.svg', description: 'National Instruments hardware for measuring electrical/physical phenomena and converting to digital data.' },
            { name: 'Pspice/LTspice', imageUrl: 'https://api.iconify.design/mdi/chart-line.svg?color=var(--icon-resting-color)', description: 'SPICE-based analog circuit and digital logic simulation program for design verification.' },
        ]
    },
    {
        id: 'ai-ml-data',
        title: 'AI, Machine Learning & Data',
        cardImageUrl: 'https://api.iconify.design/mdi/brain.svg',
        items: [
            { name: 'AI Vision', imageUrl: 'https://api.iconify.design/mdi/eye-check-outline.svg?color=var(--icon-resting-color)', description: 'Enabling computers to "see" and interpret visual information like images and videos.' },
            { name: 'Gen AI API', imageUrl: 'https://api.iconify.design/mdi/robot-confused-outline.svg?color=var(--icon-resting-color)', description: 'Using Generative AI APIs (ChatGPT, Gemini, Claude) for content generation, chatbots, etc.' },
            { name: 'Python (AI/Data Focus)', imageUrl: deviconsBaseUrl + 'python/python-original.svg', description: 'Widely used in AI/ML for its extensive libraries (TensorFlow, PyTorch, scikit-learn).' },
            { name: 'SQL', imageUrl: deviconsBaseUrl + 'postgresql/postgresql-original.svg', description: 'Essential language for managing and querying relational databases, crucial for data retrieval and manipulation in data science and AI applications.' },
            { name: 'MATLAB', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Matlab_Logo.png/667px-Matlab_Logo.png', description: 'Numerical computing environment for data analysis, algorithm development, simulation.' },
        ]
    },
    {
        id: 'design-fabrication',
        title: 'Design & Fabrication',
        cardImageUrl: 'https://api.iconify.design/mdi/printer-3d-nozzle-outline.svg',
        items: [
            { name: 'Google Glass', imageUrl: baseSkillImagePath + 'googleglass.jpg', description: 'Optical head-mounted display for hands-free info access and AR applications.' },
            { name: 'Bambu Lab Printer', imageUrl: baseSkillImagePath + 'bambu.webp', description: 'High-speed 3D printers with multi-material support (AMS) and advanced features.' },
            { name: 'Glowforge', imageUrl: baseSkillImagePath + 'glowforge.webp', description: 'Desktop laser cutter/engraver for precise designs on wood, acrylic, leather, etc.' },
        ]
    },
    {
        id: 'specialized-tools',
        title: 'Specialized Tools',
        cardImageUrl: 'https://api.iconify.design/mdi/toolbox-outline.svg',
        items: [
            { name: 'Webots', imageUrl: baseSkillImagePath + 'webots.png', description: 'Open-source robot simulator for modeling, programming, and simulating robots.' },
            { name: 'Test Automation', imageUrl: 'https://api.iconify.design/mdi/play-box-multiple-outline.svg?color=var(--icon-resting-color)', description: 'Using software to execute pre-scripted tests for quality assurance and faster development cycles.' },
            { name: 'SolidWorks', imageUrl: baseSkillImagePath + 'SOLIDWORKS.webp', description: 'CAD/CAE software for designing, simulating, and manufacturing products.' },
            { name: 'Fusion 360', imageUrl: baseSkillImagePath + 'fusion360.png', description: 'Cloud-based 3D CAD, CAM, CAE, PCB platform for product design and manufacturing.' },
            { name: 'AutoCAD', imageUrl: baseSkillImagePath + 'autocad.png', description: 'Commercial CAD and drafting software for 2D/3D design and documentation.' },
            { name: 'Altium Designer', imageUrl: baseSkillImagePath + 'altium-designer.png', description: 'EDA software for PCB, FPGA, and embedded software design in a unified environment.' },
            { name: 'Autodesk EAGLE', imageUrl: baseSkillImagePath + 'EAGLE.jpg', description: 'EDA tool for schematic capture, PCB layout, auto-router, and CAM features.' },
            { name: 'ORcad x Capture', imageUrl: baseSkillImagePath + 'OrCADCapture.webp', description: 'Cadence EDA tools for designing ICs, SoCs, and PCBs.' },
            { name: 'Oscilloscope', imageUrl: baseSkillImagePath + 'oscilloscope.jpg', description: 'Instrument for observing varying signal voltages, crucial for debugging electronic circuits.' },
        ]
    }
];