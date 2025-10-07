# 🎉 PrintHub v1.3.0 Release Notes

**Release Date:** October 7, 2024  
**Type:** Feature Release  
**Priority:** Recommended Update

---

## 🆕 New Feature: Multi-Column Text Printing

### `writeTextMultiColumn()` - Print 3+ Columns

PrintHub now supports printing text in multiple columns (3 or more), making it perfect for creating structured receipts, invoices, and reports with tabular data!

---

## ✨ What's New

### Main Feature

```javascript
// Print a beautiful 4-column receipt
await print.writeTextMultiColumn(
  ["No", "Item", "Qty", "Price"],
  {
    columnWidths: [3, 15, 5, 9],
    align: ["left", "left", "center", "right"],
    bold: true
  }
);
```

**Key Features:**
- ✅ Support for 3 or more columns
- ✅ Custom column widths or auto-calculated
- ✅ Individual alignment per column (left/center/right)
- ✅ Bold, underline, and double size options
- ✅ Automatic text truncation for long text
- ✅ Works with 58mm and 80mm paper
- ✅ Full Bluetooth and USB support

---

## 📊 Use Cases

Perfect for:

### 1. Restaurant Receipts
```javascript
// No | Item | Qty | Price
await print.writeTextMultiColumn(
  ["1", "Nasi Goreng", "2x", "Rp 50.000"],
  {
    columnWidths: [3, 15, 5, 9],
    align: ["left", "left", "center", "right"]
  }
);
```

### 2. Inventory Lists
```javascript
// Code | Product | Stock | Price | Status
await print.writeTextMultiColumn(
  ["P001", "Product A", "100", "25.000", "OK"],
  {
    columnWidths: [6, 15, 7, 8, 6],
    align: ["left", "left", "center", "right", "center"]
  }
);
```

### 3. Sales Reports
```javascript
// Date | Items Sold | Total Revenue
await print.writeTextMultiColumn(
  ["2024-10-01", "45", "1.250.000"],
  {
    align: ["left", "center", "right"]
  }
);
```

---

## 🎯 Features in Detail

### 1. Flexible Column Widths

**Auto-calculated:**
```javascript
// Equal distribution (58mm = 32 chars ÷ 4 = 8 per column)
await print.writeTextMultiColumn(
  ["Col1", "Col2", "Col3", "Col4"]
);
```

**Custom widths:**
```javascript
// Precise control
await print.writeTextMultiColumn(
  ["No", "Item Name", "Qty", "Price"],
  { columnWidths: [3, 15, 5, 9] } // Total = 32 chars
);
```

### 2. Individual Column Alignment

```javascript
await print.writeTextMultiColumn(
  ["Left Text", "Centered", "Right Number"],
  {
    align: ["left", "center", "right"]
  }
);
```

**Best practices:**
- Item numbers: `left`
- Item names: `left`
- Quantities: `center`
- Prices/amounts: `right`

### 3. Styling Options

```javascript
// Bold header
await print.writeTextMultiColumn(
  ["No", "Item", "Qty", "Price"],
  { bold: true, underline: true }
);

// Normal data rows
await print.writeTextMultiColumn(data);

// Bold + large total
await print.writeTextMultiColumn(
  ["", "", "TOTAL:", "150.000"],
  { bold: true, size: "double" }
);
```

### 4. Smart Text Handling

- **Auto-truncation:** Long text automatically truncated with "~"
- **Width validation:** Prevents overflow with error message
- **Empty columns:** Create merged cell effect

---

## 📖 Complete Example

```javascript
const printer = new PrintHub({ paperSize: "58" });

printer.connectToPrint({
  onReady: async (print) => {
    // Header
    await print.writeText("RESTAURANT ABC", {
      align: "center",
      bold: true,
      size: "double"
    });
    await print.writeDashLine();
    
    // Invoice info
    await print.writeTextWith2Column("Invoice", "INV-001");
    await print.writeTextWith2Column("Date", "07/10/2024");
    await print.writeDashLine();
    
    // Table header
    await print.writeTextMultiColumn(
      ["No", "Item", "Qty", "Price"],
      {
        columnWidths: [3, 15, 5, 9],
        align: ["left", "left", "center", "right"],
        bold: true
      }
    );
    await print.writeDashLine();
    
    // Items
    await print.writeTextMultiColumn(
      ["1", "Nasi Goreng", "2", "50.000"],
      {
        columnWidths: [3, 15, 5, 9],
        align: ["left", "left", "center", "right"]
      }
    );
    
    await print.writeTextMultiColumn(
      ["2", "Es Teh", "3", "15.000"],
      {
        columnWidths: [3, 15, 5, 9],
        align: ["left", "left", "center", "right"]
      }
    );
    
    await print.writeDashLine();
    
    // Total
    await print.writeTextMultiColumn(
      ["", "", "TOTAL:", "65.000"],
      {
        columnWidths: [3, 15, 5, 9],
        align: ["left", "left", "right", "right"],
        bold: true
      }
    );
    
    await print.writeLineBreak({ count: 3 });
  },
  onFailed: (message) => {
    console.error(message);
  }
});
```

