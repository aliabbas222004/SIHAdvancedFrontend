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

    // Wait for everything to render
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get the element's actual rendered width
    const elementWidth = element.offsetWidth || element.scrollWidth || 800;
    const elementHeight = element.scrollHeight || element.offsetHeight;

    console.log('Capturing PDF:', { elementWidth, elementHeight });

    // Generate canvas - use element's actual width
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: elementWidth,
      windowHeight: elementHeight,
      proxy: null,
      imageTimeout: 0,
    });

    console.log('Canvas generated:', { width: canvas.width, height: canvas.height });

    // Only proceed if canvas has actual content
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas capture failed - element may not be visible or has no dimensions');
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    const pdf = new jsPDF(orientation, 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

    const imgWidth = pageWidth - (2 * margin); // 200mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add first page
    pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);

    // If content spans multiple pages, add them
    if (imgHeight > pageHeight) {
      let remainingHeight = imgHeight - pageHeight;
      let currentPosition = -pageHeight + margin;

      while (remainingHeight > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, currentPosition, imgWidth, imgHeight);
        remainingHeight -= pageHeight;
        currentPosition -= pageHeight;
      }
    }

    // Generate and download
    const pdfBlob = pdf.output('blob');

    console.log('PDF blob size:', pdfBlob.size);

    if (!pdfBlob || pdfBlob.size === 0) {
      throw new Error('PDF generation resulted in empty file');
    }

    // Use native download for better mobile compatibility
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.pdf`;
    
    // Trigger download
    if (navigator.msSaveBlob) {
      // For IE and Edge
      navigator.msSaveBlob(pdfBlob, `${fileName}.pdf`);
    } else {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 2000);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`PDF Error: ${error.message}`);
  }
};

export default generateAndDownloadPDF;
