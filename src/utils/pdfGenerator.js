import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates and downloads a PDF from an HTML element
 * Mobile-optimized - creates temporary visible container for proper capture
 * @param {HTMLElement} element - The HTML element to convert to PDF
 * @param {string} fileName - The name of the file to download (without .pdf extension)
 * @param {Object} options - Additional options
 * @param {string} options.orientation - 'p' for portrait, 'l' for landscape (default: 'p')
 * @param {number} options.margin - Margin in mm (default: 5)
 * @returns {Promise<void>}
 */
export const generateAndDownloadPDF = async (element, fileName, options = {}) => {
  const {
    orientation = 'p',
    margin = 5,
  } = options;

  if (!element) {
    throw new Error('Element not found');
  }

  let tempContainer = null;

  try {
    // Create temporary container in viewport for proper rendering
    tempContainer = document.createElement('div');
    tempContainer.id = 'temp-pdf-capture-' + Date.now();
    tempContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: white;
      z-index: 99999;
      overflow: hidden;
      visibility: hidden;
      opacity: 0;
      pointer-events: none;
      padding: 0;
      margin: 0;
    `;

    // Clone the element
    const clonedElement = element.cloneNode(true);
    clonedElement.style.cssText = `
      width: 800px !important;
      height: auto !important;
      max-width: 800px !important;
      margin: 0 !important;
      padding: 20px !important;
      background: white !important;
      box-sizing: border-box !important;
      position: relative !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    `;

    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    // Force layout
    void clonedElement.offsetHeight;
    
    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Capture
    const canvas = await html2canvas(clonedElement, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      imageTimeout: 0,
      proxy: null,
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas capture failed');
    }

    // Convert to image
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    if (!imgData || imgData.length < 100) {
      throw new Error('Image data failed');
    }

    // Create PDF
    const pdf = new jsPDF(orientation, 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - (2 * margin);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add image to PDF
    pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);

    // Handle multi-page
    if (imgHeight > pageHeight) {
      let currentY = margin - pageHeight;
      let remainingHeight = imgHeight - pageHeight;

      while (remainingHeight > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, currentY, imgWidth, imgHeight);
        currentY -= pageHeight;
        remainingHeight -= pageHeight;
      }
    }

    // Generate PDF
    const pdfBlob = pdf.output('blob');
    
    if (!pdfBlob || pdfBlob.size === 0) {
      throw new Error('PDF generation failed');
    }

    // Download
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.pdf`;

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(pdfBlob, `${fileName}.pdf`);
      URL.revokeObjectURL(url);
    } else if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } else {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }

  } catch (error) {
    console.error('PDF error:', error);
    throw new Error(`Error: ${error.message}`);
  } finally {
    if (tempContainer && tempContainer.parentNode) {
      try {
        document.body.removeChild(tempContainer);
      } catch (e) {
        console.warn('Cleanup error:', e);
      }
    }
  }
};

export default generateAndDownloadPDF;
