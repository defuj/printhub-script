# 📝 PrintHub Wrapped Text Guide

Complete guide for using the `writeWrappedText()` method to automatically wrap long text to multiple lines.

---

## 🎯 Overview

The `writeWrappedText()` method automatically wraps long text to multiple lines based on paper width. This is perfect for:

- **Addresses** - Store info, shipping addresses, contact details
- **Descriptions** - Product descriptions, service info
- **Terms & Conditions** - Legal text, warranties, policies
- **Notes** - Customer notes, special instructions
- **Feedback** - Reviews, comments, messages

---

## 📖 Basic Syntax

```javascript
await print.writeWrappedText(text, options);
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Long text to be wrapped |
| `options` | Object | No | Configuration options |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `bold` | boolean | false | Print in bold |
| `underline` | boolean | false | Print with underline |
| `align` | string | "left" | Alignment: "left", "center", "right", "justify" |
| `size` | string | "normal" | Text size: "normal" or "double" |
| `maxWidth` | number | Auto | Maximum width per line (default: paper width) |

---

## 🚀 Quick Start

### Example 1: Basic Address

```javascript
await print.writeWrappedText(
  "Jl. Sudirman No. 123, Blok A, RT 01/RW 02, Kelurahan Menteng, Kecamatan Menteng, Jakarta Pusat 10310"
);
```

**Output (58mm paper):**
```
Jl. Sudirman No. 123, Blok A,
RT 01/RW 02, Kelurahan
Menteng, Kecamatan Menteng,
Jakarta Pusat 10310
```

### Example 2: With Justify Alignment

```javascript
await print.writeWrappedText(
  "Produk ini adalah hasil dari penelitian panjang yang menghasilkan kualitas terbaik dengan harga yang terjangkau untuk semua kalangan",
  { align: "justify" }
);
```

**Output (58mm paper with justify):**
```
Produk  ini  adalah hasil dari
penelitian panjang yang
menghasilkan kualitas terbaik
dengan harga yang terjangkau
untuk semua kalangan
```

### Example 3: Bold Terms & Conditions

```javascript
await print.writeWrappedText(
  "SYARAT DAN KETENTUAN: Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan kecuali ada cacat produksi. Garansi berlaku 30 hari.",
  { bold: true, align: "left" }
);
```

---

## 💡 How It Works

### 1. Word Preservation

The algorithm keeps words intact and doesn't break them mid-word:

```javascript
// Input: "Incredible amazing wonderful"
// Bad:  "Incredible ama|zing wonderful"  ❌
// Good: "Incredible amazing|wonderful"    ✅
```

### 2. Smart Line Breaking

Lines break at spaces between words:

```javascript
const text = "This is a very long sentence that needs wrapping";
// Breaks at word boundaries:
// "This is a very long"
// "sentence that needs"
// "wrapping"
```

### 3. Justify Alignment

Justify mode distributes spaces evenly across the line:

```javascript
// Without justify (left):
"Product is best quality"

// With justify:
"Product  is  best quality"
// (spaces distributed evenly)
```

### 4. Long Word Handling

Very long words that exceed line width are broken:

```javascript
// If word > maxWidth, it's broken:
"Supercalifragilisticexpialidocious"
// Becomes:
"Supercalifragilisticexpiali"
"docious"
```

---

## 📋 Alignment Modes

### Left Alignment (Default)

```javascript
await print.writeWrappedText(text, { align: "left" });
```

**Use for:** Addresses, descriptions, general text

**Output:**
```
This is left aligned
text that wraps to
multiple lines
```

### Center Alignment

```javascript
await print.writeWrappedText(text, { align: "center" });
```

**Use for:** Titles, announcements, special messages

**Output:**
```
   This is centered
    text that wraps
      to multiple
```

### Right Alignment

```javascript
await print.writeWrappedText(text, { align: "right" });
```

**Use for:** Prices, totals, right-aligned info

**Output:**
```
  This is right aligned
       text that wraps
       to multiple lines
