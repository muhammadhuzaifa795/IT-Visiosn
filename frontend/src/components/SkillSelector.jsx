import { useState } from "react";

const skillOptions = [
    // Languages
    "JavaScript", "TypeScript", "Python", "Java", "C", "C++", "C#", "Go", "Rust", "Ruby", "PHP", "Kotlin", "Swift", "Dart", "R",

    // Frontend Frameworks & Libraries
    "React", "Next.js", "Vue.js", "Nuxt.js", "Angular", "Svelte", "jQuery", "Tailwind CSS", "Bootstrap", "Material UI", "SASS", "LESS",

    // Backend Frameworks
    "Node.js", "Express", "Django", "Flask", "Spring Boot", "Laravel", "FastAPI", ".NET", "NestJS", "Ruby on Rails", "AdonisJS",

    // Mobile Development
    "React Native", "Flutter", "Ionic", "SwiftUI", "Jetpack Compose",

    // Databases
    "MongoDB", "MySQL", "PostgreSQL", "SQLite", "Redis", "Firebase", "Oracle", "Microsoft SQL Server", "CouchDB",

    // DevOps & Cloud
    "Docker", "Kubernetes", "Jenkins", "GitLab CI/CD", "GitHub Actions", "AWS", "Azure", "Google Cloud", "Terraform", "Ansible", "Vercel", "Netlify", "Heroku", "Nginx",

    // Graphic Design & UI/UX
    "Figma", "Adobe XD", "Adobe Photoshop", "Adobe Illustrator", "Canva", "Sketch", "InVision", "CorelDRAW",

    // Version Control & Tools
    "Git", "GitHub", "GitLab", "Bitbucket", "VS Code", "Postman", "Swagger", "Notion", "Jira", "Trello", "Slack", "Zoom",

    // Testing
    "Jest", "Mocha", "Cypress", "Playwright", "Selenium",

    // Others
    "WordPress", "Shopify", "Magento", "WooCommerce", "Blender", "Unity", "Unreal Engine"
]
const SkillSelector = ({ selectedSkills, onAddSkill, onClose }) => {
    const [search, setSearch] = useState("");

    const filtered = skillOptions.filter(
        (skill) =>
            skill.toLowerCase().includes(search.toLowerCase()) &&
            !selectedSkills.includes(skill)
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-base-100 p-6 rounded-xl w-full max-w-md space-y-4">
                <h3 className="text-lg font-semibold">Add Skills</h3>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Search skills..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="max-h-60 overflow-y-auto space-y-2">
                    {filtered.map((skill) => (
                        <div
                            key={skill}
                            className="p-2 border rounded-md cursor-pointer hover:bg-base-200"
                            onClick={() => onAddSkill(skill)}
                        >
                            {skill}
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <p className="text-sm opacity-60">No skills found</p>
                    )}
                </div>
                <div className="flex justify-end">
                    <button onClick={onClose} className="btn btn-sm btn-ghost">Close</button>
                </div>
            </div>
        </div>
    );
};

export default SkillSelector;
