export const sendPaymentNotification = async (
  waNumber: string,
  studentName: string,
  className: string,
  paymentName: string,
  amount: number,
  date: string,
  schoolName: string
) => {
  const token = import.meta.env.VITE_WA_TOKEN;
  if (!token) {
    console.warn('VITE_WA_TOKEN is not defined in .env');
    return false;
  }

  // Format currency
  const formattedAmount = new Intl.NumberFormat('id-ID').format(amount);

  // Format message
  const message = `Halo Bapak/Ibu Wali dari ${studentName},

Terima kasih, pembayaran telah kami terima dengan rincian nota sebagai berikut:

*Rincian Pembayaran:*
- Nama Siswa: ${studentName}
- Kelas: ${className}
- Pembayaran: ${paymentName}
- Nominal: Rp ${formattedAmount}
- Tanggal: ${date}
- Status: BERHASIL

Salam,
${schoolName}`;

  try {
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': token,
      },
      body: new URLSearchParams({
        target: waNumber,
        message: message,
      }),
    });

    const result = await response.json();
    if (result.status) {
      console.log('WhatsApp notification sent successfully');
      return true;
    } else {
      console.error('Failed to send WhatsApp notification:', result.reason);
      return false;
    }
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return false;
  }
};
