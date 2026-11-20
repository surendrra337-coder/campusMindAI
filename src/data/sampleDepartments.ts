import { DepartmentInfo } from '../types';

export const DEPARTMENTS_DATA: DepartmentInfo[] = [
  {
    id: 'aids',
    name: 'Artificial Intelligence & Data Science',
    code: 'AI-DS',
    degree: 'B.Tech (Honours)',
    duration: '4 Years (8 Semesters)',
    intake: 120,
    annualFee: 145000,
    eligibility: '10+2 with PCM >= 60% aggregate, JEE Main or State CET rank',
    minCutoffPercentile: 88.5,
    description: 'Premier department dedicated to foundational algorithms, deep neural architectures, LLM fine-tuning, computer vision, data engineering pipelines, and responsible AI ethics.',
    hod: {
      name: 'Dr. Vikramaditya Rathore',
      designation: 'Professor & Head of Department',
      email: 'hod.aids@apex.edu',
      qualification: 'Ph.D. (IIT Delhi), M.Tech (AI), PostDoc (NUS)'
    },
    keySubjects: [
      'Deep Learning & Neural Networks',
      'Natural Language Processing & LLMs',
      'Computer Vision & Autonomous Systems',
      'Big Data Engineering (Spark & Hadoop)',
      'Reinforcement Learning',
      'MLOps & Cloud Deployment',
      'Probabilistic Graphical Models',
      'AI Ethics & Responsible Computing'
    ],
    labs: [
      'Turing Supercomputing Center (NVIDIA A100)',
      'Cognitive Robotics & Vision Lab',
      'Big Data Analytics Sandbox',
      'Generative AI & LLM Exploration Studio'
    ],
    careerProspects: [
      'AI Research Scientist',
      'Machine Learning Engineer',
      'Data Architect / Big Data Engineer',
      'Computer Vision Engineer',
      'NLP / Prompt Engineer',
      'Data Scientist'
    ],
    avgPackageLPA: 11.2,
    highestPackageLPA: 44.5,
    topRecruiters: ['NVIDIA', 'Google Cloud', 'Microsoft Research', 'Amazon AWS', 'Adobe Sensei', 'Fractal Analytics']
  },
  {
    id: 'cse',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    degree: 'B.Tech',
    duration: '4 Years (8 Semesters)',
    intake: 180,
    annualFee: 145000,
    eligibility: '10+2 with PCM >= 60% aggregate, JEE Main rank',
    minCutoffPercentile: 91.0,
    description: 'Flagship engineering program emphasizing software engineering, distributed cloud systems, cybersecurity, compilers, database internals, and high-performance computing.',
    hod: {
      name: 'Dr. Aruna Venkatesh',
      designation: 'Professor & Head of CSE',
      email: 'hod.cse@apex.edu',
      qualification: 'Ph.D. (IISc Bangalore), B.Tech (IIT Madras)'
    },
    keySubjects: [
      'Data Structures & Advanced Algorithms',
      'Distributed Systems & Cloud Architecture',
      'Compiler Design',
      'Operating Systems Internals',
      'Computer Networks & Protocols',
      'Software Architecture & Design Patterns',
      'Database Management Systems'
    ],
    labs: [
      'Cloud Computing & Distributed Systems Lab',
      'Cybersecurity & Network Defense Lab',
      'Open-Source Software Development Hub',
      'Advanced Programming Laboratory'
    ],
    careerProspects: [
      'Full Stack Software Architect',
      'Distributed Systems Engineer',
      'Cloud Solutions Specialist',
      'DevOps / SRE Engineer',
      'Security Analyst'
    ],
    avgPackageLPA: 10.4,
    highestPackageLPA: 42.0,
    topRecruiters: ['Microsoft', 'Amazon', 'Cisco', 'Salesforce', 'Atlassian', 'Oracle']
  },
  {
    id: 'ece',
    name: 'Electronics & Communication Engineering',
    code: 'ECE',
    degree: 'B.Tech',
    duration: '4 Years (8 Semesters)',
    intake: 120,
    annualFee: 135000,
    eligibility: '10+2 with PCM >= 60% aggregate',
    minCutoffPercentile: 82.0,
    description: 'Bridging hardware and software with specialization in VLSI design, Embedded IoT systems, 5G wireless communications, signal processing, and Edge AI processors.',
    hod: {
      name: 'Dr. Rajeshwar Sen',
      designation: 'Associate Professor & Head of ECE',
      email: 'hod.ece@apex.edu',
      qualification: 'Ph.D. (IIT Roorkee), M.Tech (VLSI)'
    },
    keySubjects: [
      'VLSI Design & Cadence Tooling',
      'Embedded Systems & ARM Microcontrollers',
      '5G & Digital Wireless Communications',
      'DSP Algorithms & Architectures',
      'Edge AI & Hardware Accelerators',
      'RF & Microwave Circuit Engineering'
    ],
    labs: [
      'Cadence VLSI Design Suite Lab',
      'Embedded IoT & Microcontroller Station',
      'RF & Microwave Testing Facility',
      'Signal Processing & FPGA Prototype Lab'
    ],
    careerProspects: [
      'VLSI Physical Design Engineer',
      'Embedded Firmware Developer',
      'Silicon Validation Engineer',
      'Telecom & 5G Infrastructure Engineer'
    ],
    avgPackageLPA: 8.6,
    highestPackageLPA: 28.0,
    topRecruiters: ['Qualcomm', 'Texas Instruments', 'Intel', 'Synopsys', 'MediaTek', 'Samsung Semi']
  },
  {
    id: 'it',
    name: 'Information Technology',
    code: 'IT',
    degree: 'B.Tech',
    duration: '4 Years (8 Semesters)',
    intake: 60,
    annualFee: 140000,
    eligibility: '10+2 with PCM >= 60% aggregate',
    minCutoffPercentile: 85.0,
    description: 'Focused on enterprise software delivery, modern full-stack web/mobile application architectures, information security, container orchestration, and cloud native services.',
    hod: {
      name: 'Dr. Meenakshi Soni',
      designation: 'Associate Professor & Head of IT',
      email: 'hod.it@apex.edu',
      qualification: 'Ph.D. (BITS Pilani)'
    },
    keySubjects: [
      'Modern Web Architectures & Microservices',
      'Information Security & Cryptography',
      'Mobile Application Engineering (Flutter/Kotlin)',
      'Enterprise Database Systems',
      'Agile Product Engineering & CI/CD'
    ],
    labs: [
      'Web Technologies & Mobile App Studio',
      'Enterprise Software Simulation Lab',
      'Network Administration Center'
    ],
    careerProspects: [
      'Enterprise Software Engineer',
      'Mobile App Specialist',
      'DevOps Architect',
      'IT Consultant'
    ],
    avgPackageLPA: 9.1,
    highestPackageLPA: 32.0,
    topRecruiters: ['Accenture Tech Labs', 'Cognizant GenC', 'Infosys', 'Capgemini', 'Wipro Digital']
  },
  {
    id: 'mech',
    name: 'Mechanical & Automation Engineering',
    code: 'MAE',
    degree: 'B.Tech',
    duration: '4 Years (8 Semesters)',
    intake: 60,
    annualFee: 125000,
    eligibility: '10+2 with PCM >= 55% aggregate',
    minCutoffPercentile: 74.0,
    description: 'Future-ready mechanical engineering fused with robotics, industrial automation, CAD/CAM generative modeling, electric vehicle powertrain engineering, and additive 3D manufacturing.',
    hod: {
      name: 'Dr. Suresh Chandra Panda',
      designation: 'Professor & Head of Mechanical',
      email: 'hod.mech@apex.edu',
      qualification: 'Ph.D. (IIT Kanpur), M.E. (Automobile)'
    },
    keySubjects: [
      'Robotics & Industrial Automation',
      'Electric Vehicle Battery & Powertrain',
      'CAD/CAM & FEA Modeling (ANSYS/SolidWorks)',
      'Additive Manufacturing & 3D Printing',
      'Thermal Fluid Engineering & CFD'
    ],
    labs: [
      'KUKA Industrial Robotics Cell',
      'Electric Vehicle Powertrain Research Lab',
      'Advanced 3D Additive Printing Facility',
      'Automotive Engine Testing Station'
    ],
    careerProspects: [
      'Robotics Automation Engineer',
      'EV Battery & Drive Systems Engineer',
      'CAD/CAM Design Specialist',
      'Manufacturing Operations Lead'
    ],
    avgPackageLPA: 7.4,
    highestPackageLPA: 19.5,
    topRecruiters: ['Tata Motors', 'Tesla Supply Chain', 'L&T Technology Services', 'Bosch', 'Mahindra Tech']
  }
];
