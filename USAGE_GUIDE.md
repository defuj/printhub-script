# 📖 PrintHub - Panduan Penggunaan Lengkap

Dokumentasi lengkap untuk menggunakan semua fungsi PrintHub library.

## 📋 Daftar Isi
- [Instalasi](#instalasi)
- [Inisialisasi](#inisialisasi)
- [Koneksi ke Printer](#koneksi-ke-printer)
- [Fungsi-Fungsi Pencetakan](#fungsi-fungsi-pencetakan)
  - [writeText](#writetext---mencetak-teks)
  - [writeTextWith2Column](#writetextwith2column---mencetak-2-kolom)
  - [writeTextMultiColumn](#writetextmulticolumn---mencetak-3-kolom) 🆕
  - [writeDashLine](#writedashline---mencetak-garis-putus-putus)
  - [writeLineBreak](#writelinebreak---mencetak-baris-kosong)
  - [putImageWithUrl](#putimagewithurl---mencetak-gambar-dari-url)
- [Contoh Lengkap](#contoh-lengkap)

---

## 🚀 Instalasi

### Via NPM
```bash
npm install printhub
```

### Via CDN
```html
<script src="https://cdn.jsdelivr.net/npm/printhub@latest/dist/index.global.js"></script>
```

---

## 🎯 Inisialisasi

### Menggunakan NPM/ES6
```javascript
import PrintHub from "printhub";

// Printer Bluetooth dengan kertas 58mm (default)
const printer = new PrintHub();

// Printer Bluetooth dengan kertas 80mm
const printer = new PrintHub({ paperSize: "80" });

// Printer USB dengan kertas 58mm
const printer = new PrintHub({ printerType: "usb" });

// Printer USB dengan kertas 80mm
const printer = new PrintHub({ paperSize: "80", printerType: "usb" });
```

### Menggunakan CDN
```javascript
// Printer Bluetooth dengan kertas 58mm (default)
const printer = new PrintHub.init();

// Printer Bluetooth dengan kertas 80mm
const printer = new PrintHub.init({ paperSize: "80" });

// Printer USB dengan kertas 58mm
const printer = new PrintHub.init({ printerType: "usb" });
```

### Parameter Inisialisasi

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| `paperSize` | string | "58" | Ukuran kertas: "58" atau "80" |
| `printerType` | string | "bluetooth" | Tipe printer: "bluetooth" atau "usb" |

---

## 🔌 Koneksi ke Printer

### connectToPrint()

Method utama untuk menghubungkan ke printer. Wajib dipanggil sebelum mencetak.

**Syntax:**
```javascript
printer.connectToPrint({
  onReady: (print) => { /* kode cetak di sini */ },
  onFailed: (message) => { /* handle error */ }
});
```

**Parameters:**

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `onReady` | Function | Callback saat koneksi berhasil, menerima instance printer |
| `onFailed` | Function | Callback saat koneksi gagal, menerima pesan error |

**Contoh:**
```javascript
printer.connectToPrint({
  onReady: async (print) => {
    await print.writeText("Koneksi berhasil!");
    await print.writeLineBreak(2);
  },
  onFailed: (message) => {
    console.error("Gagal terhubung:", message);
    alert("Tidak bisa terhubung ke printer: " + message);
  }
});
```

---

## 📝 Fungsi-Fungsi Pencetakan

### writeText() - Mencetak Teks

Mencetak teks dengan berbagai opsi format seperti bold, underline, alignment, dan ukuran.

**Syntax:**
```javascript
await print.writeText(text, options);
```

**Parameters:**

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| `text` | string | - | Teks yang akan dicetak |
| `options.bold` | boolean | false | Cetak dengan huruf tebal |
| `options.underline` | boolean | false | Cetak dengan garis bawah |
| `options.align` | string | "left" | Alignment: "left", "center", "right" |
| `options.size` | string | "normal" | Ukuran: "normal", "double" |

**Contoh:**
```javascript
// Teks biasa
await print.writeText("Hello World");

// Teks bold dan center
await print.writeText("STRUK PEMBAYARAN", { 
  bold: true, 
  align: "center" 
});

// Teks dengan ukuran double
await print.writeText("TOTAL", { 
  size: "double", 
  bold: true 
});

// Kombinasi semua opsi
await print.writeText("PENTING!", { 
  bold: true, 
  underline: true, 
  align: "center", 
  size: "double" 
});
```

---

### writeTextWith2Column() - Mencetak 2 Kolom

Mencetak teks dalam 2 kolom (kiri dan kanan), berguna untuk item dengan harga.

**Syntax:**
```javascript
await print.writeTextWith2Column(text1, text2, options);
```

**Parameters:**

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| `text1` | string | - | Teks kolom kiri |
| `text2` | string | - | Teks kolom kanan |
| `options.bold` | boolean | false | Cetak dengan huruf tebal |
| `options.underline` | boolean | false | Cetak dengan garis bawah |
| `options.align` | string | "left" | Alignment keseluruhan |
| `options.size` | string | "normal" | Ukuran: "normal", "double" |

**Contoh:**
```javascript
// Item dengan harga
await print.writeTextWith2Column("Nasi Goreng", "Rp 25.000");
await print.writeTextWith2Column("Es Teh", "Rp 5.000");

// Total dengan format bold
await print.writeTextWith2Column("TOTAL", "Rp 30.000", { 
  bold: true 
});

// Dengan ukuran double
await print.writeTextWith2Column("BAYAR", "Rp 50.000", { 
  size: "double" 
});
```

**Output (kertas 58mm):**
```
Nasi Goreng              Rp 25.000
Es Teh                    Rp 5.000
--------------------------------
TOTAL                    Rp 30.000
```

---

### writeTextMultiColumn() - Mencetak 3+ Kolom

Mencetak teks dalam 3 atau lebih kolom. Berguna untuk mencetak tabel dengan data yang lebih kompleks seperti No, Item, Quantity, dan Price.

**Syntax:**
```javascript
await print.writeTextMultiColumn(columns, options);
```

**Parameters:**

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| `columns` | string[] | - | Array berisi teks untuk setiap kolom |
| `options.columnWidths` | number[] | Auto | Lebar setiap kolom dalam karakter. Jika tidak diset, akan dibagi rata |
| `options.align` | string[] | ["left",...] | Alignment untuk setiap kolom: "left", "center", "right" |
| `options.bold` | boolean | false | Cetak dengan huruf tebal |
| `options.underline` | boolean | false | Cetak dengan garis bawah |
| `options.size` | string | "normal" | Ukuran: "normal", "double" |

**Contoh:**
```javascript
// Tabel sederhana dengan 4 kolom
await print.writeTextMultiColumn(
  ["No", "Item", "Qty", "Price"],
  {
    columnWidths: [3, 15, 5, 9], // Total: 32 char (58mm)
    align: ["left", "left", "center", "right"],
    bold: true
  }
);

// Data baris
await print.writeTextMultiColumn(
  ["1", "Nasi Goreng", "2x", "Rp 50.000"],
  {
    columnWidths: [3, 15, 5, 9],
    align: ["left", "left", "center", "right"]
  }
);

// Dengan auto width (dibagi rata)
await print.writeTextMultiColumn(
  ["Left", "Center", "Right"],
  { align: ["left", "center", "right"] }
);

// Total dengan merge kolom
await print.writeTextMultiColumn(
  ["", "", "TOTAL:", "Rp 150.000"],
  {
    columnWidths: [3, 15, 5, 9],
    align: ["left", "left", "right", "right"],
    bold: true,
    size: "double"
  }
);
```

**Output (kertas 58mm):**
```
No Item            Qty   Price
1  Nasi Goreng     2x   Rp 50.000
2  Es Teh          3x   Rp 15.000
--------------------------------
              TOTAL:  Rp 150.000
```

**Tips:**
- **58mm paper**: Total width adalah 32 karakter
- **80mm paper**: Total width adalah 42 karakter
- Gunakan `columnWidths` untuk kontrol lebih presisi
- Jika tidak set, lebar kolom akan dibagi rata otomatis
- Text yang terlalu panjang akan dipotong dengan tanda "~"
- Gunakan alignment "right" untuk kolom harga/angka
- Gunakan alignment "center" untuk kolom quantity/status

---

### writeDashLine() - Mencetak Garis Putus-Putus

Mencetak garis pemisah (dash line) yang otomatis menyesuaikan dengan ukuran kertas.

**Syntax:**
```javascript
await print.writeDashLine();
```

**Output:**
- Kertas 58mm: `--------------------------------` (32 karakter)
- Kertas 80mm: `------------------------------------------` (42 karakter)

**Contoh:**
```javascript
await print.writeText("HEADER");
await print.writeDashLine();
await print.writeText("Content");
await print.writeDashLine();
```

---

### writeLineBreak() - Mencetak Baris Kosong

Mencetak baris kosong (line break/enter).

**Syntax:**
```javascript
await print.writeLineBreak(options);
```

**Parameters:**

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| `options.count` | number | 1 | Jumlah baris kosong |

**Contoh:**
```javascript
// 1 baris kosong
await print.writeLineBreak();

// 3 baris kosong
await print.writeLineBreak({ count: 3 });

// 5 baris kosong (untuk memotong kertas)
await print.writeLineBreak({ count: 5 });
```

---

### putImageWithUrl() - Mencetak Gambar dari URL

Mencetak gambar dari URL. Gambar akan otomatis di-resize ke 120x120px dan dikonversi ke monochrome.

**Syntax:**
```javascript
await print.putImageWithUrl(url, options);
```

**Parameters:**

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| `url` | string | - | URL gambar (PNG, JPG, dll) |
| `options.align` | string | "left" | Alignment: "left", "center", "right" |
| `options.onFailed` | Function | - | Callback jika gagal |

**Contoh:**
```javascript
// Mencetak logo sederhana
await print.putImageWithUrl("https://example.com/logo.png");

// Mencetak dengan alignment center
await print.putImageWithUrl("https://example.com/logo.png", { 
  align: "center" 
});

// Dengan error handling
await print.putImageWithUrl(
  "https://example.com/logo.png",
  {
    align: "center",
    onFailed: (message) => {
      console.error("Gagal mencetak gambar:", message);
      alert("Tidak bisa mencetak gambar: " + message);
    }
  }
);
```

**Catatan:**
- Gambar akan di-resize ke 120x120 piksel
- Gambar dikonversi ke hitam putih (monochrome)
- Gunakan gambar dengan kontras tinggi untuk hasil terbaik
- Format yang didukung: PNG, JPG, GIF, dll

---

## 💡 Contoh Lengkap

### Contoh 1: Struk Pembayaran Sederhana

```javascript
const printer = new PrintHub({ paperSize: "58" });

printer.connectToPrint({
  onReady: async (print) => {
    // Header
    await print.writeText("TOKO SAYA", { 
      align: "center", 
      bold: true, 
      size: "double" 
    });
    await print.writeText("Jl. Contoh No. 123", { align: "center" });
    await print.writeText("Telp: 021-12345678", { align: "center" });
    await print.writeDashLine();
    
    // Tanggal & No
    await print.writeTextWith2Column("No Nota", "001");
    await print.writeTextWith2Column("Tanggal", "06/10/2024");
    await print.writeDashLine();
    
    // Items
    await print.writeTextWith2Column("Nasi Goreng", "Rp 25.000");
    await print.writeTextWith2Column("Es Teh", "Rp 5.000");
    await print.writeTextWith2Column("Ayam Bakar", "Rp 30.000");
    await print.writeDashLine();
    
    // Total
    await print.writeTextWith2Column("TOTAL", "Rp 60.000", { bold: true });
    await print.writeTextWith2Column("BAYAR", "Rp 100.000");
    await print.writeTextWith2Column("KEMBALI", "Rp 40.000", { bold: true });
    await print.writeDashLine();
    
    // Footer
    await print.writeText("Terima Kasih", { align: "center" });
    await print.writeText("Selamat Datang Kembali", { align: "center" });
    await print.writeLineBreak({ count: 5 });
  },
  onFailed: (message) => {
    alert("Gagal terhubung: " + message);
  }
});
```

### Contoh 2: Struk dengan Logo

```javascript
const printer = new PrintHub({ paperSize: "80", printerType: "bluetooth" });

printer.connectToPrint({
  onReady: async (print) => {
    // Logo
    await print.putImageWithUrl("https://example.com/logo.png", {
      align: "center"
    });
    await print.writeLineBreak();
    
    // Header
    await print.writeText("RESTO MAKAN ENAK", { 
      align: "center", 
      bold: true 
    });
    await print.writeDashLine();
    
    // Content
    await print.writeTextWith2Column("1x Nasi Goreng", "Rp 25.000");
    await print.writeTextWith2Column("2x Es Teh", "Rp 10.000");
    await print.writeDashLine();
    
    // Total
    await print.writeTextWith2Column("TOTAL", "Rp 35.000", { 
      bold: true,
      size: "double" 
    });
    
    await print.writeLineBreak({ count: 3 });
  },
  onFailed: (message) => alert(message)
});
```

### Contoh 3: Struk dengan Multi Column (Tabel) 🆕

```javascript
const printer = new PrintHub({ paperSize: "58" });

printer.connectToPrint({
  onReady: async (print) => {
    // Header
    await print.writeText("RESTO JAYA", { 
      align: "center", 
      bold: true, 
      size: "double" 
    });
    await print.writeText("Jl. Sudirman No. 45", { align: "center" });
    await print.writeDashLine();
    
    // Invoice Info
    await print.writeTextWith2Column("No Nota", "INV-001");
    await print.writeTextWith2Column("Tanggal", "10/10/2024");
    await print.writeDashLine();
    
    // Table Header dengan 4 kolom
    await print.writeTextMultiColumn(
      ["No", "Item", "Qty", "Harga"],
      {
        columnWidths: [3, 14, 5, 10],
        align: ["left", "left", "center", "right"],
        bold: true,
        underline: true
      }
    );
    
    // Table Rows
    await print.writeTextMultiColumn(
      ["1", "Nasi Goreng", "2", "50.000"],
      {
        columnWidths: [3, 14, 5, 10],
        align: ["left", "left", "center", "right"]
      }
    );
    
    await print.writeTextMultiColumn(
      ["2", "Es Teh Manis", "3", "15.000"],
      {
        columnWidths: [3, 14, 5, 10],
        align: ["left", "left", "center", "right"]
      }
    );
    
    await print.writeTextMultiColumn(
      ["3", "Ayam Bakar", "1", "35.000"],
      {
        columnWidths: [3, 14, 5, 10],
        align: ["left", "left", "center", "right"]
      }
    );
    
    await print.writeDashLine();
    
    // Subtotal
    await print.writeTextMultiColumn(
      ["", "", "Subtotal:", "100.000"],
      {
        columnWidths: [3, 14, 5, 10],
        align: ["left", "left", "right", "right"]
      }
    );
    
    // Tax
    await print.writeTextMultiColumn(
      ["", "", "Pajak 10%:", "10.000"],
      {
        columnWidths: [3, 14, 5, 10],
        align: ["left", "left", "right", "right"]
      }
    );
    
    await print.writeDashLine();
    
    // Total
    await print.writeTextMultiColumn(
      ["", "", "TOTAL:", "110.000"],
      {
        columnWidths: [3, 14, 5, 10],
        align: ["left", "left", "right", "right"],
        bold: true,
        size: "double"
      }
    );
    
    await print.writeDashLine();
    await print.writeText("Terima Kasih", { align: "center" });
    await print.writeLineBreak({ count: 3 });
  },
  onFailed: (message) => {
    alert("Gagal terhubung: " + message);
  }
});
```

### Contoh 4: Dengan Error Handling Lengkap

```javascript
const printer = new PrintHub({ 
  paperSize: "58", 
  printerType: "bluetooth" 
});

printer.connectToPrint({
  onReady: async (print) => {
    try {
      // Header
      await print.writeText("INVOICE", { 
        align: "center", 
        bold: true 
      });
      await print.writeDashLine();
      
      // Data
      const items = [
        { name: "Item 1", price: "Rp 10.000" },
        { name: "Item 2", price: "Rp 20.000" },
        { name: "Item 3", price: "Rp 30.000" }
      ];
      
      for (const item of items) {
        await print.writeTextWith2Column(item.name, item.price);
      }
      
      await print.writeDashLine();
      await print.writeTextWith2Column("TOTAL", "Rp 60.000", { 
        bold: true 
      });
      
      await print.writeLineBreak({ count: 3 });
      
      console.log("✅ Cetak berhasil!");
      
    } catch (error) {
      console.error("❌ Error saat mencetak:", error);
      alert("Gagal mencetak: " + error.message);
    }
  },
  onFailed: (message) => {
    console.error("❌ Gagal terhubung:", message);
    
    if (message.includes("Bluetooth")) {
      alert("Browser Anda tidak mendukung Bluetooth.\nGunakan Chrome, Edge, atau Opera.");
    } else if (message.includes("USB")) {
      alert("Gagal terhubung ke USB printer.\nPastikan driver sudah terinstall.");
    } else {
      alert("Koneksi gagal: " + message);
    }
  }
});
```

---

## 🎨 Tips & Best Practices

### 1. Gunakan Alignment yang Tepat
```javascript
// Header - center
await print.writeText("NAMA TOKO", { align: "center", bold: true });

// Content - left (default)
await print.writeText("Alamat toko...");

// Total - gunakan 2 kolom agar rapi
await print.writeTextWith2Column("Total", "Rp 100.000");
```

### 2. Gunakan Dash Line untuk Pemisah
```javascript
await print.writeText("HEADER");
await print.writeDashLine();  // Pemisah
await print.writeText("Content");
await print.writeDashLine();  // Pemisah
await print.writeText("Footer");
```

### 3. Beri Line Break yang Cukup di Akhir
```javascript
// ... cetak struk
await print.writeLineBreak({ count: 5 });  // Agar mudah dipotong
```

### 4. Handle Error dengan Baik
```javascript
printer.connectToPrint({
  onReady: async (print) => {
    try {
      // Kode cetak
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    }
  },
  onFailed: (message) => {
    // Tampilkan pesan yang user-friendly
    if (message.includes("Bluetooth")) {
      alert("Bluetooth tidak tersedia");
    } else {
      alert("Gagal: " + message);
    }
  }
});
```

### 5. Untuk Gambar, Gunakan Kontras Tinggi
```javascript
// ✅ Bagus: Logo hitam putih dengan kontras tinggi
await print.putImageWithUrl("https://example.com/logo-bw.png");

// ❌ Kurang bagus: Gambar berwarna dengan gradasi
await print.putImageWithUrl("https://example.com/logo-color.png");
```

---

## 🔧 Troubleshooting

### Koneksi Bluetooth Gagal
- Pastikan browser mendukung Web Bluetooth (Chrome, Edge, Opera)
- Pastikan Bluetooth sudah aktif di perangkat
- Nyalakan printer dan pastikan dalam mode pairing

### Koneksi USB Gagal
- **Windows**: Install driver WinUSB menggunakan Zadig
- **Linux**: Setup udev rules untuk akses USB
- **macOS**: Berikan permission untuk akses USB

### Gambar Tidak Tercetak
- Cek URL gambar bisa diakses (CORS enabled)
- Gunakan gambar dengan kontras tinggi
- Pastikan ukuran gambar tidak terlalu besar

### Teks Terpotong
- Sesuaikan paperSize dengan printer Anda ("58" atau "80")
- Untuk teks panjang, gunakan line break manual

---

## 📚 Referensi API Lengkap

### Methods

| Method | Deskripsi | Return |
|--------|-----------|--------|
| `connectToPrint(callbacks)` | Hubungkan ke printer | void |
| `writeText(text, options)` | Cetak teks | Promise\<void\> |
| `writeTextWith2Column(text1, text2, options)` | Cetak 2 kolom | Promise\<void\> |
| `writeDashLine()` | Cetak garis putus-putus | Promise\<void\> |
| `writeLineBreak(options)` | Cetak baris kosong | Promise\<void\> |
| `putImageWithUrl(url, options)` | Cetak gambar dari URL | Promise\<void\> |
| `setPaperSize(size)` | Ubah ukuran kertas | void |
| `checkBluetooth()` | Cek ketersediaan Bluetooth | Promise\<boolean\> |

---

## 📄 License

MIT License - Lihat file LICENSE untuk detail.

## 🤝 Support

Jika ada pertanyaan atau masalah, silakan buat issue di:
https://github.com/defuj/printhub/issues

---

**Happy Printing! 🖨️**