```

### Justify Alignment

```javascript
await print.writeWrappedText(text, { align: "justify" });
```

**Use for:** Professional documents, terms, formal text

**Output:**
```
This  is  justify aligned
text that wraps to lines
with even word spacing
```

**Note:** Last line is NOT justified (left-aligned instead)

---

## 🎨 Real-World Examples

### Example 1: Complete Receipt with Address

```javascript
printer.connectToPrint({
  onReady: async (print) => {
    // Store header
    await print.writeText("TOKO SAYA", {
      align: "center",
      bold: true,
      size: "double"
    });
    
    await print.writeDashLine();
    
    // Address (wrapped automatically)
    await print.writeText("Alamat:", { bold: true });
    await print.writeWrappedText(
      "Jl. Sudirman No. 123, Blok A, RT 01/RW 02, Kelurahan Menteng, Kecamatan Menteng, Jakarta Pusat 10310"
    );
    
    await print.writeLineBreak();
    
    // Contact info (wrapped)
    await print.writeText("Kontak:", { bold: true });
    await print.writeWrappedText(
      "Telepon: 021-12345678, Fax: 021-87654321, Email: info@tokosaya.com, Website: www.tokosaya.com"
    );
    
    await print.writeLineBreak({ count: 3 });
  },
  onFailed: (message) => console.error(message)
});
```

### Example 2: Product Description

```javascript
printer.connectToPrint({
  onReady: async (print) => {
    await print.writeText("DESKRIPSI PRODUK", {
      align: "center",
      bold: true,
      underline: true
    });
    
    await print.writeDashLine();
    await print.writeLineBreak();
    
    await print.writeText("Product A", { bold: true });
    await print.writeWrappedText(
      "Produk berkualitas tinggi yang dibuat dari bahan pilihan dengan teknologi modern. Telah teruji dan terbukti memberikan hasil maksimal untuk kebutuhan sehari-hari Anda.",
      { align: "justify" }
    );
    
    await print.writeLineBreak();
    
    await print.writeText("Spesifikasi:", { bold: true });
    await print.writeWrappedText(
      "Ukuran: 20x30 cm, Berat: 500g, Warna: Hitam/Putih, Material: High-grade plastic dengan lapisan anti-scratch",
      { align: "left" }
    );
    
    await print.writeLineBreak({ count: 3 });
  },
  onFailed: (message) => console.error(message)
});
```

### Example 3: Terms & Conditions

```javascript
printer.connectToPrint({
  onReady: async (print) => {
    await print.writeText("SYARAT DAN KETENTUAN", {
      align: "center",
      bold: true,
      underline: true
    });
    
    await print.writeDashLine();
    await print.writeLineBreak();
    
    // Term 1
    await print.writeText("1. PENGEMBALIAN BARANG", { bold: true });
    await print.writeWrappedText(
      "Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan kecuali terdapat cacat produksi yang dibuktikan dengan membawa struk pembelian asli.",
      { align: "justify" }
    );
    await print.writeLineBreak();
    
    // Term 2
    await print.writeText("2. GARANSI", { bold: true });
    await print.writeWrappedText(
      "Garansi berlaku selama 30 hari sejak tanggal pembelian dengan syarat dan ketentuan yang berlaku sesuai kebijakan toko. Kerusakan akibat kesalahan pemakaian tidak ditanggung.",
      { align: "justify" }
    );
    await print.writeLineBreak();
    
    // Term 3
    await print.writeText("3. KEBIJAKAN TOKO", { bold: true });
    await print.writeWrappedText(
      "Pihak toko berhak mengubah syarat dan ketentuan sewaktu-waktu tanpa pemberitahuan terlebih dahulu. Dengan melakukan pembelian, pembeli dianggap telah menyetujui semua ketentuan yang berlaku.",
      { align: "justify" }
    );
    
    await print.writeLineBreak({ count: 2 });
    await print.writeDashLine();
    await print.writeText("Terima Kasih", { align: "center" });
    await print.writeLineBreak({ count: 3 });
  },
  onFailed: (message) => console.error(message)
});
```

### Example 4: Customer Notes

```javascript
printer.connectToPrint({
  onReady: async (print) => {
    await print.writeText("CATATAN PELANGGAN", {
      bold: true,
      underline: true
    });
    
    await print.writeLineBreak();
    
    const customerNote = "Mohon dikirim sebelum tanggal 15. Alamat pengiriman berbeda dengan alamat pembelian. Jika ada yang kurang jelas bisa hubungi saya di nomor yang tertera.";
    
    await print.writeWrappedText(customerNote, {
      align: "left"
    });
    
    await print.writeLineBreak({ count: 3 });
  },
  onFailed: (message) => console.error(message)
});
```

---

## ⚙️ Advanced Usage

### Custom Max Width

Control the exact width per line:

```javascript
// Force narrower width
await print.writeWrappedText(
  "This text will wrap at 20 characters per line regardless of paper size",
  { maxWidth: 20 }
);
```

**Use cases:**
- Create columns manually
- Force specific layout
- Indented text blocks

### Double Size with Wrapping

```javascript
await print.writeWrappedText(
  "IMPORTANT ANNOUNCEMENT IN LARGE TEXT",
  {
    size: "double",
    bold: true,
    align: "center"
  }
);
```

**Note:** Double size reduces effective width to ~16 chars (58mm) or ~21 chars (80mm)

### Multi-Style Text

Combine with other methods for rich formatting:

```javascript
// Title
await print.writeText("ALAMAT PENGIRIMAN", { bold: true });

// Wrapped address
await print.writeWrappedText(longAddress);

// Separator
await print.writeDashLine();

