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

    // Force desktop layout by adding pdf-render-mode class
    element.classList.add('pdf-render-mode');

    // Wait to ensure element is fully rendered
    await new Promise(resolve => setTimeout(resolve, 500));

    // ALWAYS use A4 width (794px) for PDF generation regardless of device
    // This ensures consistent PDF layout on both desktop and mobile
    const A4_WIDTH = 794;
    const elementHeight = element.scrollHeight || element.offsetHeight;

    // Generate canvas with fixed A4 dimensions
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: A4_WIDTH,
      windowHeight: elementHeight,
    });

    // Only proceed if canvas has actual content
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas capture failed - element may not be visible');
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.9);

    const pdf = new jsPDF(orientation, 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

    const imgWidth = pageWidth - (2 * margin); // 200mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add image to PDF (all at once)
    pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);

    // If content is very tall, split across multiple pages
    if (imgHeight > pageHeight) {
      let remainingHeight = imgHeight - pageHeight;
      let currentPosition = 0;

      while (remainingHeight > 0) {
        pdf.addPage();
        currentPosition -= pageHeight;
        pdf.addImage(imgData, 'JPEG', margin, currentPosition, imgWidth, imgHeight);
        remainingHeight -= pageHeight;
      }
    }

    // Create blob and download (works on both desktop and mobile)
    const pdfBlob = pdf.output('blob');
    
    // Verify PDF blob is not empty
    if (!pdfBlob || pdfBlob.size === 0) {
      throw new Error('PDF generation resulted in empty file');
    }

    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup after download has time to start
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
    // Remove pdf-render-mode class
    element.classList.remove('pdf-render-mode');
  } catch (error) {
    // Remove pdf-render-mode class on error
    element.classList.remove('pdf-render-mode');
    console.error('Error generating PDF:', error);
    throw new Error(`Error generating PDF: ${error.message}`);
  }
};

export default generateAndDownloadPDF;
