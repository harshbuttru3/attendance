const subjectsData = [
  {
    semester: "1st",
    branches: [
      {
        branch: "CSE",
        subjects: [
          { id: 101, name: "Physics" },
          { id: 102, name: "Mathematics-I" },
          { id: 103, name: "PPS" },
          { id: 104, name: "IT-Workshop" },
          { id: 105, name: "BEE" },
          { id: 106, name: "SBM" },
          { id: 107, name: "BEE-L" },
          { id: 108, name: "PPS-L" },
          { id: 109, name: "Physics-L" },
          { id: 110, name: "IT-Workshop-L" },
        ],
      },
      {
        branch: "EEE",
        subjects: [
          { id: 111, name: "Mathematics-I" },
          { id: 112, name: "Physics" },
          { id: 113, name: "PPS" },
          { id: 114, name: "Workshop-Practices" },
          { id: 115, name: "SBM" },
          { id: 116, name: "Basic Electrical Engineering" },
          { id: 117, name: "Physics-L" },
          { id: 118, name: "PPS-L" },
          { id: 119, name: "BEE-L" },
          { id: 120, name: "Workshop-Practices-L" },
        ],
      },
      {
        branch: "Cybersecurity",
        subjects: [
          { id: 121, name: "Physics" },
          { id: 122, name: "Mathematics-I" },
          { id: 123, name: "PPS" },
          { id: 124, name: "IT-Workshop" },
          { id: 125, name: "BEE" },
          { id: 126, name: "SBM" },
          { id: 127, name: "BEE-L" },
          { id: 128, name: "PPS-L" },
          { id: 129, name: "Physics-L" },
          { id: 130, name: "IT-Workshop-L" },
        ],
      },
      {
        branch: "Civil",
        subjects: [
          { id: 131, name: "Mathematics-I" },
          { id: 132, name: "Engineering Mechanics" },
          { id: 133, name: "Chemistry" },
          { id: 134, name: "English" },
          { id: 135, name: "EG&D" },
          { id: 136, name: "Chemistry-L" },
          { id: 137, name: "English-L" },
          { id: 138, name: "EG&D-L" },
        ],
      },
      {
        branch: "Mechanical",
        subjects: [
          { id: 139, name: "Mathematics-I" },
          { id: 140, name: "EG&D" },
          { id: 141, name: "Chemistry" },
          { id: 142, name: "English" },
          { id: 143, name: "BEE" },
          { id: 144, name: "Chemistry-L" },
          { id: 145, name: "English-L" },
          { id: 146, name: "EG&D-L" },
          { id: 147, name: "BEE-L" },
        ],
      },
      {
        branch: "FTS",
        subjects: [
          { id: 148, name: "Mathematics-I" },
          { id: 149, name: "EG&D" },
          { id: 150, name: "Chemistry" },
          { id: 151, name: "English" },
          { id: 152, name: "BEE" },
          { id: 153, name: "Chemistry-L" },
          { id: 154, name: "English-L" },
          { id: 155, name: "EG&D-L" },
          { id: 156, name: "BEE-L" },
        ],
      },
    ],
  },
  {
    semester: "2nd",
    branches: [
      {
        branch: "CSE",
        subjects: [
          { id: 201, name: "Mathematics-II" },
          { id: 202, name: "Chemistry" },
          { id: 203, name: "Digital Electronics" },
          { id: 204, name: "Data Structures" },
          { id: 205, name: "OOPs through Java" },
          { id: 206, name: "English" },
          { id: 207, name: "Chemistry-L" },
          { id: 208, name: "Data Structures-L" },
          { id: 209, name: "OOPs through Java-L" },
          { id: 210, name: "English-L" },
        ],
      },
      {
        branch: "EEE",
        subjects: [
          { id: 211, name: "Mathematics-II" },
          { id: 212, name: "Chemistry" },
          { id: 213, name: "Electronic Devices" },
          { id: 214, name: "Signals and Systems" },
          { id: 215, name: "Network Theory" },
          { id: 216, name: "English" },
          { id: 217, name: "Chemistry-L" },
          { id: 218, name: "Electronic Devices-L" },
          { id: 219, name: "Network Theory-L" },
          { id: 220, name: "English-L" },
        ],
      },
      {
        branch: "Cybersecurity",
        subjects: [
          { id: 221, name: "Mathematics-II" },
          { id: 222, name: "Chemistry" },
          { id: 223, name: "Digital Logic Design" },
          { id: 224, name: "Network Security" },
          { id: 225, name: "Programming in Python" },
          { id: 226, name: "English" },
          { id: 227, name: "Chemistry-L" },
          { id: 228, name: "Digital Logic Design-L" },
          { id: 229, name: "Programming in Python-L" },
          { id: 230, name: "English-L" },
        ],
      },
      {
        branch: "Civil",
        subjects: [
          { id: 231, name: "Mathematics-II" },
          { id: 232, name: "Chemistry" },
          { id: 233, name: "Engineering Mechanics" },
          { id: 234, name: "Surveying" },
          { id: 235, name: "Engineering Geology" },
          { id: 236, name: "English" },
          { id: 237, name: "Chemistry-L" },
          { id: 238, name: "Surveying-L" },
          { id: 239, name: "Engineering Geology-L" },
          { id: 240, name: "English-L" },
        ],
      },
      {
        branch: "Mechanical",
        subjects: [
          { id: 241, name: "Mathematics-II" },
          { id: 242, name: "Chemistry" },
          { id: 243, name: "Thermodynamics" },
          { id: 244, name: "Manufacturing Processes" },
          { id: 245, name: "Engineering Graphics" },
          { id: 246, name: "English" },
          { id: 247, name: "Chemistry-L" },
          { id: 248, name: "Thermodynamics-L" },
          { id: 249, name: "Manufacturing Processes-L" },
          { id: 250, name: "English-L" },
        ],
      },
      {
        branch: "FTS",
        subjects: [
          { id: 251, name: "Mathematics-II" },
          { id: 252, name: "Chemistry" },
          { id: 253, name: "Food Chemistry" },
          { id: 254, name: "Food Microbiology" },
          { id: 255, name: "Food Processing" },
          { id: 256, name: "English" },
          { id: 257, name: "Chemistry-L" },
          { id: 258, name: "Food Chemistry-L" },
          { id: 259, name: "Food Microbiology-L" },
          { id: 260, name: "English-L" },
        ],
      },
    ],
  },
  {
    semester: "3rd",
    branches: [
      {
        branch: "CSE",
        subjects: [
          { id: 301, name: "Mathematics - III" },
          { id: 302, name: "Computer Organization" },
          { id: 303, name: "Operating Systems" },
          { id: 304, name: "Database Management Systems" },
          { id: 305, name: "Software Engineering" },
        ],
      },
      {
        branch: "EEE",
        subjects: [
          { id: 306, name: "Mathematics - III" },
          { id: 307, name: "Microprocessors" },
          { id: 308, name: "Analog Communication" },
          { id: 309, name: "Control Systems" },
          { id: 310, name: "Electromagnetic Field Theory" },
        ],
      },
      {
        branch: "Cybersecurity",
        subjects: [
          { id: 311, name: "Mathematics - III" },
          { id: 312, name: "OOPS" },
          { id: 313, name: "Physics" },
          { id: 314, name: "AE" },
          { id: 315, name: "DSA" },
        ],
      },
      {
        branch: "Civil",
        subjects: [
          { id: 316, name: "Mathematics - III" },
          { id: 317, name: "Structural Analysis" },
          { id: 318, name: "Fluid Mechanics" },
          { id: 319, name: "Geotechnical Engineering" },
          { id: 320, name: "Surveying - II" },
        ],
      },
      {
        branch: "Mechanical",
        subjects: [
          { id: 321, name: "Mathematics - III" },
          { id: 322, name: "Mechanics of Solids" },
          { id: 323, name: "Fluid Mechanics" },
          { id: 324, name: "Thermodynamics - II" },
          { id: 325, name: "Machine Drawing" },
        ],
      },
      {
        branch: "FTS",
        subjects: [
          { id: 326, name: "Mathematics - III" },
          { id: 327, name: "Food Packaging" },
          { id: 328, name: "Food Quality Control" },
          { id: 329, name: "Food Preservation" },
          { id: 330, name: "Food Engineering" },
        ],
      },
    ],
  },
  {
    semester: "4th",
    branches: [
      {
        branch: "CSE",
        subjects: [
          { id: 401, name: "Mathematics - IV" },
          { id: 402, name: "Theory of Computation" },
          { id: 403, name: "Computer Networks" },
          { id: 404, name: "Design and Analysis of Algorithms" },
          { id: 405, name: "Artificial Intelligence" },
        ],
      },
      {
        branch: "EEE",
        subjects: [
          { id: 406, name: "Mathematics - IV" },
          { id: 407, name: "Power Systems" },
          { id: 408, name: "Electrical Machines - I" },
          { id: 409, name: "Digital Signal Processing" },
          { id: 410, name: "Power Electronics" },
        ],
      },
      {
        branch: "Cybersecurity",
        subjects: [
          { id: 411, name: "Mathematics - IV" },
          { id: 412, name: "System Security" },
          { id: 413, name: "Penetration Testing" },
          { id: 414, name: "Malware Analysis" },
          { id: 415, name: "Cloud Security" },
        ],
      },
      {
        branch: "Civil",
        subjects: [
          { id: 416, name: "Mathematics - IV" },
          { id: 417, name: "Structural Design" },
          { id: 418, name: "Transportation Engineering" },
          { id: 419, name: "Hydraulics and Water Resources" },
          { id: 420, name: "Geotechnical Engineering - II" },
        ],
      },
      {
        branch: "Mechanical",
        subjects: [
          { id: 421, name: "Mathematics - IV" },
          { id: 422, name: "Dynamics of Machines" },
          { id: 423, name: "Manufacturing Technology" },
          { id: 424, name: "Heat and Mass Transfer" },
          { id: 425, name: "Machine Design" },
        ],
      },
      {
        branch: "FTS",
        subjects: [
          { id: 426, name: "Mathematics - IV" },
          { id: 427, name: "Food Biotechnology" },
          { id: 428, name: "Food Analysis" },
          { id: 429, name: "Food Plant Design" },
          { id: 430, name: "Dairy Technology" },
        ],
      },
    ],
  },
  {
    semester: "5th",
    branches: [
      {
        branch: "CSE",
        subjects: [
          { id: 501, name: "Software Project Management" },
          { id: 502, name: "Web Technologies" },
          { id: 503, name: "Machine Learning" },
          { id: 504, name: "Compiler Design" },
          { id: 505, name: "Cloud Computing" },
        ],
      },
      {
        branch: "EEE",
        subjects: [
          { id: 506, name: "Power Systems - II" },
          { id: 507, name: "Electrical Machines - II" },
          { id: 508, name: "Control Systems" },
          { id: 509, name: "Industrial Automation" },
          { id: 510, name: "Electrical Measurements" },
        ],
      },
      {
        branch: "Cybersecurity",
        subjects: [
          { id: 511, name: "Cyber Forensics" },
          { id: 512, name: "IoT Security" },
          { id: 513, name: "Blockchain Security" },
          { id: 514, name: "Cyber Laws and Ethics" },
          { id: 515, name: "Secure Software Development" },
        ],
      },
      {
        branch: "Civil",
        subjects: [
          { id: 516, name: "Structural Analysis - II" },
          { id: 517, name: "Concrete Technology" },
          { id: 518, name: "Foundation Engineering" },
          { id: 519, name: "Hydrology and Irrigation" },
          { id: 520, name: "Construction Management" },
        ],
      },
      {
        branch: "Mechanical",
        subjects: [
          { id: 521, name: "Refrigeration and Air Conditioning" },
          { id: 522, name: "Advanced Thermodynamics" },
          { id: 523, name: "Robotics and Automation" },
          { id: 524, name: "Product Design and Development" },
          { id: 525, name: "Finite Element Analysis" },
        ],
      },
      {
        branch: "FTS",
        subjects: [
          { id: 526, name: "Meat and Poultry Processing" },
          { id: 527, name: "Cereal Technology" },
          { id: 528, name: "Food Supply Chain Management" },
          { id: 529, name: "Food Waste Management" },
          { id: 530, name: "Beverage Technology" },
        ],
      },
    ],
  },
  {
    semester: "6th",
    branches: [
      {
        branch: "CSE",
        subjects: [
          { id: 601, name: "Big Data Analytics" },
          { id: 602, name: "Cybersecurity Principles" },
          { id: 603, name: "Artificial Neural Networks" },
          { id: 604, name: "Mobile Computing" },
          { id: 605, name: "Internet of Things (IoT)" },
        ],
      },
      {
        branch: "EEE",
        subjects: [
          { id: 606, name: "High Voltage Engineering" },
          { id: 607, name: "Switchgear and Protection" },
          { id: 608, name: "Smart Grid Technologies" },
          { id: 609, name: "Renewable Energy Systems" },
          { id: 610, name: "Embedded Systems" },
        ],
      },
      {
        branch: "Cybersecurity",
        subjects: [
          { id: 611, name: "Wireless Security" },
          { id: 612, name: "Digital Forensics" },
          { id: 613, name: "Threat Intelligence" },
          { id: 614, name: "Advanced Network Security" },
          { id: 615, name: "Incident Response" },
        ],
      },
      {
        branch: "Civil",
        subjects: [
          { id: 616, name: "Steel Structures" },
          { id: 617, name: "Environmental Engineering" },
          { id: 618, name: "Urban Planning" },
          { id: 619, name: "Highway Engineering" },
          { id: 620, name: "Disaster Management" },
        ],
      },
      {
        branch: "Mechanical",
        subjects: [
          { id: 621, name: "Automobile Engineering" },
          { id: 622, name: "Power Plant Engineering" },
          { id: 623, name: "Industrial Engineering" },
          { id: 624, name: "CAD/CAM" },
          { id: 625, name: "Material Science" },
        ],
      },
      {
        branch: "FTS",
        subjects: [
          { id: 626, name: "Food Additives" },
          { id: 627, name: "Nutraceuticals" },
          { id: 628, name: "Food Fermentation" },
          { id: 629, name: "Sensory Evaluation of Foods" },
          { id: 630, name: "Food Safety and Hygiene" },
        ],
      },
    ],
  },
  {
    semester: "7th",
    branches: [
      {
        branch: "CSE",
        subjects: [
          { id: 701, name: "Deep Learning" },
          { id: 702, name: "Cloud Security" },
          { id: 703, name: "DevOps" },
          { id: 704, name: "Human-Computer Interaction" },
          { id: 705, name: "Elective - I" },
        ],
      },
      {
        branch: "EEE",
        subjects: [
          { id: 706, name: "Power System Protection" },
          { id: 707, name: "Advanced Control Systems" },
          { id: 708, name: "Electric Vehicles" },
          { id: 709, name: "Industrial Drives" },
          { id: 710, name: "Elective - I" },
        ],
      },
      {
        branch: "Cybersecurity",
        subjects: [
          { id: 711, name: "Advanced Cyber Threats" },
          { id: 712, name: "Digital Payment Security" },
          { id: 713, name: "Cyber Risk Management" },
          { id: 714, name: "Cloud and Virtualization Security" },
          { id: 715, name: "Elective - I" },
        ],
      },
      {
        branch: "Civil",
        subjects: [
          { id: 716, name: "Bridge Engineering" },
          { id: 717, name: "Construction Technology" },
          { id: 718, name: "Advanced Structural Analysis" },
          { id: 719, name: "Remote Sensing & GIS" },
          { id: 720, name: "Elective - I" },
        ],
      },
      {
        branch: "Mechanical",
        subjects: [
          { id: 721, name: "Automobile Systems" },
          { id: 722, name: "Smart Manufacturing" },
          { id: 723, name: "Mechatronics" },
          { id: 724, name: "Renewable Energy" },
          { id: 725, name: "Elective - I" },
        ],
      },
      {
        branch: "FTS",
        subjects: [
          { id: 726, name: "Food Toxicology" },
          { id: 727, name: "Industrial Food Processing" },
          { id: 728, name: "Dietary Supplements" },
          { id: 729, name: "Food Regulations & Laws" },
          { id: 730, name: "Elective - I" },
        ],
      },
    ],
  },
  {
    semester: "8th",
    branches: [
      {
        branch: "CSE",
        subjects: [
          { id: 801, name: "AI Ethics & Governance" },
          { id: 802, name: "Edge Computing" },
          { id: 803, name: "Elective - II" },
          { id: 804, name: "Project & Dissertation" },
          { id: 805, name: "Internship" },
        ],
      },
      {
        branch: "EEE",
        subjects: [
          { id: 806, name: "Smart Grid Systems" },
          { id: 807, name: "Power Quality Management" },
          { id: 808, name: "Elective - II" },
          { id: 809, name: "Project & Dissertation" },
          { id: 810, name: "Internship" },
        ],
      },
      {
        branch: "Cybersecurity",
        subjects: [
          { id: 811, name: "AI in Cybersecurity" },
          { id: 812, name: "Cyber Warfare & Defense" },
          { id: 813, name: "Elective - II" },
          { id: 814, name: "Project & Dissertation" },
          { id: 815, name: "Internship" },
        ],
      },
      {
        branch: "Civil",
        subjects: [
          { id: 816, name: "Urban Infrastructure Planning" },
          { id: 817, name: "Seismic Engineering" },
          { id: 818, name: "Elective - II" },
          { id: 819, name: "Project & Dissertation" },
          { id: 820, name: "Internship" },
        ],
      },
      {
        branch: "Mechanical",
        subjects: [
          { id: 821, name: "Industrial Robotics" },
          { id: 822, name: "Energy Management" },
          { id: 823, name: "Elective - II" },
          { id: 824, name: "Project & Dissertation" },
          { id: 825, name: "Internship" },
        ],
      },
      {
        branch: "FTS",
        subjects: [
          { id: 826, name: "Advanced Food Chemistry" },
          { id: 827, name: "Food Chain Logistics" },
          { id: 828, name: "Elective - II" },
          { id: 829, name: "Project & Dissertation" },
          { id: 830, name: "Internship" },
        ],
      },
    ],
  },
];

export default subjectsData;
