import { generateReceiptPdf } from './pdfService';

export interface PaymentItem {
  paymentName: string;
  amount: number;
}

export const sendPaymentNotification = async (
  waNumber: string,
  parentName: string,
  studentName: string,
  className: string,
  payments: PaymentItem[],
  date: string,
  schoolName: string
) => {
  const token = import.meta.env.PUBLIC_WA_TOKEN;
  if (!token) {
    console.warn('PUBLIC_WA_TOKEN is not defined in .env');
    return false;
  }

  // Format message
  const message = `Halo Bapak/Ibu Wali dari ${parentName}

Terima kasih, pembayaran atas nama ${studentName} telah berhasil kami terima. Berikut kami lampirkan bukti pembayarannya.`;

  // Generate PDF file
  const pdfFile = generateReceiptPdf(studentName, className, payments, date, schoolName);

  try {
    const formData = new FormData();
    formData.append('target', waNumber);
    formData.append('message', message);
    // Include the third argument for the filename to ensure it's treated as a file upload correctly
    formData.append('file', pdfFile, pdfFile.name);

    const response = await fetch('/api/fonnte/send', {
      method: 'POST',
      headers: {
        'Authorization': token,
      },
      body: formData,
    });

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      alert("Error parsing Fonnte response: " + text.substring(0, 100));
      return false;
    }

    if (result.status) {
      alert('Pesan WA dan Lampiran Bukti Pembayaran Berhasil Dikirim ke ' + waNumber);
      return true;
    } else {
      alert('Gagal mengirim WA. Fonnte: ' + result.reason);
      return false;
    }

  } catch (error: any) {
    alert('Gagal memanggil API Fonnte (Mungkin Server Lokal belum direstart): ' + error.message);
    return false;
  }
};


