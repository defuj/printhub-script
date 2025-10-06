# 📱 PrintHub - Fitur QR Code

Panduan lengkap penggunaan fitur **printQRCode()** untuk mencetak QR Code ke thermal printer.

---

## 🎯 Apa itu printQRCode()?

Method `printQRCode()` memungkinkan Anda untuk:
- ✅ Generate dan cetak QR Code secara otomatis
- ✅ Support berbagai ukuran (small, medium, large)
- ✅ Perfect untuk payment QR (QRIS, GoPay, OVO, dll)
- ✅ Bisa untuk URL, tracking number, atau data apapun
- ✅ Support error correction level
- ✅ Auto alignment (left, center, right)

---

## 📦 Dependencies

Fitur ini menggunakan library **qrcode** yang sudah ter-bundle dalam package:

```bash
npm install printhub
# qrcode sudah included, tidak perlu install terpisah
```

---

## 🚀 Cara Penggunaan

### 1. Basic Usage - QR Code Sederhana

```javascript
import PrintHub from "printhub";

const printer = new PrintHub({ paperSize: "58" });

printer.connectToPrint({
  onReady: async (print) => {
    // Cetak QR Code untuk URL
    await print.printQRCode("https://example.com");
    
    await print.writeLineBreak({ count: 3 });
  },
  onFailed: (message) => alert(message)
});
```

**Output:**
```
        [QR CODE]
```

---

### 2. QR Code dengan Ukuran Custom

```javascript
printer.connectToPrint({
  onReady: async (print) => {
    // Small QR (100x100px)
    await print.printQRCode("https://small.com", {
      size: "small",
      align: "center"
    });
    
    await print.writeLineBreak();
    
    // Medium QR (200x200px) - Default
    await print.printQRCode("https://medium.com", {
      size: "medium",
      align: "center"
    });
    
    await print.writeLineBreak();
    
    // Large QR (300x300px)
    await print.printQRCode("https://large.com", {
      size: "large",
      align: "center"
    });
  }
});
```

**Size Options:**
- `"small"` → 100x100 pixels
- `"medium"` → 200x200 pixels (default)
- `"large"` → 300x300 pixels

---

### 3. QR Code untuk QRIS Payment

```javascript
// Data QRIS dari payment gateway
const qrisData = "00020101021126..."; // QRIS string

printer.connectToPrint({
  onReady: async (print) => {
    // Header
    await print.writeText("TOKO SAYA", { 
      align: "center", 
      bold: true, 
      size: "double" 
    });
    await print.writeDashLine();
    
    // Items
    await print.writeTextWith2Column("Nasi Goreng", "Rp 25.000");
    await print.writeTextWith2Column("Es Teh", "Rp 5.000");
    await print.writeDashLine();
    
    // Total
    await print.writeTextWith2Column("TOTAL", "Rp 30.000", { 
      bold: true,
      size: "double"
    });
    await print.writeDashLine();
    
    // QR Code Payment
    await print.writeText("SCAN UNTUK BAYAR", { 
      align: "center", 
      bold: true 
    });
    await print.writeLineBreak();
    
    await print.printQRCode(qrisData, {
      size: "large",
      align: "center",
      errorCorrection: "M"
    });
    
    await print.writeLineBreak();
    await print.writeText("Terima Kasih", { align: "center" });
    await print.writeLineBreak({ count: 3 });
  },
  onFailed: (message) => alert("Gagal: " + message)
});
```

**Output:**
```
        TOKO SAYA
--------------------------------
Nasi Goreng              25.000
Es Teh                    5.000
--------------------------------
TOTAL                    30.000
--------------------------------
    SCAN UNTUK BAYAR
    
      [LARGE QR CODE]
      
      Terima Kasih
```

---

### 4. QR Code dengan Error Handling

```javascript
printer.connectToPrint({
  onReady: async (print) => {
    await print.printQRCode("ORDER-12345-XYZ", {
      size: "medium",
      align: "center",
      errorCorrection: "H",
      onFailed: (message) => {
        console.error("QR Code error:", message);
        alert("Tidak bisa cetak QR: " + message);
        
        // Fallback: print text biasa
        print.writeText("ORDER-12345-XYZ", { align: "center" });
      }
    });
  }
});
```

---

### 5. Multiple QR Codes

```javascript
printer.connectToPrint({
  onReady: async (print) => {
    // QR untuk Website
    await print.writeText("Website:", { bold: true });
    await print.printQRCode("https://tokosaya.com", {
      size: "small",
      align: "left"
    });
    
    await print.writeLineBreak();
    
    // QR untuk Instagram
    await print.writeText("Instagram:", { bold: true });
    await print.printQRCode("https://instagram.com/tokosaya", {
      size: "small",
      align: "left"
    });
    
    await print.writeLineBreak();
    
    // QR untuk Feedback
    await print.writeText("Survey:", { bold: true });
    await print.printQRCode("https://survey.tokosaya.com/12345", {
      size: "small",
      align: "left"
    });
  }
});
```

