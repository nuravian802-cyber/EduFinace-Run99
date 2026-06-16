export const sendPaymentNotification = async (
  waNumber: string,
  studentName: string,
  className: string,
  paymentName: string,
  amount: number,
  date: string,
  schoolName: string
) => {
  const token = import.meta.env.PUBLIC_WA_TOKEN;
  if (!token) {
    console.warn('PUBLIC_WA_TOKEN is not defined in .env');
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
    const response = await fetch('/api/fonnte/send', {
      method: 'POST',
      headers: {
        'Authorization': token,
      },
      body: new URLSearchParams({
        target: waNumber,
        message: message,
      }),
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
      alert('Pesan WA Berhasil Dikirim ke ' + waNumber);
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
