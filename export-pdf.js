
async function exportPageToPDF() {
  try {
    if (typeof html2canvas !== 'function') {
      throw new Error('html2canvas no está definido. Verifica el <script> de html2canvas.');
    }
    if (!window.jspdf || typeof window.jspdf.jsPDF !== 'function') {
      throw new Error('jsPDF no está definido. Verifica el <script> de jspdf.');
    }
    const cvElement = document.getElementById('cv-content');
    const canvas = await html2canvas(cvElement, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new window.jspdf.jsPDF({
      unit: 'pt',
      format: 'legal',
      orientation: 'portrait'
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;
    while (heightLeft > 0) {
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
      position -= pageHeight;
      if (heightLeft > 0) pdf.addPage();
    }
    pdf.save('CV_Aleixer_Alvarado_Bernal.pdf');
  } catch (err) {
    console.error(err);
    alert('Error al generar PDF: ' + err.message);
  }
}
document.getElementById('export-pdf')
  .addEventListener('click', exportPageToPDF);
