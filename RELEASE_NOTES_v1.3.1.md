# 🎉 PrintHub v1.3.1 Release Notes

**Release Date:** October 7, 2024  
**Type:** Feature Release  
**Priority:** Recommended Update

---

## 🆕 What's New in v1.3.1

Two powerful new features for better receipt printing!

### 1. Multi-Column Text Printing (`writeTextMultiColumn`) 🆕

Print text in 3 or more columns - perfect for detailed receipts!

```javascript
await print.writeTextMultiColumn(
  ["No", "Item", "Qty", "Price"],
  {
    columnWidths: [3, 15, 5, 9],
    align: ["left", "left", "center", "right"],
    bold: true
  }
);
```

**Perfect for:**
- Receipts with quantity information
- Invoice details with multiple columns
- Inventory reports
- Product catalogs
- Any tabular data

### 2. Auto-Wrapping Text (`writeWrappedText`) 🆕

Automatically wrap long text to multiple lines!

```javascript
await print.writeWrappedText(
  "Jl. Sudirman No. 123, Blok A, RT 01/RW 02, Kelurahan Menteng, Jakarta Pusat",
  { align: "justify" }
);
```

**Perfect for:**
- Long addresses
- Product descriptions
- Terms & conditions
- Customer notes
- Special instructions

---

## ✨ Key Features

### writeTextMultiColumn()

- ✅ Support for 3+ columns
- ✅ Custom column widths or auto-calculated
- ✅ Individual alignment per column
- ✅ Bold, underline, double size options
- ✅ Smart truncation with "~" indicator
- ✅ Paper size aware (58mm/80mm)
- ✅ Bluetooth & USB support

### writeWrappedText()

- ✅ Auto word-wrapping
- ✅ Word preservation (no mid-word breaks)
- ✅ Justify alignment with even spacing
- ✅ Left, center, right, justify modes
- ✅ Custom maxWidth option
- ✅ Bold, underline, double size options
- ✅ Smart long-word handling

---

## 📖 Complete Example

```javascript
const printer = new PrintHub({ paperSize: "58" });

printer.connectToPrint({
  onReady: async (print) => {
    // Store header
    await print.writeText("TOKO SAYA", {
      align: "center",
      bold: true,
      size: "double"
    });
    await print.writeDashLine();
    
    // Address with auto-wrap
    await print.writeText("Alamat:", { bold: true });
    await print.writeWrappedText(
      "Jl. Sudirman No. 123, Blok A, RT 01/RW 02, Kelurahan Menteng, Jakarta Pusat"
    );
    await print.writeDashLine();
    
    // Invoice info
    await print.writeTextWith2Column("No Nota", "INV-001");
    await print.writeTextWith2Column("Tanggal", "07/10/2024");
    await print.writeDashLine();
    
    // Items table with multi-column
    await print.writeTextMultiColumn(
      ["No", "Item", "Qty", "Harga"],
      {
        columnWidths: [3, 14, 5, 10],
        align: ["left", "left", "center", "right"],
        bold: true
      }
    );
    
    await print.writeTextMultiColumn(
      ["1", "Nasi Goreng", "2", "50.000"],
      {
        columnWidths: [3, 14, 5, 10],
        align: ["left", "left", "center", "right"]
      }
    );
    
    await print.writeTextMultiColumn(
      ["2", "Es Teh", "3", "15.000"],
      {
        columnWidths: [3, 14, 5, 10],
        align: ["left", "left", "center", "right"]
      }
    );
    
    await print.writeDashLine();
    
    // Total
    await print.writeTextMultiColumn(
      ["", "", "TOTAL:", "65.000"],
      {
        columnWidths: [3, 14, 5, 10],
        align: ["left", "left", "right", "right"],
        bold: true
      }
    );
    
    await print.writeDashLine();
    
    // Terms with auto-wrap and justify
    await print.writeText("SYARAT & KETENTUAN", {
      bold: true,
      underline: true
    });
    await print.writeWrappedText(
      "Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan kecuali ada cacat produksi",
      { align: "justify" }
    );
    
    await print.writeLineBreak({ count: 3 });
  },
  onFailed: (message) => console.error(message)
});
```

---

## 📚 Documentation

Comprehensive guides available:

1. **[MULTICOLUMN_GUIDE.md](./MULTICOLUMN_GUIDE.md)** (12 KB)
   - Complete multi-column usage guide
   - Width templates and best practices
   - 10+ real-world examples

2. **[WRAPPEDTEXT_GUIDE.md](./WRAPPEDTEXT_GUIDE.md)** (14 KB)
   - Complete wrapped text guide
   - Alignment modes explained
   - Technical details and algorithms

