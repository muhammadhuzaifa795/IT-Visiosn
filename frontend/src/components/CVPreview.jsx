
"use client"

import { useState, useRef, useEffect, Fragment } from "react"
import { MoreVertical, Pencil, Trash2, Eye, Download, X, Mail, Phone, Globe, Palette } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, Transition } from "@headlessui/react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"


const CVStyleGenerator = ({ onStyleChange, currentStyle }) => {
  const [style, setStyle] = useState({
    fontFamily: currentStyle.fontFamily || "Inter",
    fontSize: currentStyle.fontSize || "medium",
    spacing: currentStyle.spacing || "normal",
    primaryColor: currentStyle.primaryColor || "#2563eb",
    secondaryColor: currentStyle.secondaryColor || "#64748b",
    headerStyle: currentStyle.headerStyle || "center",
    theme: currentStyle.theme || "minimal",
    backgroundColor: currentStyle.backgroundColor || "#000000",
    layoutStyle: currentStyle.layoutStyle || "default",
  })

  const handleStyleChange = (field, value) => {
    const newStyle = { ...style, [field]: value }
    setStyle(newStyle)
    onStyleChange(newStyle)
  }

  const saveStyle = () => {
    localStorage.setItem("cvStyle", JSON.stringify(style))
  }

  return (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <h3 className="card-title text-lg mb-4">CV Style Customization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Font Family</span>
            </label>
            <select
              value={style.fontFamily}
              onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
              className="select select-bordered"
            >
              <option value="Inter">Inter (Modern)</option>
              <option value="Roboto">Roboto (Clean)</option>
              <option value="Georgia">Georgia (Classic)</option>
              <option value="Playfair">Playfair Display (Elegant)</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Font Size</span>
            </label>
            <select
              value={style.fontSize}
              onChange={(e) => handleStyleChange("fontSize", e.target.value)}
              className="select select-bordered"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Spacing</span>
            </label>
            <select
              value={style.spacing}
              onChange={(e) => handleStyleChange("spacing", e.target.value)}
              className="select select-bordered"
            >
              <option value="compact">Compact</option>
              <option value="normal">Normal</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Header Style</span>
            </label>
            <select
              value={style.headerStyle}
              onChange={(e) => handleStyleChange("headerStyle", e.target.value)}
              className="select select-bordered"
            >
              <option value="left-aligned">Left Aligned</option>
              <option value="center">Centered</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Primary Color</span>
            </label>
            <input
              type="color"
              value={style.primaryColor}
              onChange={(e) => handleStyleChange("primaryColor", e.target.value)}
              className="input input-bordered h-12"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Secondary Color</span>
            </label>
            <input
              type="color"
              value={style.secondaryColor}
              onChange={(e) => handleStyleChange("secondaryColor", e.target.value)}
              className="input input-bordered h-12"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Background Color</span>
            </label>
            <input
              type="color"
              value={style.backgroundColor}
              onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
              className="input input-bordered h-12"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Theme</span>
            </label>
            <select
              value={style.theme}
              onChange={(e) => handleStyleChange("theme", e.target.value)}
              className="select select-bordered"
            >
              <option value="minimal">Minimal</option>
              <option value="modern">Modern</option>
              <option value="professional">Professional</option>
              <option value="creative">Creative</option>
            </select>
          </div>
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-medium">Layout Style</span>
            </label>
            <select
              value={style.layoutStyle}
              onChange={(e) => handleStyleChange("layoutStyle", e.target.value)}
              className="select select-bordered"
            >
              <option value="default">Default Layout</option>
              <option value="skills-exp-right">Skills & Experience Right</option>
              <option value="edu-first">Education First</option>
              <option value="compact-grid">Compact Grid</option>
              <option value="exp-focus">Experience Focus</option>
              <option value="reverse-stack">Reverse Stack</option>
            </select>
          </div>
        </div>
        <div className="card-actions justify-end mt-6">
          <button onClick={saveStyle} className="btn btn-primary gap-2">
            <Palette className="w-4 h-4" />
            Save Style Preferences
          </button>
        </div>
      </div>
    </div>
  )
}

const CVDocument = ({ cvData, isPreview = false, style = {} }) => {
  const cleanCVText = (text) => {
    return text
      .replace(/\*\*/g, "")
      .replace(/```/g, " ")
      .replace(/\*/g, "")
      .replace(/--/g, "")
      .replace(/\+\+/g, "")
      .replace(/%/g, "")
      .replace(/ /g, " ")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/\u200B/g, "")
      .replace(/\s+$/, "")
      .trim()
  }

  const parseCV = (markdownContent) => {
    if (!markdownContent || typeof markdownContent !== "string" || markdownContent.trim() === "") return null
    const cleanedContent = cleanCVText(markdownContent)
    const lines = cleanedContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line)
    if (lines.length === 0) return null

    const sections = {}
    let currentSection = "header"
    let currentContent = []

    for (const line of lines) {
      if (line.startsWith("#")) {
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent.join("\n")
          currentContent = []
        }
        const sectionTitle = line.replace(/^#+\s*/, "").toLowerCase()
        if (sectionTitle.includes("skill")) currentSection = "skills"
        else if (sectionTitle.includes("experience")) currentSection = "experience"
        else if (sectionTitle.includes("education")) currentSection = "education"
        else if (sectionTitle.includes("certification")) currentSection = "certifications"
        else if (sectionTitle.includes("summary")) currentSection = "summary"
        else currentSection = sectionTitle
      } else if (!line.startsWith("---")) {
        currentContent.push(line)
      }
    }

    if (currentContent.length > 0) {
      sections[currentSection] = currentContent.join("\n")
    }

    const nameLine = lines[0] || ""
    const contactLine = lines.length > 1 ? lines[1] : ""
    const name = nameLine.replace(/^#+\s*/, "")

    let email = "",
      phone = "",
      linkedin = ""
    if (contactLine.includes("|")) {
      const parts = contactLine.split("|").map((p) => p.trim())
      ;[email, phone, linkedin] = parts
    }

    return { name, email, phone, linkedin, ...sections }
  }

  const cvInfo = parseCV(cvData)

  if (!cvInfo) {
 
    if (cvData && cvData.trim().length > 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-warning/10 rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-base-content/60">Could not display CV content.</p>
            <p className="text-xs text-base-content/40">
              It might be malformed or empty. Try editing and regenerating.
            </p>
          </div>
        </div>
      )
    }
   
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-2"></div>
          <p className="text-base-content/60">Loading CV data...</p>
        </div>
      </div>
    )
  }

  const getStyleClasses = () => {
    const baseClasses = isPreview ? "space-y-3 text-xs leading-relaxed" : "space-y-6 text-sm leading-relaxed"
    const fontClass = style.fontFamily === "Georgia" || style.fontFamily === "Playfair" ? "font-serif" : "font-sans"
    const sizeClass = style.fontSize === "small" ? "text-xs" : style.fontSize === "large" ? "text-base" : "text-sm"
    const spacingClass =
      style.spacing === "compact" ? "space-y-2" : style.spacing === "spacious" ? "space-y-8" : "space-y-6"
    return `${baseClasses} ${fontClass} ${!isPreview ? sizeClass : ""} ${!isPreview ? spacingClass : ""}`
  }

  const getHeaderAlignment = () => {
    return style.headerStyle === "left-aligned" ? "text-left" : "text-center"
  }

  const getPrimaryColor = () => style.primaryColor || "#2563eb"
  const getSecondaryColor = () => style.secondaryColor || "#64748b"
  const getBackgroundColor = () => style.backgroundColor || "#ffffff"

  const parseListItems = (content) => {
    if (!content) return []
    return content
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\*\s*/, "").trim())
      .filter((item) => item.length > 0)
  }

  const parseExperience = (content) => {
    if (!content) return []
    const experiences = []
    const blocks = content.split("\n\n")

    for (const block of blocks) {
      const lines = block.split("\n").filter((line) => line.trim())
      if (lines.length > 0) {
        const titleLine = lines[0]

        const descLines = lines.slice(1)

        const companyMatch = titleLine.match(/\*\*(.+?)\*\*/)
        const roleMatch = titleLine.match(/\*(.+?)\*/)
        const durationMatch = titleLine.match(/Duration:\s*(.+?)(?:\s*\(|$)/)

        experiences.push({
          company: companyMatch ? companyMatch[1] : "Company",
          role: roleMatch ? roleMatch[1] : "Position",
          duration: durationMatch ? durationMatch[1] : "Duration",
        
          description: descLines.map((line) => line.replace(/^\*\s*/, "").trim()).filter((line) => line),
        })
      }
    }
    return experiences
  }

  const skillItems = parseListItems(cvInfo.skills)
  const experiences = parseExperience(cvInfo.experience)

  const renderHeader = () => (
    <div className={`${getHeaderAlignment()} pb-6 mb-6`} style={{ borderBottom: `3px solid ${getPrimaryColor()}` }}>
      <h1 className={`${isPreview ? "text-xl" : "text-4xl"} font-bold mb-3`} style={{ color: getPrimaryColor() }}>
        {cvInfo.name}
      </h1>
      <div className={`flex ${isPreview ? "flex-col space-y-1" : "flex-wrap"} items-center justify-center gap-4`}>
        {cvInfo.email && (
          <div className="flex items-center gap-2">
            <Mail className={`${isPreview ? "w-3 h-3" : "w-5 h-5"}`} style={{ color: getPrimaryColor() }} />
            <span className="text-sm">{cvInfo.email}</span>
          </div>
        )}
        {cvInfo.phone && (
          <div className="flex items-center gap-2">
            <Phone className={`${isPreview ? "w-3 h-3" : "w-5 h-5"}`} style={{ color: getPrimaryColor() }} />
            <span className="text-sm">{cvInfo.phone}</span>
          </div>
        )}
        {cvInfo.linkedin && (
          <div className="flex items-center gap-2">
            <Globe className={`${isPreview ? "w-3 h-3" : "w-5 h-5"}`} style={{ color: getPrimaryColor() }} />
            <a href={cvInfo.linkedin} className="text-sm hover:underline" style={{ color: getPrimaryColor() }}>
              LinkedIn Profile
            </a>
          </div>
        )}
      </div>
    </div>
  )

  const renderSummary = () =>
    cvInfo.summary && (
      <div className="mb-6">
        <h2
          className={`text-xl font-bold mb-3 pb-2`}
          style={{ borderBottom: `2px solid ${getPrimaryColor()}`, color: getPrimaryColor() }}
        >
          Professional Summary
        </h2>
        <p className="text-sm leading-relaxed">{cvInfo.summary}</p>
      </div>
    )

  const renderSkills = () =>
    skillItems.length > 0 && (
      <div className="mb-6">
        <h2
          className={`text-xl font-bold mb-3 pb-2`}
          style={{ borderBottom: `2px solid ${getPrimaryColor()}`, color: getPrimaryColor() }}
        >
          Technical Skills
        </h2>
        <div className={`grid ${isPreview ? "grid-cols-1 gap-1" : "grid-cols-2 gap-3"} mt-3`}>
          {skillItems.map((skill, index) => (
            <div key={index} className="flex items-start gap-2">
              <span style={{ color: getPrimaryColor() }} className="mt-1 font-bold">
                •
              </span>
              <span className="text-sm">{skill}</span>
            </div>
          ))}
        </div>
      </div>
    )

  const renderExperience = () =>
    experiences.length > 0 && (
      <div className="mb-6">
        <h2
          className={`text-xl font-bold mb-3 pb-2`}
          style={{ borderBottom: `2px solid ${getPrimaryColor()}`, color: getPrimaryColor() }}
        >
          Professional Experience
        </h2>
        <div className="space-y-5">
          {experiences.map((exp, index) => (
            <div key={index} className="pl-4" style={{ borderLeft: `3px solid ${getPrimaryColor()}33` }}>
              <div className="mb-2">
                <h3 className={`${isPreview ? "text-base" : "text-lg"} font-bold`}>{exp.role}</h3>
                <div style={{ color: getPrimaryColor() }} className="font-semibold text-sm">
                  {exp.company}
                </div>
                <div style={{ color: getSecondaryColor() }} className="text-xs italic">
                  {exp.duration}
                </div>
              </div>
              {exp.description.length > 0 && (
                <ul className="space-y-1 mt-2">
                  {exp.description.slice(0, isPreview ? 2 : exp.description.length).map((desc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span style={{ color: getSecondaryColor() }} className="mt-1 text-sm">
                        ▸
                      </span>
                      <span className="text-sm">{desc}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    )

  const renderEducation = () =>
    cvInfo.education && (
      <div className="mb-6">
        <h2
          className={`text-xl font-bold mb-3 pb-2`}
          style={{ borderBottom: `2px solid ${getPrimaryColor()}`, color: getPrimaryColor() }}
        >
          Education
        </h2>
        <div className="text-sm">
          {cvInfo.education.split("\n").map((line, index) => (
            <div key={index} className="mb-1">
              {line.replace(/^\*\*|\*\*/g, "")}
            </div>
          ))}
        </div>
      </div>
    )

  const renderCertifications = () =>
    cvInfo.certifications && (
      <div className="mb-6">
        <h2
          className={`text-xl font-bold mb-3 pb-2`}
          style={{ borderBottom: `2px solid ${getPrimaryColor()}`, color: getPrimaryColor() }}
        >
          Certifications
        </h2>
        <div className="space-y-2">
          {parseListItems(cvInfo.certifications).map((cert, index) => (
            <div key={index} className="flex items-start gap-2">
              <span style={{ color: getPrimaryColor() }} className="mt-1 font-bold">
                ✓
              </span>
              <span className="text-sm">{cert}</span>
            </div>
          ))}
        </div>
      </div>
    )

  const renderLayout = () => {
    switch (style.layoutStyle) {
      case "skills-exp-right":
        return (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2 space-y-6">
              {renderSummary()}
              {renderEducation()}
              {renderCertifications()}
            </div>
            <div className="lg:w-1/2 space-y-6">
              {renderSkills()}
              {renderExperience()}
            </div>
          </div>
        )
      case "edu-first":
        return (
          <div className="space-y-6">
            {renderEducation()}
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2">{renderSkills()}</div>
              <div className="lg:w-1/2">{renderExperience()}</div>
            </div>
            {renderSummary()}
            {renderCertifications()}
          </div>
        )
      case "compact-grid":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>{renderSkills()}</div>
            <div>{renderExperience()}</div>
            <div>{renderEducation()}</div>
            <div className="lg:col-span-3">{renderSummary()}</div>
            <div className="lg:col-span-3">{renderCertifications()}</div>
          </div>
        )
      case "exp-focus":
        return (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-3/4">{renderExperience()}</div>
            <div className="lg:w-1/4 space-y-6">
              {renderSkills()}
              {renderEducation()}
              {renderSummary()}
              {renderCertifications()}
            </div>
          </div>
        )
      case "reverse-stack":
        return (
          <div className="space-y-6">
            {renderCertifications()}
            {renderEducation()}
            {renderExperience()}
            {renderSkills()}
            {renderSummary()}
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            {renderSummary()}
            {renderSkills()}
            {renderExperience()}
            {renderEducation()}
            {renderCertifications()}
          </div>
        )
    }
  }

  return (
    <div
      className={`p-8 rounded-lg ${getStyleClasses()}`}
      style={{
        fontFamily: style.fontFamily || "Inter",
        backgroundColor: getBackgroundColor(),
        color: style.backgroundColor === "#ffffff" ? "#000000" : "#ffffff", 
      }}
    >
      {renderHeader()}
      {renderLayout()}
      {isPreview && (
        <div className="text-center pt-4 mt-4 border-t opacity-60">
          <span className="text-xs">Click to view full CV</span>
        </div>
      )}
    </div>
  )
}

const CVPreview = ({ cv, onEdit, onDelete, style = {} }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showStyleGenerator, setShowStyleGenerator] = useState(false)
  const [currentStyle, setCurrentStyle] = useState(() => {
    const savedStyle = localStorage.getItem("cvStyle")
    return savedStyle ? JSON.parse(savedStyle) : style
  })

  const dropdownRef = useRef()
  const pdfRef = useRef()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDownload = async () => {
    const element = pdfRef.current
    if (!element) return

    try {
      // Ensure currentStyle is used for background color when rendering canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: currentStyle.backgroundColor || "#ffffff",
        useCORS: true,
        allowTaint: true,
      })
      const imgData = canvas.toDataURL("image/jpeg", 1.0)
      const pdf = new jsPDF("p", "mm", "a4")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Professional_CV_${cv._id || "download"}.pdf`) // Use cv._id instead of cv.id
      setDropdownOpen(false)
    } catch (err) {
      console.error("PDF generation failed:", err)
    }
  }

  // Agar CV data available nahi hai ya generatedCV nahi hai, toh loading state dikhao
  if (!cv || !cv.generatedCV) {
    return (
      <div className="flex items-center justify-center h-72">
        {" "}
        {/* Parent card-body height ke hisaab se adjust kiya */}
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-2"></div>
          <p className="text-base-content/60">Loading CV preview...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <motion.div
        onClick={() => setIsModalOpen(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
      >
        <div className="absolute top-4 right-4 z-30" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-40 w-52 p-2 shadow-lg border"
                >
                  <li>
                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        onEdit(cv)
                      }}
                      className="flex items-center gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit CV
                    </button>
                  </li>
                  <li>
                    <button onClick={handleDownload} className="flex items-center gap-2 text-success">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        setShowDeleteConfirm(true)
                      }}
                      className="flex items-center gap-2 text-error"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete CV
                    </button>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="card-body p-6 h-72 overflow-hidden">
      
          <h3 className="text-xl font-semibold text-base-content mb-2 line-clamp-1">{cv.name || "Untitled CV"}</h3>
          <CVDocument cvData={cv.generatedCV} isPreview={true} style={currentStyle} />
        </div>
        <div className="card-actions justify-center p-4 border-t">
          <div className="flex items-center gap-2 text-primary font-medium">
            <Eye className="w-5 h-5" />
            View Professional CV
          </div>
        </div>
      </motion.div>

      {/* Full CV Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-xl shadow-2xl bg-base-100">
                  <div className="navbar bg-base-200 border-b">
                    <div className="navbar-start">
                      <Dialog.Title className="text-xl font-bold">Professional CV Preview</Dialog.Title>
                    </div>
                    <div className="navbar-end gap-2">
                      <button onClick={handleDownload} className="btn btn-success btn-sm gap-2">
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                      <button
                        onClick={() => setShowStyleGenerator(!showStyleGenerator)}
                        className="btn btn-secondary btn-sm gap-2"
                      >
                        <Palette className="w-4 h-4" />
                        Customize Style
                      </button>
                      <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-sm btn-circle">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  {showStyleGenerator && (
                    <div className="p-4 border-b bg-base-200">
                      <CVStyleGenerator
                        onStyleChange={(newStyle) => setCurrentStyle(newStyle)}
                        currentStyle={currentStyle}
                      />
                    </div>
                  )}
                  <div ref={pdfRef} className="overflow-y-auto max-h-[calc(95vh-120px)] p-8">
                 
                    <CVDocument cvData={cv.generatedCV} isPreview={false} style={currentStyle} />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

    
      <Transition appear show={showDeleteConfirm} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowDeleteConfirm(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="card bg-base-100 w-full max-w-md shadow-xl">
                  <div className="card-body">
                    <Dialog.Title className="card-title text-error">Delete CV Confirmation</Dialog.Title>
                    <p>
                      Kya aap waqai is CV ko delete karna chahte hain: <strong>{cv?.name || "Untitled CV"}</strong>? Yeh
                      action wapas nahi liya ja sakta.
                    </p>
                    <div className="card-actions justify-end mt-4">
                      <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-ghost">
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          onDelete(cv) // Pass the entire CV object for deletion
                          setShowDeleteConfirm(false)
                        }}
                        className="btn btn-error"
                      >
                        Delete CV
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default CVPreview

