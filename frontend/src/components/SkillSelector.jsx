import { useState, useMemo } from "react";
import { 
  Search, X, Plus, Check, ChevronDown, Filter, Sparkles, 
  Zap, Code, Palette, Database, Cloud, Smartphone, 
  GitBranch, TestTube, Box, Shield
} from "lucide-react";


const skillCategories = {
  "Programming Languages": [
    "JavaScript", "TypeScript", "Python", "Java", "C", "C++", "C#", "Go", "Rust", 
    "Ruby", "PHP", "Kotlin", "Swift", "Dart", "R", "Scala", "Perl", "Haskell", "Elixir"
  ],
  "Frontend Development": [
    "React", "Next.js", "Vue.js", "Nuxt.js", "Angular", "Svelte", "jQuery", 
    "Tailwind CSS", "Bootstrap", "Material UI", "Chakra UI", "SASS", "LESS", 
    "Styled Components", "Emotion", "Ant Design", "Vuetify"
  ],
  "Backend Development": [
    "Node.js", "Express", "Django", "Flask", "Spring Boot", "Laravel", "FastAPI", 
    ".NET", "NestJS", "Ruby on Rails", "AdonisJS", "Phoenix", "Gin", "Fiber"
  ],
  "Mobile Development": [
    "React Native", "Flutter", "Ionic", "SwiftUI", "Jetpack Compose", 
    "Xamarin", "NativeScript", "Expo", "Android SDK", "iOS SDK"
  ],
  "Databases": [
    "MongoDB", "MySQL", "PostgreSQL", "SQLite", "Redis", "Firebase", 
    "Oracle", "Microsoft SQL Server", "CouchDB", "Cassandra", "DynamoDB", 
    "Elasticsearch", "Neo4j", "MariaDB"
  ],
  "DevOps & Cloud": [
    "Docker", "Kubernetes", "Jenkins", "GitLab CI/CD", "GitHub Actions", 
    "AWS", "Azure", "Google Cloud", "Terraform", "Ansible", "Vercel", 
    "Netlify", "Heroku", "Nginx", "Apache", "DigitalOcean", "Cloudflare"
  ],
  "UI/UX Design": [
    "Figma", "Adobe XD", "Adobe Photoshop", "Adobe Illustrator", "Canva", 
    "Sketch", "InVision", "CorelDRAW", "Affinity Designer", "Proto.io", 
    "Marvel", "Principle", "Framer"
  ],
  "Development Tools": [
    "Git", "GitHub", "GitLab", "Bitbucket", "VS Code", "Postman", "Swagger", 
    "Notion", "Jira", "Trello", "Slack", "Zoom", "Figma", "WebStorm", 
    "Android Studio", "Xcode"
  ],
  "Testing": [
    "Jest", "Mocha", "Cypress", "Playwright", "Selenium", "JUnit", "Pytest", 
    "Vitest", "Testing Library", "Enzyme", "Jasmine", "Karma"
  ],
  "AI & Machine Learning": [
    "TensorFlow", "PyTorch", "Keras", "scikit-learn", "OpenCV", "NLTK", 
    "spaCy", "Hugging Face", "LangChain", "Pandas", "NumPy", "Matplotlib"
  ],
  "Game Development": [
    "Unity", "Unreal Engine", "Godot", "Blender", "Maya", "3ds Max", 
    "Cocos2d", "Phaser", "Three.js", "WebGL"
  ],
  "E-commerce & CMS": [
    "WordPress", "Shopify", "Magento", "WooCommerce", "BigCommerce", 
    "Squarespace", "Webflow", "Contentful", "Strapi", "Sanity"
  ],
  "Blockchain & Web3": [
    "Solidity", "Web3.js", "Ethers.js", "Hardhat", "Truffle", "IPFS", 
    "MetaMask", "OpenZeppelin", "Chainlink"
  ],
  "Cybersecurity": [
    "Kali Linux", "Wireshark", "Metasploit", "Burp Suite", "Nmap", 
    "OWASP", "Penetration Testing", "Cryptography", "Network Security"
  ]
};

const categoryIcons = {
  "Programming Languages": Code,
  "Frontend Development": Zap,
  "Backend Development": Box,
  "Mobile Development": Smartphone,
  "Databases": Database,
  "DevOps & Cloud": Cloud,
  "UI/UX Design": Palette,
  "Development Tools": GitBranch,
  "Testing": TestTube,
  "AI & Machine Learning": Sparkles,
  "Game Development": Box,
  "E-commerce & CMS": Box,
  "Blockchain & Web3": Sparkles,
  "Cybersecurity": Shield
};