---

## 📚 Documentation

Comprehensive documentation has been added:

1. **[MULTICOLUMN_GUIDE.md](./MULTICOLUMN_GUIDE.md)** - Complete guide with examples
2. **[USAGE_GUIDE.md](./USAGE_GUIDE.md)** - Updated with multi-column section
3. **[README.md](./readme.md)** - API reference and quick examples
4. **[test-multicolumn.html](./test-multicolumn.html)** - Interactive test page

---

## 🔧 API Reference

### Method Signature

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

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `columns` | string[] | Yes | Array of text for each column |
| `options.columnWidths` | number[] | No | Width of each column (auto if not set) |
| `options.align` | string[] | No | Alignment per column: "left", "center", "right" |
| `options.bold` | boolean | No | Print in bold (default: false) |
| `options.underline` | boolean | No | Print with underline (default: false) |
| `options.size` | string | No | "normal" or "double" (default: "normal") |

---

## 📏 Width Templates

### For 58mm Paper (32 characters)

```javascript
// 3 columns
[10, 11, 11]  // Equal distribution
[8, 14, 10]   // Name-focused

// 4 columns
[3, 15, 5, 9]   // Receipt format (No, Item, Qty, Price)
[4, 14, 6, 8]   // Balanced

// 5 columns
[3, 12, 5, 6, 6]  // Item list format
```

### For 80mm Paper (42 characters)

```javascript
// 4 columns
[4, 20, 8, 10]  // Receipt format (wider)

// 5 columns
[6, 15, 7, 8, 6]  // Product catalog
```

---

## 🚀 Installation & Upgrade

### New Installation

**NPM:**
```bash
npm install printhub@1.3.0
```

**CDN:**
```html
<script src="https://cdn.jsdelivr.net/npm/printhub@1.3.0/dist/index.global.js"></script>
```

### Upgrade from Previous Version

```bash
npm update printhub
```

**No breaking changes!** All existing code will continue to work.

---

## 💡 Tips & Best Practices

### 1. Consistent Widths
Use the same column widths for all rows:

```javascript
const WIDTHS = [3, 15, 5, 9];
await print.writeTextMultiColumn(header, { columnWidths: WIDTHS });
await print.writeTextMultiColumn(row1, { columnWidths: WIDTHS });
```

### 2. Proper Alignment
- **Numbers/Prices:** Right align
- **Quantities:** Center align
- **Text/Names:** Left align

### 3. Visual Hierarchy
```javascript
// Bold headers
await print.writeTextMultiColumn(header, { bold: true });

// Normal data
await print.writeTextMultiColumn(data);

// Bold + large totals
await print.writeTextMultiColumn(total, { bold: true, size: "double" });
```

### 4. Use Separators
```javascript
await print.writeTextMultiColumn(header, { bold: true });
await print.writeDashLine(); // Visual separator
// ... data rows ...
await print.writeDashLine(); // Visual separator
await print.writeTextMultiColumn(total, { bold: true });
```

---

## ⚠️ Important Notes

1. **Width Limit:** Total column widths must not exceed paper width
   - 58mm: 32 characters max
   - 80mm: 42 characters max

2. **Text Overflow:** Long text is automatically truncated with "~"

3. **Alignment:** Individual per column, not global

4. **Empty Columns:** Use empty strings to create merged cell effect

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

## 📊 Statistics

- **Lines of Code Added:** 243 lines
- **New Public Methods:** 1
- **New Test Files:** 1
- **Documentation Pages:** 5 updated/created
- **Examples Provided:** 10+
- **Build Size:** 102 KB (unchanged)
- **TypeScript Errors:** 0

---

## 🤝 Contributing

We welcome contributions! If you find bugs or have feature requests:

1. Open an issue: https://github.com/defuj/printhub/issues
2. Submit a pull request
3. Star the repository ⭐

---

## 📝 License

MIT License - See [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

Thanks to all contributors and users who requested this feature!

---

## 📞 Support

- **GitHub Issues:** https://github.com/defuj/printhub/issues
- **Documentation:** https://github.com/defuj/printhub
- **Demo:** https://defuj.github.io/printhub/

---

**PrintHub v1.3.0** - Making Thermal Printing Even Better! 🖨️✨

**Happy Printing!** 🎉