// Another section
await print.writeText("CATATAN", { bold: true });
await print.writeWrappedText(notes, { align: "justify" });
```

---

## 🔧 Technical Details

### Paper Width Calculation

| Paper Size | Characters | With Double Size |
|------------|------------|------------------|
| 58mm | 32 chars | 16 chars |
| 80mm | 42 chars | 21 chars |

### Word Wrapping Algorithm

1. **Clean Text:** Remove extra spaces, normalize whitespace
2. **Split Words:** Divide text into words
3. **Line Building:** Add words until line is full
4. **Wrap:** Start new line when word doesn't fit
5. **Long Words:** Break words that exceed line width
6. **Justify:** Apply even spacing (if enabled)

### Justify Algorithm

```
Text: "This is a test"
Width: 20 chars

1. Total word chars: 14
2. Spaces needed: 20 - 14 = 6
3. Gaps: 3 (between 4 words)
4. Base spaces per gap: 6 ÷ 3 = 2
5. Extra spaces: 6 % 3 = 0
6. Result: "This  is  a  test"
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: Text Not Wrapping

**Problem:** Text prints on single line

**Solution:** Check if text length > paper width

```javascript
// ❌ Bad: Short text
await print.writeWrappedText("Short"); // No wrapping needed

// ✅ Good: Long text
await print.writeWrappedText("This is a very long text that needs wrapping");
```

### Issue 2: Uneven Justify

**Problem:** Last line is left-aligned in justify mode

**Solution:** This is intentional and correct!

```javascript
// This is CORRECT behavior:
"This  is  justified text"
"with even spacing across"
"multiple lines but last"  // ← Not justified
```

### Issue 3: Word Breaking

**Problem:** Long word breaks in middle

**Solution:** This happens when word > maxWidth (expected)

```javascript
// If word length > maxWidth, it MUST break:
"Supercalifragilisticexpiali"
"docious"

// To avoid, use shorter words or wider paper
```

### Issue 4: Too Many Lines

**Problem:** Text wraps to too many lines

**Solution:** Use justify or increase maxWidth

```javascript
// ❌ Many short lines
await print.writeWrappedText(text); // Default left align

// ✅ Better distribution
await print.writeWrappedText(text, { align: "justify" });
```

---

## 📊 Best Practices

### 1. Choose Right Alignment

| Text Type | Recommended Alignment |
|-----------|----------------------|
| Addresses | left |
| Descriptions | justify |
| Terms | justify |
| Notes | left |
| Announcements | center |
| Prices/Totals | right |

### 2. Use Bold for Headers

```javascript
// ✅ Good: Clear structure
await print.writeText("ALAMAT:", { bold: true });
await print.writeWrappedText(address);

// ❌ Bad: No distinction
await print.writeWrappedText("ALAMAT: " + address);
```

### 3. Add Spacing

```javascript
await print.writeText("Section 1", { bold: true });
await print.writeWrappedText(text1);
await print.writeLineBreak(); // ← Spacing

await print.writeText("Section 2", { bold: true });
await print.writeWrappedText(text2);
```

### 4. Combine with Other Methods

```javascript
// Header
await print.writeText("INVOICE", { align: "center", bold: true });
await print.writeDashLine();

// Info
await print.writeTextWith2Column("No", "INV-001");
await print.writeDashLine();

// Wrapped text
await print.writeText("Notes:", { bold: true });
await print.writeWrappedText(longNotes);

// Footer
await print.writeDashLine();
await print.writeText("Thank You", { align: "center" });
```

---

## 🎯 Use Case Matrix

| Use Case | Alignment | Bold | Best For |
|----------|-----------|------|----------|
| Store Address | left | no | Contact info |
| Shipping Address | left | no | Delivery info |
| Product Description | justify | no | Professional look |
| Terms & Conditions | justify | yes | Legal text |
| Customer Notes | left | no | Personal messages |
| Warranty Info | justify | no | Formal text |
| Special Instructions | left | yes | Important info |
| Announcements | center | yes | Attention grabbing |

---

## 🔗 Related Methods

- **`writeText()`** - For single-line text
- **`writeTextWith2Column()`** - For two-column layout
- **`writeTextMultiColumn()`** - For 3+ columns
- **`writeDashLine()`** - Visual separator
- **`writeLineBreak()`** - Add spacing

---

## 📝 Summary

The `writeWrappedText()` method is essential for printing long text on thermal printers. Key features:

✅ **Auto-Wrapping** - Text wraps automatically based on paper width  
✅ **Word-Preserving** - Words stay intact, no mid-word breaks  
✅ **Justify Support** - Professional even spacing  
✅ **Flexible** - Bold, underline, size, alignment options  
✅ **Smart** - Handles very long words gracefully  
✅ **Compatible** - Works with 58mm and 80mm paper  

Perfect for addresses, descriptions, terms, notes, and any long text content!

---

**Happy Printing! 🖨️**
