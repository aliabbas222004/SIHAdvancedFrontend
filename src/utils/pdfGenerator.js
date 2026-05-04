import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates and downloads a PDF from an HTML element
 * Mobile-optimized to work on both desktop and mobile devices
 * @param {HTMLElement} element - The HTML element to convert to PDF
 * @param {string} fileName - The name of the file to download (without .pdf extension)
 * @param {Object} options - Additional options
 * @param {string} options.orientation - 'p' for portrait, 'l' for landscape (default: 'p')
 * @param {number} options.margin - Margin in mm (default: 5)
 * @returns {Promise<void>}
 */
export const generateAndDownloadPDF = async (element, fileName, options = {}) => {
  try {
    const {
      orientation = 'p',
      margin = 5,
    } = options;

    if (!element) {
      throw new Error('Element not found');
    }

    // Wait to ensure element is fully rendered
    await new Promise(resolve => setTimeout(resolve, 500));

    // Detect if mobile device
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const scale = isMobile ? 1 : 1.5; // Lower scale for mobile

    // Generate canvas with mobile-friendly options
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      // Don't set windowHeight/windowWidth - let html2canvas auto-detect
    });

    // Only proceed if canvas has actual content
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas capture failed - element may not be visible');
    }

    const imgData = canvas.toDataURL('image/png', 0.95);

    const pdf = new jsPDF(orientation, 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - (2 * margin);

    // Calculate height maintaining aspect ratio
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Single page or multi-page handling
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);

    // Add additional pages if needed
    heightLeft -= pageHeight;
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Create blob and download (works on both desktop and mobile)
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Error generating PDF: ${error.message}`);
  }
};

export default generateAndDownloadPDF;
