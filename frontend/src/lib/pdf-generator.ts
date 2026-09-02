export async function generateFinancialReport(disruptionId: string, data?: any) {
  // Dynamically import to prevent Next.js SSR compilation hangs
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Define corporate colors
  const primaryColor: [number, number, number] = [15, 23, 42]; // slate-900
  const secondaryColor: [number, number, number] = [100, 116, 139]; // slate-500
  const dangerColor: [number, number, number] = [220, 38, 38]; // red-600
  const warningColor: [number, number, number] = [217, 119, 6]; // amber-600

  // 1. Header (Dark block with white text)
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 28, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ResilienceOS Financial Impact Report', 14, 18);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  doc.text(dateStr, pageWidth - 14, 18, { align: 'right' });

  // 2. Executive Summary
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Executive Summary', 14, 45);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const summaryText = 'This confidential report outlines the projected financial impact and estimated mitigation costs associated with the active supply chain disruption event. The figures presented are based on predictive models over a 10-day projection period and assume no further escalation.';
  doc.text(summaryText, 14, 53, { maxWidth: pageWidth - 28, lineHeightFactor: 1.5 });

  // KPI Boxes (Drawn manually for professional look)
  doc.setDrawColor(226, 232, 240); // border color
  doc.setLineWidth(0.5);
  
  // KPI 1: Revenue at Risk
  doc.setFillColor(254, 242, 242); // red-50
  doc.rect(14, 75, 85, 28, 'FD');
  doc.setTextColor(dangerColor[0], dangerColor[1], dangerColor[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL REVENUE AT RISK', 20, 85);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Rs. 20.0 Cr', 20, 96);

  // KPI 2: Mitigation Cost
  doc.setFillColor(255, 251, 235); // amber-50
  doc.rect(110, 75, 85, 28, 'FD');
  doc.setTextColor(warningColor[0], warningColor[1], warningColor[2]);
  doc.setFontSize(9);
  doc.text('EST. MITIGATION COST', 116, 85);
  doc.setFontSize(20);
  doc.text('Rs. 8.5 Cr', 116, 96);

  // 3. Breakdown Tables
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Revenue Impact by Region', 14, 122);

  // Draw first table
  autoTable(doc, {
    startY: 128,
    head: [['Region', 'Impact Value', 'Percentage']],
    body: [
      ['APAC (Asia Pacific)', 'Rs. 12.5 Cr', '62.5%'],
      ['EMEA (Europe, Middle East, Africa)', 'Rs. 5.2 Cr', '26.0%'],
      ['AMER (Americas)', 'Rs. 2.3 Cr', '11.5%'],
    ],
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 6, textColor: primaryColor }
  });

  const finalY = (doc as any).lastAutoTable.finalY || 180;

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Mitigation Cost Breakdown', 14, finalY + 18);

  // Draw second table
  autoTable(doc, {
    startY: finalY + 24,
    head: [['Cost Category', 'Description', 'Estimated Cost']],
    body: [
      ['Premium Freight', 'Air freight and expediting fees for critical components', 'Rs. 4.2 Cr'],
      ['Plant Overtime', 'Extra shifts to recover lost production volume', 'Rs. 2.8 Cr'],
      ['SLA Penalties', 'Customer compensation for late deliveries', 'Rs. 1.5 Cr'],
      ['Total Expected Mitigation', 'Total authorized spend limit', 'Rs. 8.5 Cr']
    ],
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 6, textColor: primaryColor },
    didParseCell: function (data) {
        // Highlight the total row
        if (data.row.index === 3 && data.section === 'body') {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [255, 251, 235]; // amber-50
            data.cell.styles.textColor = warningColor;
        }
    }
  });

  // Footer for all pages
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);
    
    doc.setFontSize(8);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(`ResilienceOS - Confidential & Proprietary`, 14, pageHeight - 10);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
  }

  // Save the PDF to the user's browser
  doc.save(`Financial_Report_${disruptionId}.pdf`);
}
