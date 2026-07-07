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

  let totalAmount = 0;
  const paymentDetails = payments.map((p) => {
    totalAmount += p.amount;
    const isDiscount = p.amount < 0;
    const absAmount = Math.abs(p.amount);
    const formattedAmount = new Intl.NumberFormat('id-ID').format(absAmount);
    if (isDiscount) {
      return `- ${p.paymentName}: -Rp ${formattedAmount}`;
    }
    return `- ${p.paymentName}: Rp ${formattedAmount}`;
  }).join('\n');

  const formattedTotal = new Intl.NumberFormat('id-ID').format(totalAmount);

  // Format message
  const message = `Halo Bapak/Ibu Wali dari ${parentName},

Terima kasih, pembayaran telah kami terima dengan rincian nota sebagai berikut:

*Rincian Pembayaran:*
- Nama Siswa: ${studentName}
- Kelas: ${className}
- Tanggal: ${date}

*Daftar Transaksi:*
${paymentDetails}

*Total Nominal: Rp ${formattedTotal}*
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



