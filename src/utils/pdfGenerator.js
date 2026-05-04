import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates and downloads a PDF from an HTML element
 * Mobile-optimized to work on both desktop and mobile devices
 * @param {HTMLElement} element - The HTML element to convert to PDF
 * @param {string} fileName - The name of the file to download (without .pdf extension)
 * @param {Object} options - Additional options
 * @param {string} options.orientation - 'p' for portrait, 'l' for landscape (default: 'p')
 * @param {number} options.margin - Margin in mm (default: 10)
 * @returns {Promise<void>}
 */
export const generateAndDownloadPDF = async (element, fileName, options = {}) => {
  try {
    const {
      orientation = 'p',
      margin = 10,
    } = options;

    if (!element) {
      throw new Error('Element not found');
    }

    // Detect if mobile device
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const scale = isMobile ? 1.5 : 2; // Lower scale for mobile to avoid memory issues

    // Generate canvas with mobile-friendly options
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowHeight: element.scrollHeight,
      windowWidth: element.scrollWidth,
    });

    const imgData = canvas.toDataURL('image/png', 0.9); // Compress image data

    const pdf = new jsPDF(orientation, 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - (2 * margin);

    // Calculate height maintaining aspect ratio
    let contentHeight = (canvas.height * contentWidth) / canvas.width;
    let currentY = margin;

    // Handle multiple pages if content is too large
    while (contentHeight > 0) {
      const remainingHeight = pageHeight - currentY - margin;

      if (contentHeight <= remainingHeight) {
        pdf.addImage(imgData, 'PNG', margin, currentY, contentWidth, contentHeight);
        break;
      } else {
        // Calculate portion to fit on current page
        const portionHeight = remainingHeight;
        const sourceHeight = (portionHeight * canvas.width) / contentWidth;
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = canvas.width;
        cropCanvas.height = sourceHeight;
        const ctx = cropCanvas.getContext('2d');
        ctx.drawImage(
          canvas,
          0,
          (canvas.height - contentHeight) * (canvas.width / contentWidth),
          canvas.width,
          sourceHeight
        );

        const croppedImgData = cropCanvas.toDataURL('image/png', 0.9);
        pdf.addImage(croppedImgData, 'PNG', margin, currentY, contentWidth, portionHeight);

        contentHeight -= portionHeight;

        // Add new page if more content exists
        if (contentHeight > 0) {
          pdf.addPage();
          currentY = margin;
        }
      }
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
