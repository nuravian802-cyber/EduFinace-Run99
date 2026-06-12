import * as XLSX from 'xlsx';

/**
 * Ekspor data JSON menjadi file Excel
 * @param data Array of objects yang berisi data
 * @param fileName Nama file (tanpa ekstensi .xlsx)
 */
export const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * Impor file Excel dan ubah menjadi array of objects JSON
 * @param file Objek File dari input type="file"
 * @returns Promise yang me-resolve array of objects (JSON)
 */
export const importFromExcel = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Ambil sheet pertama saja
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Ambil data dalam bentuk array 2D
        const rawData = XLSX.utils.sheet_to_json(worksheet, { raw: false, header: 1 }) as any[][];
        
        if (!rawData || rawData.length === 0) {
          resolve([]);
          return;
        }

        // Cari baris yang kemungkinan besar adalah Header
        // (mengandung kata 'nama' atau 'nis')
        let headerRowIndex = 0;
        for (let i = 0; i < Math.min(rawData.length, 20); i++) { // Cari di 20 baris pertama
          const row = rawData[i];
          if (!Array.isArray(row)) continue;
          
          const rowStrings = row.map(v => String(v || '').toLowerCase().replace(/\s+/g, ''));
          if (rowStrings.includes('nis') || rowStrings.includes('nama') || rowStrings.includes('namasiswa') || rowStrings.includes('namalengkap') || rowStrings.includes('nisn')) {
            headerRowIndex = i;
            break;
          }
        }

        // Ambil header dan normalisasi
        const headers = (rawData[headerRowIndex] || []).map(h => String(h || '').toLowerCase().replace(/\s+/g, ''));
        
        const jsonData: any[] = [];
        
        // Loop mulai dari baris setelah header
        for (let i = headerRowIndex + 1; i < rawData.length; i++) {
          const row = rawData[i];
          if (!Array.isArray(row) || row.length === 0) continue;
          
          const obj: any = {};
          let hasValue = false;
          
          for (let j = 0; j < headers.length; j++) {
            const key = headers[j];
            const value = row[j];
            
            if (key) {
              obj[key] = value;
              if (value !== undefined && value !== null && value !== '') {
                hasValue = true;
              }
            }
          }
          
          if (hasValue) {
            jsonData.push(obj);
          }
        }
        
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