const SkillSelector = ({ selectedSkills, onAddSkill, onRemoveSkill, onClose }) => {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [recentlyUsed, setRecentlyUsed] = useState([]);

    const categories = ["All", ...Object.keys(skillCategories)];

    const filteredSkills = useMemo(() => {
        let skills = [];
        
        if (selectedCategory === "All") {
            Object.values(skillCategories).forEach(categorySkills => {
                skills.push(...categorySkills);
            });
        } else {
            skills = skillCategories[selectedCategory] || [];
        }

        if (search) {
            skills = skills.filter(skill => 
                skill.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Remove already selected skills
        skills = skills.filter(skill => !selectedSkills.includes(skill));

        return skills;
    }, [search, selectedCategory, selectedSkills]);

    const handleAddSkill = (skill) => {
        onAddSkill(skill);
        setRecentlyUsed(prev => {
            const updated = [skill, ...prev.filter(s => s !== skill)].slice(0, 5);
            return updated;
        });
        setSearch("");
    };

    const popularSkills = [
        "JavaScript", "Python", "React", "Node.js", "TypeScript", 
        "AWS", "Docker", "Git", "MongoDB", "PostgreSQL"
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-base-100 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-base-300/30">
                {/* Header */}
                <div className="p-6 border-b border-base-300/30">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-base-content flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-primary" />
                                Add Your Skills
                            </h2>
                            <p className="text-base-content/60 mt-1">
                                Select skills that match your expertise and interests
                            </p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="btn btn-ghost btn-circle hover:bg-base-200 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                        <input
                            type="text"
                            className="input input-lg w-full pl-12 pr-4 bg-base-200 border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-xl"
                            placeholder="Search skills (e.g., React, Python, AWS...)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="border-b border-base-300/30">
                    <div className="flex overflow-x-auto px-6 py-3 gap-1 scrollbar-hide">
                        {categories.map((category) => {
                            const Icon = categoryIcons[category] || Code;
                            return (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                                        selectedCategory === category
                                            ? 'bg-primary text-primary-content shadow-lg'
                                            : 'bg-base-200 text-base-content/70 hover:bg-base-300'
                                    }`}
                                >
                                    {category !== "All" && <Icon className="w-4 h-4" />}
                                    <span className="font-medium">{category}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex h-[500px]">
                    {/* Main Skills Panel */}
                    <div className="flex-1 overflow-hidden">
                        <div className="p-6 h-full overflow-y-auto">
                            {/* Recently Used */}
                            {recentlyUsed.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-base-content/60 mb-3 flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-secondary" />
                                        Recently Added
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {recentlyUsed.map(skill => (
                                            <button
                                                key={skill}
                                                onClick={() => handleAddSkill(skill)}
                                                className="btn btn-sm btn-outline btn-secondary gap-2"
                                            >
                                                <Plus className="w-3 h-3" />
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Popular Skills */}
                            {selectedCategory === "All" && search === "" && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-base-content/60 mb-3">
                                        🔥 Popular Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {popularSkills.map(skill => (
                                            <button
                                                key={skill}
                                                onClick={() => handleAddSkill(skill)}
                                                className="btn btn-sm btn-primary gap-2"
                                                disabled={selectedSkills.includes(skill)}
                                            >
                                                <Plus className="w-3 h-3" />
                                                {skill}
                                                {selectedSkills.includes(skill) && (
                                                    <Check className="w-3 h-3" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Skills Grid */}
                            <div>
                                <h3 className="text-sm font-semibold text-base-content/60 mb-3">
                                    {selectedCategory === "All" ? "All Skills" : selectedCategory}
                                    <span className="ml-2 text-primary">
                                        ({filteredSkills.length} skills)
                                    </span>
                                </h3>
                                
                                {filteredSkills.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Search className="w-12 h-12 text-base-content/20 mx-auto mb-3" />
                                        <p className="text-base-content/60 font-medium">No skills found</p>
                                        <p className="text-base-content/40 text-sm mt-1">
                                            Try a different search term or category
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {filteredSkills.map((skill) => (
                                            <button
                                                key={skill}
                                                onClick={() => handleAddSkill(skill)}
                                                className="group p-4 rounded-xl border border-base-300/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-base-content group-hover:text-primary transition-colors">
                                                        {skill}
                                                    </span>
                                                    <Plus className="w-4 h-4 text-base-content/40 group-hover:text-primary transition-colors" />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                    <span className="text-xs text-base-content/50">
                                                        In-demand skill
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Selected Skills Sidebar */}
                    <div className="w-80 border-l border-base-300/30 bg-base-200/50">
                        <div className="p-6 h-full flex flex-col">
                            <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
                                <Check className="w-5 h-5 text-success" />
                                Selected Skills
                                <span className="bg-primary text-primary-content rounded-full px-2 py-1 text-xs min-w-[1.5rem] text-center">
                                    {selectedSkills.length}
                                </span>
                            </h3>

                            {selectedSkills.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center text-center">
                                    <div>
                                        <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Plus className="w-6 h-6 text-base-content/40" />
                                        </div>
                                        <p className="text-base-content/60 font-medium">No skills selected</p>
                                        <p className="text-base-content/40 text-sm mt-1">
                                            Start adding skills from the left panel
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto space-y-2">
                                    {selectedSkills.map((skill) => (
                                        <div
                                            key={skill}
                                            className="flex items-center justify-between p-3 bg-base-100 rounded-lg border border-base-300/50 group hover:border-error/30 transition-all"
                                        >
                                            <span className="font-medium text-base-content">{skill}</span>
                                            <button
                                                onClick={() => onRemoveSkill(skill)}
                                                className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error hover:text-error-content"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-4 border-t border-base-300/30 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-base-content/60">Total selected:</span>
                                    <span className="font-semibold text-primary">{selectedSkills.length} skills</span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="btn btn-primary w-full gap-2 shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Check className="w-4 h-4" />
                                    Confirm Skills
                                </button>
                                <button
                                    onClick={() => selectedSkills.forEach(skill => onRemoveSkill(skill))}
                                    className="btn btn-ghost w-full text-error hover:bg-error/10"
                                    disabled={selectedSkills.length === 0}
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillSelector;