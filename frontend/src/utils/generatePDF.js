// utils/generatePDF.js
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const generateCVPDF = async (cvData, elementId = 'cv-preview') => {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error('CV preview element not found')
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#0f172a' // dark background for dark mode
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()
  
  // Calculate aspect ratio to fit the page
  const imgWidth = canvas.width
  const imgHeight = canvas.height
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
  const imgX = (pdfWidth - imgWidth * ratio) / 2
  const imgY = 0

  pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
  pdf.save(`${cvData.name || 'CV'}-${new Date().getTime()}.pdf`)
}