---

### 6. QR Code untuk Track & Trace

```javascript
const orderNumber = "ORD-2024-10-06-001";
const trackingUrl = `https://tracking.tokosaya.com/${orderNumber}`;

printer.connectToPrint({
  onReady: async (print) => {
    await print.writeText("PESANAN ANDA", { 
      align: "center", 
      bold: true 
    });
    await print.writeDashLine();
    
    await print.writeTextWith2Column("No Order", orderNumber);
    await print.writeTextWith2Column("Tanggal", "06/10/2024");
    await print.writeDashLine();
    
    await print.writeText("Lacak pesanan:", { align: "center" });
    await print.writeLineBreak();
    
    // QR untuk tracking
    await print.printQRCode(trackingUrl, {
      size: "medium",
      align: "center"
    });
    
    await print.writeLineBreak();
    await print.writeText(orderNumber, { 
      align: "center", 
      bold: true 
    });
  }
});
```

---

## 📋 API Reference

### printQRCode(text, options)

Generate dan cetak QR Code.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `text` | string | - | Text/data untuk di-encode ke QR Code |
| `options` | object | {} | Opsi konfigurasi |
| `options.size` | string | "medium" | Ukuran: "small", "medium", "large" |
| `options.align` | string | "center" | Alignment: "left", "center", "right" |
| `options.errorCorrection` | string | "M" | Error correction: "L", "M", "Q", "H" |
| `options.onFailed` | function | - | Callback jika gagal |

**Returns:** `Promise<void>`

**Error Correction Levels:**

| Level | Recovery Capability | Use Case |
|-------|-------------------|----------|
| `"L"` | ~7% | Clean environment |
| `"M"` | ~15% | Normal use (recommended) |
| `"Q"` | ~25% | Outdoor, may get dirty |
| `"H"` | ~30% | Critical data, harsh environment |

---

## 💡 Tips & Best Practices

### 1. Pilih Ukuran yang Tepat

```javascript
// Untuk payment QR → Gunakan LARGE
await print.printQRCode(qrisData, { size: "large" });

// Untuk URL/tracking → MEDIUM cukup
await print.printQRCode(url, { size: "medium" });

// Untuk data sederhana → SMALL
await print.printQRCode("12345", { size: "small" });
```

### 2. Error Correction untuk Payment

Untuk payment QR (QRIS), gunakan error correction "M" atau "Q":

```javascript
await print.printQRCode(qrisData, {
  size: "large",
  errorCorrection: "M" // atau "Q" untuk extra safety
});
```

### 3. Always Center Align untuk Payment

```javascript
// ✅ Good - Easy to scan
await print.printQRCode(qrisData, {
  size: "large",
  align: "center"
});

// ❌ Not recommended untuk payment
await print.printQRCode(qrisData, {
  align: "left"
});
```

### 4. Add Context Text

Selalu tambahkan text di atas/bawah QR untuk clarity:

```javascript
await print.writeText("SCAN UNTUK BAYAR", { 
  align: "center", 
  bold: true 
});
await print.writeLineBreak();

await print.printQRCode(qrisData, {
  size: "large",
  align: "center"
});

await print.writeLineBreak();
await print.writeText("Total: Rp 50.000", { 
  align: "center" 
});
```

### 5. Handle Errors Gracefully

```javascript
await print.printQRCode(data, {
  onFailed: async (message) => {
    console.error("QR failed:", message);
    
    // Fallback ke text
    await print.writeText("Kode: " + data, { 
      align: "center" 
    });
    
    // Atau retry
    // setTimeout(() => print.printQRCode(data), 1000);
  }
});
```

### 6. Test dengan Berbagai Data

```javascript
// Test dengan data pendek
await print.printQRCode("ABC123");

// Test dengan URL
await print.printQRCode("https://example.com/very/long/url");

// Test dengan data panjang (QRIS)
await print.printQRCode(longQrisString);
```

---

## 🎨 Contoh Lengkap: Struk Modern dengan QR

```javascript
import PrintHub from "printhub";

const printer = new PrintHub({ 
  paperSize: "58", 
  printerType: "bluetooth" 
});

// Data struk
const invoice = {
  no: "INV-001",
  date: "06/10/2024",
  items: [
    { name: "Nasi Goreng", price: 25000 },
    { name: "Es Teh", price: 5000 },
    { name: "Ayam Bakar", price: 30000 }
  ],
  total: 60000,
  payment: 100000,
  change: 40000
};

// QR Data (contoh QRIS)
const qrisData = "00020101021126...";

