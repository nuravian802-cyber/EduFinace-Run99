import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PaymentItem } from './waService';

export const generateReceiptPdf = (
  studentName: string,
  className: string,
  payments: PaymentItem[],
  date: string,
  schoolName: string
): File => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.text(schoolName, 14, 22);
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text('BUKTI PEMBAYARAN', 14, 32);

  // Info
  doc.setTextColor(0);
  doc.setFontSize(11);
  doc.text(`Tanggal : ${date}`, 14, 45);
  doc.text(`Siswa   : ${studentName}`, 14, 52);
  doc.text(`Kelas   : ${className}`, 14, 59);

  // Table
  const tableData = payments.map((p, index) => [
    index + 1,
    p.paymentName,
    `Rp ${new Intl.NumberFormat('id-ID').format(p.amount)}`
  ]);

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const formattedTotal = `Rp ${new Intl.NumberFormat('id-ID').format(totalAmount)}`;

  tableData.push(['', 'TOTAL', formattedTotal]);

  autoTable(doc, {
    startY: 65,
    head: [['No', 'Deskripsi Pembayaran', 'Nominal']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] },
    willDrawCell: (data) => {
      // Bold the last row (TOTAL)
      if (data.row.index === tableData.length - 1) {
        doc.setFont('helvetica', 'bold');
      }
    },
    columnStyles: {
      0: { cellWidth: 20 },
      2: { halign: 'right' }
    }
  });

  // Footer
  const finalY = (doc as any).lastAutoTable.finalY || 100;
  doc.setFont('helvetica', 'normal');
  doc.text('Penerima / Admin', 140, finalY + 20);
  doc.text('( ........................ )', 135, finalY + 40);

  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text('* Bukti Pembayaran ini jangan sampai hilang', 14, finalY + 50);

  // Create Blob/File
  const pdfBlob = doc.output('blob');
  return new File([pdfBlob], `Nota_${studentName.replace(/\\s+/g, '_')}_${date}.pdf`, { type: 'application/pdf' });
};