3. **[USAGE_GUIDE.md](./USAGE_GUIDE.md)**
   - Updated with both new features
   - Complete API reference

4. **[README.md](./readme.md)**
   - Quick start examples
   - API table updated

---

## 🧪 Testing

Two interactive test pages included:

### test-multicolumn.html
- Beautiful gradient UI
- Two test scenarios
- Paper size selection
- Code examples

### test-wrappedtext.html
- Live wrap preview
- Three test scenarios
- Alignment options
- Real-time visualization

---

## 🚀 Installation & Upgrade

### New Installation

**NPM:**
```bash
npm install printhub@1.3.1
```

**CDN:**
```html
<script src="https://cdn.jsdelivr.net/npm/printhub@1.3.1/dist/index.global.js"></script>
```

### Upgrade from Previous Version

```bash
npm update printhub
```

**No breaking changes!** All existing code continues to work.

---

## 📊 Statistics

### Code
- **Lines Added:** ~450 lines
- **New Public Methods:** 2
- **New Private Helpers:** 5
- **Build Size:** 103 KB (+1 KB)

### Documentation
- **New Guides:** 2 (26 KB total)
- **Test Files:** 2 (38 KB total)
- **Examples:** 20+

### Quality
- **TypeScript Errors:** 0
- **Breaking Changes:** 0
- **Backward Compatible:** 100%

---

## 🎯 Use Cases

### Retail & E-commerce
- Detailed receipts with quantities
- Product descriptions
- Store address and contact info
- Terms & conditions on receipts

### Restaurants & F&B
- Order details with quantities
- Kitchen instructions
- Store policies
- Customer notes

### Logistics & Shipping
- Multi-line addresses
- Shipping instructions
- Package contents with quantities
- Delivery notes

### General Business
- Invoices with line items
- Quotations
- Inventory reports
- Product catalogs

---

## 💡 Pro Tips

### Multi-Column Tips

1. **Use Constants** for consistent widths
```javascript
const WIDTHS = [3, 15, 5, 9];
```

2. **Right-align** numbers and prices
```javascript
align: ["left", "left", "center", "right"]
```

3. **Bold headers** for clarity
```javascript
await print.writeTextMultiColumn(headers, { bold: true });
```

### Wrapped Text Tips

1. **Use justify** for professional look
```javascript
{ align: "justify" }
```

2. **Bold important** terms
```javascript
{ bold: true, align: "left" }
```

3. **Add spacing** between sections
```javascript
await print.writeLineBreak();
```

---

## 🔧 API Reference

### writeTextMultiColumn()

```typescript
writeTextMultiColumn(
  columns: string[],
  options?: {
    columnWidths?: number[];
    align?: string[];
    bold?: boolean;
    underline?: boolean;
    size?: string;
  }
): Promise<void>
```

### writeWrappedText()

```typescript
writeWrappedText(
  text: string,
  options?: {
    bold?: boolean;
    underline?: boolean;
    align?: string;
    size?: string;
    maxWidth?: number;
  }
): Promise<void>
```

---

## ⚠️ Important Notes

### Paper Width Limits

| Paper Size | Characters | With Double Size |
|------------|------------|------------------|
| 58mm | 32 chars | 16 chars |
| 80mm | 42 chars | 21 chars |

### Text Wrapping

- Words are kept intact (no mid-word breaks)
- Last line is NOT justified (intentional)
- Very long words are broken if needed

### Multi-Column

- Total column widths must not exceed paper width
- Text longer than column width is truncated with "~"
- Use same widths for all rows for alignment

---

## 🐛 Bug Fixes

None in this release (feature-only update).

---

## 🔜 Coming Next

Planned features for future releases:

- `cutPaper()` - Auto paper cutting
- `openCashDrawer()` - Cash drawer control
- `printTable()` - Advanced table with borders
- `useTemplate()` - Template system

See [FEATURE_IDEAS.md](./FEATURE_IDEAS.md) for full roadmap.

---

## 🙏 Acknowledgments

Thanks to all users who requested these features!

---

## 📞 Support

- **GitHub Issues:** https://github.com/defuj/printhub/issues
- **Documentation:** https://github.com/defuj/printhub
- **Demo:** https://defuj.github.io/printhub/

---

## 📝 License

MIT License - See [LICENSE](./LICENSE) file for details.

---

**PrintHub v1.3.1** - Making Thermal Printing Even Better! 🖨️✨

**Happy Printing!** 🎉