// Print
printer.connectToPrint({
  onReady: async (print) => {
    try {
      // === HEADER ===
      await print.writeText("TOKO SAYA", { 
        align: "center", 
        bold: true, 
        size: "double" 
      });
      await print.writeText("Jl. Contoh No. 123", { align: "center" });
      await print.writeText("Telp: 021-12345678", { align: "center" });
      await print.writeDashLine();
      
      // === INFO ===
      await print.writeTextWith2Column("No Invoice", invoice.no);
      await print.writeTextWith2Column("Tanggal", invoice.date);
      await print.writeDashLine();
      
      // === ITEMS ===
      for (const item of invoice.items) {
        await print.writeTextWith2Column(
          item.name, 
          `Rp ${item.price.toLocaleString()}`
        );
      }
      await print.writeDashLine();
      
      // === TOTAL ===
      await print.writeTextWith2Column(
        "TOTAL", 
        `Rp ${invoice.total.toLocaleString()}`, 
        { bold: true, size: "double" }
      );
      await print.writeTextWith2Column(
        "BAYAR", 
        `Rp ${invoice.payment.toLocaleString()}`
      );
      await print.writeTextWith2Column(
        "KEMBALI", 
        `Rp ${invoice.change.toLocaleString()}`, 
        { bold: true }
      );
      await print.writeDashLine();
      
      // === QR PAYMENT ===
      await print.writeText("ATAU SCAN UNTUK BAYAR", { 
        align: "center", 
        bold: true 
      });
      await print.writeLineBreak();
      
      await print.printQRCode(qrisData, {
        size: "large",
        align: "center",
        errorCorrection: "M",
        onFailed: (msg) => {
          console.error("QR Error:", msg);
          print.writeText("QR tidak tersedia", { align: "center" });
        }
      });
      
      await print.writeLineBreak();
      
      // === FOOTER ===
      await print.writeText("Terima Kasih", { 
        align: "center", 
        bold: true 
      });
      await print.writeText("Selamat Datang Kembali", { 
        align: "center" 
      });
      
      // === TRACKING QR ===
      await print.writeLineBreak();
      await print.writeText("Lacak pesanan:", { 
        align: "center", 
        bold: true 
      });
      await print.printQRCode(
        `https://track.tokosaya.com/${invoice.no}`, 
        {
          size: "small",
          align: "center"
        }
      );
      
      await print.writeLineBreak({ count: 5 });
      
      console.log("✅ Print berhasil!");
      
    } catch (error) {
      console.error("❌ Print error:", error);
      alert("Gagal mencetak: " + error.message);
    }
  },
  onFailed: (message) => {
    console.error("❌ Koneksi gagal:", message);
    alert("Tidak bisa terhubung ke printer: " + message);
  }
});
```

---

## 🔍 Troubleshooting

### QR Code tidak tercetak

**Penyebab:**
- Data terlalu panjang
- Printer tidak support bitmap
- Memory printer penuh

**Solusi:**
```javascript
// Gunakan error correction lebih rendah untuk data panjang
await print.printQRCode(longData, {
  errorCorrection: "L", // L = lebih kecil
  size: "medium" // Tidak terlalu besar
});
```

### QR Code blur/tidak jelas

**Penyebab:**
- Ukuran terlalu kecil
- Kertas thermal low quality

**Solusi:**
```javascript
// Gunakan ukuran lebih besar
await print.printQRCode(data, {
  size: "large",
  errorCorrection: "M"
});
```

### Error "Failed to generate QR Code"

**Penyebab:**
- Data tidak valid
- Canvas tidak support

**Solusi:**
```javascript
// Add try-catch dan fallback
try {
  await print.printQRCode(data, {
    onFailed: async (msg) => {
      // Fallback ke text
      await print.writeText("Data: " + data, { 
        align: "center" 
      });
    }
  });
} catch (error) {
  console.error("QR Error:", error);
}
```

---

## 📊 Use Cases Real-World

### 1. Restaurant - QRIS Payment
```javascript
// Cetak bill dengan QR payment
await print.printQRCode(qrisData, { size: "large" });
```

### 2. E-commerce - Order Tracking
```javascript
// QR untuk track pesanan
await print.printQRCode(trackingUrl, { size: "medium" });
```

### 3. Event - E-Ticket
```javascript
// QR sebagai ticket
await print.printQRCode(ticketCode, { 
  size: "large",
  errorCorrection: "H" 
});
```

### 4. Retail - Loyalty Card
```javascript
// QR membership
await print.printQRCode(memberId, { size: "medium" });
```

### 5. Feedback - Survey Link
```javascript
// QR survey
await print.printQRCode(surveyUrl, { size: "small" });
```

---

## 🎯 Kesimpulan

Fitur `printQRCode()` membuat PrintHub menjadi solusi lengkap untuk:
- ✅ Payment digital (QRIS, e-wallet)
- ✅ Order tracking & verification
- ✅ Customer engagement (survey, social media)
- ✅ Ticketing & membership
- ✅ Modern receipt dengan multiple QR codes

**Next:** Implementasi fitur `printBarcode()` untuk complement QR code! 🔥

---

**PrintHub - Making Thermal Printing Easy! 🖨️**
